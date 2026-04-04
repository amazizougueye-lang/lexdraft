import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { LexLogo } from '../components/LexLogo'
import { ProfileDropdown } from '../components/ui/profile-dropdown'
import { Footer } from '../components/ui/footer'
import { toast } from 'sonner'
import { ArrowLeft, Upload, X, Trash2, FileText, CheckCircle, Loader2 } from 'lucide-react'

interface StyleFile {
  id: string
  nom_fichier: string
  created_at: string
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[0.75rem] p-6" style={{ background: '#0f1f1d', border: '1px solid #1e3b32' }}>
      <p className="section-label mb-5">{title}</p>
      {children}
    </div>
  )
}

export default function Profil() {
  const { user, signOut } = useAuth()
  const { profile, updateProfile } = useProfile()
  const navigate = useNavigate()

  const [nom, setNom] = useState(profile.nom)
  const [domaine, setDomaine] = useState(profile.domaine)
  const [introduction, setIntroduction] = useState(profile.introduction)
  const [nomCabinet, setNomCabinet] = useState(profile.nom_cabinet)
  const [adresse, setAdresse] = useState(profile.adresse)
  const [telephone, setTelephone] = useState(profile.telephone)
  const [styleFiles, setStyleFiles] = useState<StyleFile[]>([])
  const [uploadingStyle, setUploadingStyle] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const styleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNom(profile.nom)
    setDomaine(profile.domaine)
    setIntroduction(profile.introduction)
    setNomCabinet(profile.nom_cabinet)
    setAdresse(profile.adresse)
    setTelephone(profile.telephone)
  }, [profile])

  useEffect(() => {
    if (!user) return
    supabase
      .from('fichiers_style')
      .select('id, nom_fichier, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setStyleFiles((data as StyleFile[]) || []))
  }, [user])

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    await updateProfile({ nom, domaine, introduction, nom_cabinet: nomCabinet, adresse, telephone })
    setSavingProfile(false)
    toast.success('Profil enregistré')
  }

  const handleStyleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length || !user) return
    setUploadingStyle(true)
    let uploaded = 0
    for (const file of files) {
      try {
        let contenuExtrait = ''
        if (file.name.endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer()
          const mammoth = (await import('mammoth')).default
          const result = await mammoth.extractRawText({ arrayBuffer })
          contenuExtrait = result.value
        } else if (file.name.endsWith('.txt')) {
          contenuExtrait = await file.text()
        }
        const filePath = `${user.id}/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('style-documents')
          .upload(filePath, file, { upsert: true })
        if (uploadError) { toast.error(`Upload échoué pour ${file.name}`); continue }
        const { error: insertError } = await supabase
          .from('fichiers_style')
          .insert({ user_id: user.id, nom_fichier: file.name, storage_path: filePath, taille: file.size, contenu_extrait: contenuExtrait })
        if (insertError) { toast.error(`Erreur DB pour ${file.name}`); continue }
        uploaded++
      } catch (err) {
        toast.error(`Erreur: ${String(err)}`)
      }
    }
    if (uploaded > 0) {
      toast.success(`${uploaded} fichier(s) de style enregistré(s)`)
      const { data } = await supabase
        .from('fichiers_style')
        .select('id, nom_fichier, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setStyleFiles((data as StyleFile[]) || [])
    }
    setUploadingStyle(false)
    if (styleRef.current) styleRef.current.value = ''
  }

  const handleDeleteStyle = async (id: string) => {
    const { error } = await supabase.from('fichiers_style').delete().eq('id', id)
    if (!error) {
      setStyleFiles(prev => prev.filter(f => f.id !== id))
      toast.success('Fichier supprimé')
    }
  }

  const handleSignOut = async () => { await signOut(); navigate('/login') }

  const initials = nom
    ? nom.replace('Me.', '').trim().split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U'

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

      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-8 space-y-4">
        {/* Avatar + heading */}
        <div className="flex items-center gap-5 mb-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-[20px] font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #2f6b56, #1e4a38)', boxShadow: '0 4px 16px rgba(40,90,72,0.3)' }}
          >
            {initials}
          </div>
          <div>
            <h1
              className="text-[24px] font-normal leading-tight"
              style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
            >
              Mon profil
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: '#8aada4' }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Informations */}
        <SectionCard title="Informations">
          <div className="space-y-4">
            <div>
              <label className="field-label">Nom</label>
              <input
                className="input-field"
                placeholder="Me. Jean Tremblay"
                value={nom}
                onChange={e => setNom(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Domaine principal</label>
              <select
                className="input-field"
                value={domaine}
                onChange={e => setDomaine(e.target.value)}
                style={{ colorScheme: 'dark' }}
              >
                {['Droit civil', 'Droit commercial', 'Droit des affaires', 'Droit immobilier', 'Droit du travail', 'Autre'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Introduction préférée</label>
              <textarea
                className="input-field min-h-[80px] resize-y"
                placeholder="Style direct, formel, structuré…"
                value={introduction}
                onChange={e => setIntroduction(e.target.value)}
              />
              <p className="text-[11px] mt-1.5" style={{ color: '#8aada4', opacity: 0.6 }}>
                Utilisé comme style de référence si aucun fichier n'est uploadé
              </p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="btn-primary flex items-center gap-2"
            >
              {savingProfile ? (
                <><Loader2 size={14} className="animate-spin" /> Enregistrement…</>
              ) : (
                <><CheckCircle size={14} /> Enregistrer les modifications</>
              )}
            </button>
          </div>
        </SectionCard>

        {/* En-tête du cabinet */}
        <SectionCard title="En-tête du cabinet">
          <div className="space-y-4">
            <p className="text-[12px] -mt-3" style={{ color: '#8aada4' }}>
              Ces informations apparaîtront en haut de chaque document Word exporté
            </p>
            <div>
              <label className="field-label">Nom du cabinet</label>
              <input
                className="input-field"
                placeholder="Cabinet Tremblay & Associés"
                value={nomCabinet}
                onChange={e => setNomCabinet(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Adresse</label>
              <input
                className="input-field"
                placeholder="123 rue Saint-Denis, Montréal, QC H2X 1Z1"
                value={adresse}
                onChange={e => setAdresse(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Téléphone</label>
              <input
                className="input-field"
                placeholder="514 555-0123"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
              />
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="btn-primary flex items-center gap-2"
            >
              {savingProfile ? (
                <><Loader2 size={14} className="animate-spin" /> Enregistrement…</>
              ) : (
                <><CheckCircle size={14} /> Enregistrer</>
              )}
            </button>
          </div>
        </SectionCard>

        {/* Documents de style */}
        <SectionCard title="Documents de style">
          <div className="space-y-4">
            <p className="text-[12px] -mt-3" style={{ color: '#8aada4' }}>
              Uploadez vos mises en demeure existantes (.docx) pour que l'IA reproduise votre style
            </p>

            {/* Upload zone */}
            <div
              className="rounded-[0.75rem] p-5 text-center cursor-pointer transition-all"
              style={{ border: '1.5px dashed #1e3b32' }}
              onClick={() => !uploadingStyle && styleRef.current?.click()}
              onMouseEnter={e => {
                if (!uploadingStyle) {
                  e.currentTarget.style.borderColor = '#285A48'
                  e.currentTarget.style.background = 'rgba(40,90,72,0.04)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e3b32'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {uploadingStyle ? (
                <Loader2 size={20} className="mx-auto mb-2 animate-spin" style={{ color: '#285A48' }} />
              ) : (
                <Upload size={20} className="mx-auto mb-2" style={{ color: '#8aada4' }} />
              )}
              <p className="text-[13px]" style={{ color: '#8aada4' }}>
                {uploadingStyle ? 'Traitement en cours…' : 'Cliquez pour uploader vos MED de référence'}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: '#8aada4', opacity: 0.5 }}>.docx uniquement</p>
              <input
                ref={styleRef}
                type="file"
                accept=".docx"
                multiple
                className="hidden"
                onChange={handleStyleUpload}
                disabled={uploadingStyle}
              />
            </div>

            {styleFiles.length > 0 && (
              <div className="space-y-1.5">
                {styleFiles.map(f => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-[0.75rem] px-4 py-3"
                    style={{ background: '#122420', border: '1px solid #1e3b32' }}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={14} style={{ color: '#285A48' }} />
                      <div>
                        <p className="text-[13px]" style={{ color: '#F0F4F2' }}>{f.nom_fichier}</p>
                        <p className="text-[11px]" style={{ color: '#8aada4' }}>
                          {new Date(f.created_at).toLocaleDateString('fr-CA')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStyle(f.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: '#8aada4' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#f08080'; e.currentTarget.style.background = 'rgba(180,40,40,0.1)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#8aada4'; e.currentTarget.style.background = 'transparent' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </main>

      <Footer />
    </div>
  )
}
