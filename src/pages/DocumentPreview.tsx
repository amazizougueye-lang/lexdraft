import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { LexLogo } from '../components/LexLogo'
import { ProfileDropdown } from '../components/ui/profile-dropdown'
import { toast } from 'sonner'
import { ArrowLeft, Copy, Download } from 'lucide-react'
import { Document, Paragraph, TextRun, Packer } from 'docx'

interface Doc {
  id: string
  titre: string
  nom_client: string
  partie_adverse: string
  ton: string
  created_at: string
  contenu_genere: string
}

export default function DocumentPreview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const [doc, setDoc] = useState<Doc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setDoc(data as Doc)
        setLoading(false)
      })
  }, [id])

  const handleCopy = () => {
    navigator.clipboard.writeText(doc?.contenu_genere || '')
    toast.success('Texte copié dans le presse-papiers')
  }

  const handleExportWord = async () => {
    if (!doc) return
    try {
      const content = doc.contenu_genere

      // Construire l'en-tête du cabinet
      const headerLines: Paragraph[] = []
      if (profile.nom) {
        headerLines.push(new Paragraph({
          children: [new TextRun({ text: profile.nom, font: 'Times New Roman', size: 24, bold: true })],
          spacing: { after: 0 },
        }))
      }
      if (profile.nom_cabinet) {
        headerLines.push(new Paragraph({
          children: [new TextRun({ text: profile.nom_cabinet, font: 'Times New Roman', size: 24 })],
          spacing: { after: 0 },
        }))
      }
      if (profile.adresse) {
        headerLines.push(new Paragraph({
          children: [new TextRun({ text: profile.adresse, font: 'Times New Roman', size: 24 })],
          spacing: { after: 0 },
        }))
      }
      if (profile.telephone) {
        headerLines.push(new Paragraph({
          children: [new TextRun({ text: `Tél. : ${profile.telephone}`, font: 'Times New Roman', size: 24 })],
          spacing: { after: 0 },
        }))
      }
      // Séparateur si en-tête présente
      if (headerLines.length > 0) {
        headerLines.push(new Paragraph({
          children: [new TextRun({ text: '─'.repeat(60), font: 'Times New Roman', size: 20, color: '888888' })],
          spacing: { after: 200 },
        }))
      }

      const wordDoc = new Document({
        sections: [{
          properties: {
            page: { margin: { top: 1418, right: 1418, bottom: 1418, left: 1418 } },
          },
          children: [
            ...headerLines,
            ...content.split('\n').map(line =>
              new Paragraph({
                children: [new TextRun({ text: line, font: 'Times New Roman', size: 24 })],
                spacing: { after: line.trim() === '' ? 0 : 200 },
              })
            ),
          ],
        }],
      })
      const blob = await Packer.toBlob(wordDoc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mise-en-demeure-${doc.nom_client.replace(/[^a-zA-Z0-9]/g, '-')}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Document Word téléchargé')
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'export Word")
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  if (loading) return (
    <div
      className="flex items-center justify-center min-h-screen text-[14px]"
      style={{ background: '#091413', color: '#8aada4' }}
    >
      Chargement…
    </div>
  )

  if (!doc) return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: '#091413' }}
    >
      <div className="text-center">
        <p className="text-[14px] mb-4" style={{ color: '#8aada4' }}>Document introuvable.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Retour au tableau de bord
        </button>
      </div>
    </div>
  )

  const tonBadge = (ton: string) => {
    if (ton === 'Très ferme') return { bg: 'rgba(180,40,40,0.15)', border: 'rgba(180,40,40,0.3)', text: '#f08080' }
    if (ton === 'Ferme') return { bg: 'rgba(180,120,20,0.15)', border: 'rgba(180,120,20,0.3)', text: '#e6b050' }
    return { bg: 'rgba(40,90,72,0.15)', border: 'rgba(40,90,72,0.3)', text: '#6cc4a0' }
  }
  const tc = tonBadge(doc.ton)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#091413' }}>
      {/* ── Dark sidebar ───────────────────────────────────────── */}
      <aside
        className="w-64 shrink-0 flex flex-col overflow-y-auto"
        style={{ background: '#0a1210', borderRight: '1px solid #1e3b32' }}
      >
        {/* Sidebar header */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #1e3b32' }}>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 mb-4 text-[12px] transition-colors"
            style={{ color: '#8aada4' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#285A48')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8aada4')}
          >
            <ArrowLeft size={12} /> Tableau de bord
          </Link>
          <LexLogo />
        </div>

        {/* Metadata */}
        <div className="px-5 py-5 flex-1 space-y-5">
          <div>
            <p className="section-label mb-3">Dossier</p>
            <div className="space-y-3.5">
              <div>
                <p className="text-[10px] mb-0.5 uppercase tracking-widest font-semibold" style={{ color: '#8aada4', opacity: 0.6 }}>
                  Client
                </p>
                <p className="text-[13px] font-medium" style={{ color: '#F0F4F2' }}>{doc.nom_client}</p>
              </div>
              <div>
                <p className="text-[10px] mb-0.5 uppercase tracking-widest font-semibold" style={{ color: '#8aada4', opacity: 0.6 }}>
                  Partie adverse
                </p>
                <p className="text-[13px] font-medium" style={{ color: '#F0F4F2' }}>{doc.partie_adverse}</p>
              </div>
              <div>
                <p className="text-[10px] mb-1.5 uppercase tracking-widest font-semibold" style={{ color: '#8aada4', opacity: 0.6 }}>
                  Ton
                </p>
                <span
                  className="inline-flex items-center text-[11.5px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text }}
                >
                  {doc.ton}
                </span>
              </div>
              <div>
                <p className="text-[10px] mb-0.5 uppercase tracking-widest font-semibold" style={{ color: '#8aada4', opacity: 0.6 }}>
                  Date
                </p>
                <p className="text-[13px]" style={{ color: '#F0F4F2' }}>
                  {new Date(doc.created_at).toLocaleDateString('fr-CA')}
                </p>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: '#1e3b32' }} />

          {/* Actions */}
          <div>
            <p className="section-label mb-3">Actions</p>
            <div className="space-y-2">
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[0.75rem] text-[13px] font-medium transition-all"
                style={{ border: '1px solid #1e3b32', color: '#F0F4F2', background: 'transparent' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#122420'
                  e.currentTarget.style.borderColor = '#285A48'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = '#1e3b32'
                }}
              >
                <Copy size={14} style={{ color: '#8aada4' }} />
                Copier le texte
              </button>
              <button
                onClick={handleExportWord}
                className="btn-primary w-full flex items-center gap-2.5 px-3.5 py-2.5"
              >
                <Download size={14} />
                Télécharger Word
              </button>
            </div>
          </div>
        </div>

        {/* Confidentiality notice */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid #1e3b32' }}>
          <p className="text-[10px] leading-relaxed" style={{ color: '#8aada4', opacity: 0.5 }}>
            Vos données ne sont jamais stockées ni réutilisées par LexDraft.
          </p>
        </div>

        {/* Profile at bottom */}
        <div className="px-3 pb-4">
          <ProfileDropdown
            name={profile.nom}
            email={user?.email}
            onSignOut={handleSignOut}
          />
        </div>
      </aside>

      {/* ── Document area ──────────────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto p-10"
        style={{ background: '#ECEEF1' }}
      >
        <div
          className="max-w-[720px] mx-auto bg-white min-h-[900px] p-[60px] rounded-lg"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.05)' }}
        >
          {/* En-tête cabinet */}
          {(profile.nom || profile.nom_cabinet || profile.adresse || profile.telephone) && (
            <div className="mb-6 pb-5" style={{ borderBottom: '1px solid #d0d0d0', fontFamily: 'Times New Roman, serif' }}>
              {profile.nom && (
                <p className="text-[14.5px] font-bold" style={{ color: '#1A1A1A' }}>{profile.nom}</p>
              )}
              {profile.nom_cabinet && (
                <p className="text-[14px]" style={{ color: '#1A1A1A' }}>{profile.nom_cabinet}</p>
              )}
              {profile.adresse && (
                <p className="text-[14px]" style={{ color: '#1A1A1A' }}>{profile.adresse}</p>
              )}
              {profile.telephone && (
                <p className="text-[14px]" style={{ color: '#1A1A1A' }}>Tél. : {profile.telephone}</p>
              )}
            </div>
          )}
          <div
            className="text-[14.5px] leading-[1.8] whitespace-pre-line"
            style={{ fontFamily: 'Times New Roman, serif', color: '#1A1A1A' }}
          >
            {doc.contenu_genere}
          </div>
        </div>
      </main>
    </div>
  )
}
