import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { LexLogo } from '../components/LexLogo'
import { ProfileDropdown } from '../components/ui/profile-dropdown'
import { Footer } from '../components/ui/footer'
import { Plus, FileText, ChevronRight } from 'lucide-react'

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

  const firstName = profile.nom
    ? profile.nom.replace('Me.', '').trim().split(' ')[0]
    : null

  const tonBadge = (ton: string) => {
    if (ton === 'Très ferme') return { bg: 'rgba(180,40,40,0.15)', border: 'rgba(180,40,40,0.3)', text: '#f08080', dot: '#f08080' }
    if (ton === 'Ferme') return { bg: 'rgba(180,120,20,0.15)', border: 'rgba(180,120,20,0.3)', text: '#e6b050', dot: '#e6b050' }
    return { bg: 'rgba(40,90,72,0.15)', border: 'rgba(40,90,72,0.3)', text: '#6cc4a0', dot: '#6cc4a0' }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#091413' }}>
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="page-header">
        <LexLogo />
        <ProfileDropdown
          name={profile.nom}
          email={user?.email}
          onSignOut={handleSignOut}
        />
      </header>

      {/* ── Hero strip ─────────────────────────────────────────── */}
      <div
        className="px-6 pt-10 pb-8 relative overflow-hidden"
        style={{ background: '#0a1a18', borderBottom: '1px solid #1e3b32' }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(40,90,72,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(40,90,72,0.04) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto flex items-end justify-between">
          <div>
            <p
              className="uppercase font-bold tracking-[0.15em] mb-2"
              style={{ fontSize: '10px', color: '#8aada4' }}
            >
              Tableau de bord
            </p>
            <h1
              className="text-[28px] font-normal leading-tight tracking-[-0.02em] mb-3"
              style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
            >
              {firstName ? `Bonjour, ${firstName}` : 'Bienvenue'}
            </h1>
            <div className="flex items-baseline gap-2">
              <span
                className="text-[44px] font-bold leading-none tracking-[-0.04em]"
                style={{ color: '#285A48' }}
              >
                {documents.length}
              </span>
              <span className="text-[14px]" style={{ color: '#8aada4' }}>
                mise{documents.length !== 1 ? 's' : ''} en demeure
                {documents.length !== 1 ? ' générées' : ' générée'}
              </span>
            </div>
          </div>
          <Link to="/nouveau" className="btn-primary shrink-0 flex items-center gap-1.5">
            <Plus size={15} />
            Nouveau document
          </Link>
        </div>
      </div>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-[14px]" style={{ color: '#8aada4' }}>
            Chargement…
          </div>
        ) : documents.length === 0 ? (
          /* Empty state */
          <div
            className="rounded-[1rem] py-20 px-8 text-center"
            style={{ background: '#0f1f1d', border: '1px solid #1e3b32' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: 'linear-gradient(135deg, #2f6b56, #1e4a38)',
                boxShadow: '0 4px 16px rgba(40,90,72,0.3)',
              }}
            >
              <FileText size={26} style={{ color: '#F0F4F2' }} />
            </div>
            <p
              className="font-semibold text-[16px] mb-2 tracking-[-0.01em]"
              style={{ color: '#F0F4F2' }}
            >
              Votre premier document vous attend
            </p>
            <p className="text-[13px] mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: '#8aada4' }}>
              Générez une mise en demeure professionnelle<br />en moins de 30 secondes.
            </p>
            <Link to="/nouveau" className="btn-primary inline-flex items-center gap-1.5">
              <Plus size={14} />
              Générer mon premier document
            </Link>
          </div>
        ) : (
          /* Document list */
          <div className="space-y-2">
            {documents.map(doc => {
              const tc = tonBadge(doc.ton)
              return (
                <Link
                  key={doc.id}
                  to={`/document/${doc.id}`}
                  className="group flex items-center justify-between px-5 py-4 rounded-[0.75rem] transition-all duration-200"
                  style={{
                    background: '#0f1f1d',
                    border: '1px solid #1e3b32',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.background = '#162925'
                    el.style.borderColor = '#285A48'
                    el.style.transform = 'translateY(-1px)'
                    el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.background = '#0f1f1d'
                    el.style.borderColor = '#1e3b32'
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(40,90,72,0.15)' }}
                    >
                      <FileText size={16} style={{ color: '#285A48' }} />
                    </div>
                    <div>
                      <p
                        className="font-semibold text-[13.5px] leading-snug tracking-[-0.01em]"
                        style={{ color: '#F0F4F2' }}
                      >
                        {doc.titre || `${doc.nom_client} c. ${doc.partie_adverse}`}
                      </p>
                      <p className="text-[12px] mt-0.5" style={{ color: '#8aada4' }}>
                        {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11.5px] px-2.5 py-1 rounded-full font-medium"
                      style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tc.dot }} />
                      {doc.ton || 'Ferme'}
                    </span>
                    <ChevronRight
                      size={14}
                      className="transition-colors group-hover:text-[#285A48]"
                      style={{ color: '#1e3b32' }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
