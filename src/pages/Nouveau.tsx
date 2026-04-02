import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, N8N_WEBHOOK } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { LexLogo } from '../components/LexLogo'
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

export default function Nouveau() {
  const { user } = useAuth()
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
      // Extract text from uploaded pieces
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

      // Fetch style reference
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

      // Call n8n webhook
      const response = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          opposingParty,
          litigeSummary,
          amount,
          deadline,
          tone,
          nom: profile.nom || '',
          introduction: styleIntroduction,
          faits_extraits: faitsExtraits.trim(),
        }),
      })

      if (!response.ok) throw new Error(`Erreur webhook: ${response.status}`)

      const data = await response.json()
      const contenuGenere = data.content || data.med_text || data.text || JSON.stringify(data)

      if (!contenuGenere) throw new Error('Aucun contenu reçu')

      // Save to Supabase
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

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-border px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-surface transition-colors">
          <ArrowLeft size={18} className="text-muted" />
        </Link>
        <LexLogo />
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text">Nouveau document</h1>
          <p className="text-muted text-sm mt-1">Remplissez les informations pour générer votre mise en demeure</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="font-medium text-text text-sm uppercase tracking-widest text-muted">Parties</h2>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Client <span className="text-red-500">*</span></label>
              <input className="input-field" placeholder="Nom du client ou de la société" value={clientName} onChange={e => setClientName(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Partie adverse <span className="text-red-500">*</span></label>
              <input className="input-field" placeholder="Nom de la partie adverse" value={opposingParty} onChange={e => setOpposingParty(e.target.value)} required />
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h2 className="font-medium text-text text-sm uppercase tracking-widest text-muted">Litige</h2>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Résumé des faits <span className="text-red-500">*</span></label>
              <textarea
                className="input-field min-h-[120px] resize-y"
                placeholder="Décrivez le litige, les manquements, les montants en jeu et les tentatives de résolution…"
                value={litigeSummary}
                onChange={e => setLitigeSummary(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Montant réclamé</label>
                <input className="input-field" placeholder="ex: 25000" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">Date limite de réponse</label>
                <input type="date" className="input-field" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Ton</label>
              <div className="flex gap-3">
                {['Amiable', 'Ferme', 'Très ferme'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      tone === t
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-text border-border hover:border-primary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-medium text-text text-sm uppercase tracking-widest text-muted">Pièces justificatives</h2>
            <p className="text-xs text-muted">Contrats, courriels, factures… (.docx ou .txt)</p>

            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => pieceRef.current?.click()}
            >
              <Upload size={24} className="mx-auto text-muted mb-2" />
              <p className="text-sm text-muted">Cliquez ou glissez vos fichiers ici</p>
              <p className="text-xs text-muted mt-1">.docx et .txt uniquement</p>
              <input ref={pieceRef} type="file" accept=".docx,.txt" multiple className="hidden" onChange={handlePieceAdd} />
            </div>

            {pieceFiles.length > 0 && (
              <div className="space-y-2">
                {pieceFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-surface rounded-lg px-4 py-2.5">
                    <span className="text-sm text-text">{file.name}</span>
                    <button type="button" onClick={() => setPieceFiles(prev => prev.filter((_, j) => j !== i))}>
                      <X size={16} className="text-muted hover:text-text" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={generating}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base"
          >
            {generating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Génération en cours… (~20s)
              </>
            ) : (
              'Générer le premier draft →'
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
