import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../contexts/ProfileContext'
import { useAuth } from '../contexts/AuthContext'
import { LexLogo } from '../components/LexLogo'
import { toast } from 'sonner'
import { FileText, Zap, Shield } from 'lucide-react'

export default function Onboarding() {
  const { updateProfile } = useProfile()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [nom, setNom] = useState(user?.user_metadata?.nom || '')
  const [domaine, setDomaine] = useState('Droit civil')
  const [loading, setLoading] = useState(false)

  const handleFinish = async () => {
    if (!nom.trim()) { toast.error('Veuillez entrer votre nom.'); return }
    setLoading(true)
    await updateProfile({ nom, domaine, onboarded: true })
    setLoading(false)
    navigate('/dashboard')
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <LexLogo className="justify-center mb-10" />

          <h1 className="text-3xl font-semibold text-text mb-4">
            Bienvenue sur LexDraft
          </h1>
          <p className="text-muted text-base mb-12 leading-relaxed">
            Générez des mises en demeure professionnelles en quelques secondes,<br />
            dans votre style, avec vos faits.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-12 text-left">
            {[
              { icon: FileText, title: 'Uploadez vos dossiers', desc: 'Pièces justificatives lues et intégrées automatiquement' },
              { icon: Zap, title: 'Générez en 20 secondes', desc: 'IA juridique québécoise, ton ferme et professionnel' },
              { icon: Shield, title: 'Votre style, vos formulations', desc: 'L\'IA s\'inspire de vos mises en demeure passées' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-text text-sm">{title}</p>
                  <p className="text-muted text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setStep(2)} className="btn-primary px-10">
            Commencer →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <LexLogo className="justify-center mb-10" />

        <div className="card p-8">
          <p className="text-xs text-muted uppercase tracking-widest mb-2">Étape 2 / 2</p>
          <h2 className="text-xl font-semibold text-text mb-6">Configurez votre profil</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Votre nom</label>
              <input
                type="text"
                className="input-field"
                placeholder="Me. Jean Tremblay"
                value={nom}
                onChange={e => setNom(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Domaine principal</label>
              <select
                className="input-field"
                value={domaine}
                onChange={e => setDomaine(e.target.value)}
              >
                {['Droit civil', 'Droit commercial', 'Droit des affaires', 'Droit immobilier', 'Droit du travail', 'Autre'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleFinish}
              disabled={loading}
              className="btn-primary w-full mt-4"
            >
              {loading ? 'Enregistrement…' : 'Accéder à mon espace →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
