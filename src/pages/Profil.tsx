import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { LexLogo } from '../components/LexLogo'
import { toast } from 'sonner'
import { ArrowLeft, Upload, X, LogOut, Trash2 } from 'lucide-react'

interface StyleFile {
  id: string
  nom_fichier: string
  created_at: string
}

export default function Profil() {
  const { user, signOut } = useAuth()
  const { profile, updateProfile } = useProfile()
  const navigate = useNavigate()

  const [nom, setNom] = useState(profile.nom)
  const [domaine, setDomaine] = useState(profile.domaine)
  const [introduction, setIntroduction] = useState(profile.introduction)
  const [styleFiles, setStyleFiles] = useState<StyleFile[]>([])
  const [uploadingStyle, setUploadingStyle] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const styleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNom(profile.nom)
    setDomaine(profile.domaine)
    setIntroduction(profile.introduction)
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
    await updateProfile({ nom, domaine, introduction })
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
        // Extract text
        let contenuExtrait = ''
        if (file.name.endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer()
          const mammoth = (await import('mammoth')).default
          const result = await mammoth.extractRawText({ arrayBuffer })
          contenuExtrait = result.value
        } else if (file.name.endsWith('.txt')) {
          contenuExtrait = await file.text()
        }

        // Upload to Storage
        const filePath = `${user.id}/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('style-documents')
          .upload(filePath, file, { upsert: true })

        if (uploadError) {
          console.error('Storage upload error:', uploadError)
          toast.error(`Upload échoué pour ${file.name}: ${uploadError.message}`)
          continue
        }

        // Insert into DB
        const { error: insertError } = await supabase
          .from('fichiers_style')
          .insert({
            user_id: user.id,
            nom_fichier: file.name,
            storage_path: filePath,
            taille: file.size,
            contenu_extrait: contenuExtrait,
          })

        if (insertError) {
          console.error('DB insert error:', insertError)
          toast.error(`Erreur DB pour ${file.name}: ${insertError.message}`)
          continue
        }

        uploaded++
      } catch (err) {
        console.error('Style upload error:', err)
        toast.error(`Erreur: ${String(err)}`)
      }
    }

    if (uploaded > 0) {
      toast.success(`${uploaded} fichier(s) de style enregistré(s)`)
      // Refresh list
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

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-border px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-surface transition-colors">
          <ArrowLeft size={18} className="text-muted" />
        </Link>
        <LexLogo />
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-text">Mon profil</h1>
          <p className="text-muted text-sm mt-1">{user?.email}</p>
        </div>

        {/* Profil info */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted">Informations</h2>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Nom</label>
            <input className="input-field" placeholder="Me. Jean Tremblay" value={nom} onChange={e => setNom(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Domaine</label>
            <select className="input-field" value={domaine} onChange={e => setDomaine(e.target.value)}>
              {['Droit civil', 'Droit commercial', 'Droit des affaires', 'Droit immobilier', 'Droit du travail', 'Autre'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Introduction préférée</label>
            <textarea
              className="input-field min-h-[80px] resize-y"
              placeholder="Style direct, formel, structuré…"
              value={introduction}
              onChange={e => setIntroduction(e.target.value)}
            />
            <p className="text-xs text-muted mt-1">Utilisé comme style de référence si aucun fichier n'est uploadé</p>
          </div>

          <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-primary">
            {savingProfile ? 'Enregistrement…' : 'Enregistrer les modifications'}
          </button>
        </div>

        {/* Style documents */}
        <div className="card p-6 space-y-4">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted">Documents de style</h2>
            <p className="text-xs text-muted mt-1">
              Uploadez vos mises en demeure existantes (.docx) pour que l'IA reproduise votre style
            </p>
          </div>

          <div
            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => styleRef.current?.click()}
          >
            <Upload size={24} className="mx-auto text-muted mb-2" />
            <p className="text-sm text-muted">
              {uploadingStyle ? 'Traitement en cours…' : 'Cliquez pour uploader vos MED de référence'}
            </p>
            <p className="text-xs text-muted mt-1">.docx uniquement</p>
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
            <div className="space-y-2">
              {styleFiles.map(f => (
                <div key={f.id} className="flex items-center justify-between bg-surface rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm text-text">{f.nom_fichier}</p>
                    <p className="text-xs text-muted">{new Date(f.created_at).toLocaleDateString('fr-CA')}</p>
                  </div>
                  <button onClick={() => handleDeleteStyle(f.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={15} className="text-muted hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </main>
    </div>
  )
}
