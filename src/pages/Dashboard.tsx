import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { LexLogo } from '../components/LexLogo'
import { Plus, FileText, User, LogOut, ChevronRight } from 'lucide-react'

interface Document {
  id: string
  titre: string
  nom_client: string
  partie_adverse: string
  ton: string
  created_at: string
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('documents')
      .select('id, titre, nom_client, partie_adverse, ton, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setDocuments((data as Document[]) || [])
        setLoading(false)
      })
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short', day: 'numeric' })

  const tonColors: Record<string, string> = {
    'Très ferme': 'bg-red-50 text-red-700',
    'Ferme': 'bg-orange-50 text-orange-700',
    'Amiable': 'bg-green-50 text-green-700',
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <LexLogo />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted hidden sm:block">{profile.nom || user?.email}</span>
          <Link to="/profil" className="p-2 rounded-lg hover:bg-surface transition-colors">
            <User size={18} className="text-muted" />
          </Link>
          <button onClick={handleSignOut} className="p-2 rounded-lg hover:bg-surface transition-colors">
            <LogOut size={18} className="text-muted" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-text">
              {profile.nom ? `Bonjour, ${profile.nom.replace('Me.', '').trim().split(' ')[0]}` : 'Tableau de bord'}
            </h1>
            <p className="text-muted text-sm mt-1">
              {documents.length} mise{documents.length !== 1 ? 's' : ''} en demeure générée{documents.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/nouveau" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Nouveau document</span>
          </Link>
        </div>

        {/* Documents list */}
        {loading ? (
          <div className="text-center py-16 text-muted">Chargement…</div>
        ) : documents.length === 0 ? (
          <div className="card p-16 text-center">
            <FileText size={40} className="mx-auto text-muted mb-4" />
            <p className="text-text font-medium mb-2">Aucun document pour l'instant</p>
            <p className="text-muted text-sm mb-6">Générez votre première mise en demeure en quelques secondes</p>
            <Link to="/nouveau" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} />
              Générer mon premier document
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <Link
                key={doc.id}
                to={`/document/${doc.id}`}
                className="card p-5 flex items-center justify-between hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text text-sm">{doc.titre || `${doc.nom_client} c. ${doc.partie_adverse}`}</p>
                    <p className="text-muted text-xs mt-1">{formatDate(doc.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tonColors[doc.ton] || 'bg-gray-100 text-gray-600'}`}>
                    {doc.ton || 'Ferme'}
                  </span>
                  <ChevronRight size={16} className="text-muted group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
