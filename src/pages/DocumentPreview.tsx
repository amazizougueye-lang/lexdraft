import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { LexLogo } from '../components/LexLogo'
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
      const wordDoc = new Document({
        sections: [{
          properties: {
            page: { margin: { top: 1418, right: 1418, bottom: 1418, left: 1418 } },
          },
          children: content.split('\n').map(line =>
            new Paragraph({
              children: [new TextRun({ text: line, font: 'Times New Roman', size: 24 })],
              spacing: { after: line.trim() === '' ? 0 : 200 },
            })
          ),
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
      toast.error('Erreur lors de l\'export Word')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-muted">Chargement…</div>
  )

  if (!doc) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-text mb-4">Document introuvable.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">Retour au tableau de bord</button>
      </div>
    </div>
  )

  const tonColors: Record<string, string> = {
    'Très ferme': 'bg-red-50 text-red-700',
    'Ferme': 'bg-orange-50 text-orange-700',
    'Amiable': 'bg-green-50 text-green-700',
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-border bg-white flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted text-sm hover:text-text mb-5 transition-colors">
            <ArrowLeft size={16} /> Tableau de bord
          </Link>
          <LexLogo />
        </div>

        <div className="p-6 space-y-5 flex-1">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-3">Dossier</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted">Client</p>
                <p className="text-sm font-medium text-text">{doc.nom_client}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Partie adverse</p>
                <p className="text-sm font-medium text-text">{doc.partie_adverse}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Ton</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tonColors[doc.ton] || 'bg-gray-100 text-gray-600'}`}>
                  {doc.ton}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted">Date</p>
                <p className="text-sm text-text">
                  {new Date(doc.created_at).toLocaleDateString('fr-CA')}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-3">Actions</p>
            <div className="space-y-2">
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text hover:bg-surface transition-colors"
              >
                <Copy size={16} className="text-muted" /> Copier le texte
              </button>
              <button
                onClick={handleExportWord}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
              >
                <Download size={16} /> Télécharger Word
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Document */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-16 min-h-[800px]">
          <div
            className="font-document text-[15px] leading-relaxed text-gray-900 whitespace-pre-line"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            {doc.contenu_genere}
          </div>
        </div>
      </main>
    </div>
  )
}
