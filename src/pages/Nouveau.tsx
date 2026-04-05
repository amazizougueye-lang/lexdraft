import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, N8N_WEBHOOK } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { LexLogo } from '../components/LexLogo'
import { ProfileDropdown } from '../components/ui/profile-dropdown'
import { Footer } from '../components/ui/footer'
import { toast } from 'sonner'
import { Upload, X, Loader2, ArrowLeft } from 'lucide-react'

declare global { interface Window { mammoth: { extractRawText: (opts: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }> } } }

async function extractDocxText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const mammoth = (await import('mammoth')).default
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  } catch {
    return ''
  }
}

const TONE_CONFIG = {
  'Amiable': { color: '#6cc4a0', border: 'rgba(40,90,72,0.5)', bg: 'rgba(40,90,72,0.15)', desc: 'Ton cordial, solution à l\'amiable' },
  'Ferme': { color: '#e6b050', border: 'rgba(180,120,20,0.5)', bg: 'rgba(180,120,20,0.12)', desc: 'Ton professionnel et assertif' },
  'Très ferme': { color: '#f08080', border: 'rgba(180,40,40,0.5)', bg: 'rgba(180,40,40,0.12)', desc: 'Ton strict, dernière mise en garde' },
}

function SectionCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[0.75rem] p-6 space-y-4" style={{ background: '#0f1f1d', border: '1px solid #1e3b32' }}>
      <div className="flex items-center gap-3">
        <div className="step-number">{step}</div>
        <p className="font-semibold text-[15px]" style={{ color: '#F0F4F2' }}>{title}</p>
      </div>
      {children}
    </div>
  )
}

export default function Nouveau() {
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const navigate = useNavigate()

  const [clientName, setClientName] = useState('')
  const [opposingParty, setOpposingParty] = useState('')
  const [litigeSummary, setLitigeSummary] = useState('')
  const [amount, setAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [tone, setTone] = useState('Ferme')
  const [pieceFiles, setPieceFiles] = useState<File[]>([])
  const [generating, setGenerating] = useState(false)
  const [generatingVariants, setGeneratingVariants] = useState(false)
  const [variantsPreview, setVariantsPreview] = useState<{ ton: string; contenu: string }[] | null>(null)
  const pieceRef = useRef<HTMLInputElement>(null)

  const handlePieceAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const valid = files.filter(f => f.name.endsWith('.docx') || f.name.endsWith('.txt'))
    if (valid.length < files.length) toast.error('Seuls les fichiers .docx et .txt sont acceptés')
    setPieceFiles(prev => [...prev, ...valid])
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName.trim() || !opposingParty.trim() || !litigeSummary.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires.')
      return
    }
    setGenerating(true)
    toast.loading('Génération en cours…', { id: 'gen' })
    try {
      let faitsExtraits = ''
      for (const file of pieceFiles) {
        if (file.name.endsWith('.docx')) {
          const text = await extractDocxText(file)
          if (text) faitsExtraits += `\n\n--- ${file.name} ---\n${text}`
        } else {
          const text = await file.text()
          if (text) faitsExtraits += `\n\n--- ${file.name} ---\n${text}`
        }
      }
      let styleIntroduction = profile.introduction || ''
      if (user) {
        const { data: styleFile } = await supabase
          .from('fichiers_style')
          .select('contenu_extrait')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (styleFile?.contenu_extrait) styleIntroduction = styleFile.contenu_extrait
      }
      const response = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName, opposingParty, litigeSummary, amount, deadline, tone,
          nom: profile.nom || '',
          introduction: styleIntroduction,
          faits_extraits: faitsExtraits.trim(),
        }),
      })
      if (!response.ok) throw new Error(`Erreur webhook: ${response.status}`)
      const data = await response.json()
      const contenuGenere = data.content || data.med_text || data.text || JSON.stringify(data)
      if (!contenuGenere) throw new Error('Aucun contenu reçu')
      const { data: doc, error } = await supabase
        .from('documents')
        .insert({
          user_id: user?.id,
          titre: `${clientName} c. ${opposingParty}`,
          nom_client: clientName,
          partie_adverse: opposingParty,
          resume_litige: litigeSummary,
          montant: amount,
          date_limite: deadline,
          ton: tone,
          contenu_genere: contenuGenere,
        })
        .select()
        .single()
      if (error) throw error
      toast.success('Mise en demeure générée !', { id: 'gen' })
      navigate(`/document/${doc.id}`)
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la génération. Réessayez.', { id: 'gen' })
      setGenerating(false)
    }
  }

  const handleGenerateVariants = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!clientName.trim() || !opposingParty.trim() || !litigeSummary.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires.')
      return
    }
    setGeneratingVariants(true)
    toast.loading('Génération des 3 variantes…', { id: 'variants' })
    try {
      let faitsExtraits = ''
      for (const file of pieceFiles) {
        if (file.name.endsWith('.docx')) {
          const text = await extractDocxText(file)
          if (text) faitsExtraits += `\n\n--- ${file.name} ---\n${text}`
        } else {
          const text = await file.text()
          if (text) faitsExtraits += `\n\n--- ${file.name} ---\n${text}`
        }
      }
      let styleIntroduction = profile.introduction || ''
      if (user) {
        const { data: styleFile } = await supabase
          .from('fichiers_style')
          .select('contenu_extrait')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (styleFile?.contenu_extrait) styleIntroduction = styleFile.contenu_extrait
      }

      const tones = ['Amiable', 'Ferme', 'Très ferme']
      const results = await Promise.all(
        tones.map(t =>
          fetch(N8N_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientName, opposingParty, litigeSummary, amount, deadline, tone: t,
              nom: profile.nom || '',
              introduction: styleIntroduction,
              faits_extraits: faitsExtraits.trim(),
            }),
          }).then(r => r.json())
        )
      )

      const variants = tones.map((t, i) => ({
        ton: t,
        contenu: results[i].content || results[i].med_text || results[i].text || JSON.stringify(results[i]),
      }))

      setVariantsPreview(variants)
      toast.dismiss('variants')
      setGeneratingVariants(false)
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la génération des variantes.', { id: 'variants' })
      setGeneratingVariants(false)
    }
  }

  const handleSelectVariant = async (selectedTon: string) => {
    if (!variantsPreview) return
    const selected = variantsPreview.find(v => v.ton === selectedTon)
    if (!selected) return

    try {
      const { data: doc, error } = await supabase
        .from('documents')
        .insert({
          user_id: user?.id,
          titre: `${clientName} c. ${opposingParty}`,
          nom_client: clientName,
          partie_adverse: opposingParty,
          resume_litige: litigeSummary,
          montant: amount,
          date_limite: deadline,
          ton: selected.ton,
          contenu_genere: selected.contenu,
        })
        .select()
        .single()
      if (error) throw error
      toast.success(`Variante "${selected.ton}" sauvegardée !`)
      setVariantsPreview(null)
      navigate(`/document/${doc.id}`)
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la sauvegarde.')
    }
  }

  const handleSignOut = async () => { await signOut(); navigate('/login') }


  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#091413' }}>
      <header className="page-header">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="btn-ghost p-2">
            <ArrowLeft size={16} />
          </Link>
          <LexLogo />
        </div>
        <ProfileDropdown name={profile.nom} email={user?.email} onSignOut={handleSignOut} />
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-[26px] font-normal leading-tight tracking-[-0.02em]"
            style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
          >
            Nouveau document
          </h1>
          <p className="text-[13px] mt-1" style={{ color: '#8aada4' }}>
            Remplissez les informations pour générer votre mise en demeure
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Step 1 — Parties */}
          <SectionCard step="1" title="Parties">
            <div>
              <label className="field-label">
                Client <span style={{ color: '#f08080' }}>*</span>
              </label>
              <input
                className="input-field"
                placeholder="Nom du client ou de la société"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label">
                Partie adverse <span style={{ color: '#f08080' }}>*</span>
              </label>
              <input
                className="input-field"
                placeholder="Nom de la partie adverse"
                value={opposingParty}
                onChange={e => setOpposingParty(e.target.value)}
                required
              />
            </div>
          </SectionCard>

          {/* Step 2 — Litige */}
          <SectionCard step="2" title="Litige">
            <div>
              <label className="field-label">
                Résumé des faits <span style={{ color: '#f08080' }}>*</span>
              </label>
              <textarea
                className="input-field min-h-[120px] resize-y"
                placeholder="Décrivez le litige, les manquements, les montants en jeu et les tentatives de résolution…"
                value={litigeSummary}
                onChange={e => setLitigeSummary(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Montant réclamé</label>
                <input
                  key="amount-input"
                  className="input-field"
                  placeholder="ex: 25 000 $"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Date limite de réponse</label>
                <input
                  type="date"
                  className="input-field"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Tone picker */}
            <div>
              <label className="field-label mb-3">Ton</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(TONE_CONFIG) as [string, typeof TONE_CONFIG[keyof typeof TONE_CONFIG]][]).map(([t, cfg]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className="flex flex-col items-start px-3.5 py-3 rounded-[0.75rem] text-left transition-all duration-150"
                    style={{
                      background: tone === t ? cfg.bg : 'transparent',
                      border: `1.5px solid ${tone === t ? cfg.border : '#1e3b32'}`,
                      boxShadow: tone === t ? `0 0 0 1px ${cfg.border}` : 'none',
                    }}
                  >
                    <span
                      className="text-[12px] font-semibold leading-none mb-1"
                      style={{ color: tone === t ? cfg.color : '#F0F4F2' }}
                    >
                      {t}
                    </span>
                    <span className="text-[11px] leading-snug" style={{ color: '#8aada4' }}>
                      {cfg.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Step 3 — Pièces */}
          <SectionCard step="3" title="Pièces justificatives">
            <p className="text-[12px] -mt-2" style={{ color: '#8aada4' }}>
              Contrats, courriels, factures… (.docx ou .txt)
            </p>
            <div
              className="rounded-[0.75rem] p-5 text-center cursor-pointer transition-all"
              style={{ border: '1.5px dashed #1e3b32' }}
              onClick={() => pieceRef.current?.click()}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#285A48'
                e.currentTarget.style.background = 'rgba(40,90,72,0.04)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e3b32'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Upload size={20} className="mx-auto mb-2" style={{ color: '#8aada4' }} />
              <p className="text-[13px]" style={{ color: '#8aada4' }}>Cliquez ou glissez vos fichiers ici</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#8aada4', opacity: 0.5 }}>.docx et .txt uniquement</p>
              <input ref={pieceRef} type="file" accept=".docx,.txt" multiple className="hidden" onChange={handlePieceAdd} />
            </div>

            {pieceFiles.length > 0 && (
              <div className="space-y-1.5">
                {pieceFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-[0.75rem] px-3.5 py-2.5"
                    style={{ background: '#122420', border: '1px solid #1e3b32' }}
                  >
                    <span className="text-[13px] truncate" style={{ color: '#F0F4F2' }}>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setPieceFiles(prev => prev.filter((_, j) => j !== i))}
                      className="ml-3 shrink-0 p-0.5 rounded transition-colors"
                      style={{ color: '#8aada4' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Generate CTA */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={generating || generatingVariants}
              className="btn-primary w-full flex items-center justify-center gap-2.5 py-4 text-[15px]"
            >
              {generating ? (
                <><Loader2 size={17} className="animate-spin" />Génération en cours… (~20s)</>
              ) : (
                'Générer la mise en demeure →'
              )}
            </button>
            <button
              type="button"
              onClick={handleGenerateVariants}
              disabled={generating || generatingVariants}
              className="w-full flex items-center justify-center gap-2.5 py-4 text-[15px] font-medium rounded-[0.75rem] transition-all"
              style={{ background: 'transparent', border: '1.5px solid #1e3b32', color: '#8aada4' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#285A48'; e.currentTarget.style.color = '#F0F4F2' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3b32'; e.currentTarget.style.color = '#8aada4' }}
            >
              {generatingVariants ? (
                <><Loader2 size={17} className="animate-spin" />Génération des 3 variantes… (~60s)</>
              ) : (
                'Générer 3 variantes (Amiable · Ferme · Très ferme)'
              )}
            </button>
            <p className="text-center text-[11px]" style={{ color: '#8aada4', opacity: 0.6 }}>
              {variantsPreview ? 'Choisissez la variante à sauvegarder' : 'Les 3 variantes s\'afficheront ici pour sélection'}
            </p>
          </div>
        </form>

        {/* Variantes Preview Modal */}
        {variantsPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col" style={{ background: '#0f1f1d' }}>
              <div className="p-6 border-b" style={{ borderColor: '#1e3b32' }}>
                <h2 className="text-[20px] font-semibold" style={{ color: '#F0F4F2' }}>Choisissez votre variante</h2>
                <p className="text-[13px] mt-1" style={{ color: '#8aada4' }}>Sélectionnez le ton qui convient le mieux à votre dossier</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-3 gap-4 p-6">
                  {variantsPreview.map(variant => (
                    <div
                      key={variant.ton}
                      className="rounded-lg p-4 cursor-pointer transition-all border-2"
                      style={{ background: '#122420', border: '2px solid #1e3b32' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#285A48'
                        e.currentTarget.style.background = 'rgba(40,90,72,0.1)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#1e3b32'
                        e.currentTarget.style.background = '#122420'
                      }}
                    >
                      <p className="text-[14px] font-semibold mb-3" style={{ color: '#6cc4a0' }}>{variant.ton}</p>
                      <div className="text-[12px] leading-relaxed max-h-[300px] overflow-y-auto mb-4" style={{ color: '#8aada4' }}>
                        {variant.contenu.split('\n').slice(0, 15).join('\n')}
                        {variant.contenu.split('\n').length > 15 && '...'}
                      </div>
                      <button
                        onClick={() => handleSelectVariant(variant.ton)}
                        className="btn-primary w-full py-2 text-[12px]"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: '#1e3b32' }}>
                <button
                  onClick={() => setVariantsPreview(null)}
                  className="px-4 py-2 rounded-[0.75rem] text-[13px]"
                  style={{ background: '#122420', border: '1px solid #1e3b32', color: '#8aada4' }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
