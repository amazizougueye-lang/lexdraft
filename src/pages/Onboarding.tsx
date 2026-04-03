import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../contexts/ProfileContext'
import { useAuth } from '../contexts/AuthContext'
import { LexLogo } from '../components/LexLogo'
import { toast } from 'sonner'
import { FileText, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

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

  const features = [
    {
      icon: FileText,
      title: 'Uploadez vos dossiers',
      desc: 'Pièces justificatives lues et intégrées automatiquement',
    },
    {
      icon: Zap,
      title: 'Générez en 20 secondes',
      desc: 'IA juridique québécoise, ton ferme et professionnel',
    },
    {
      icon: Shield,
      title: 'Votre style, vos formulations',
      desc: "L'IA s'inspire de vos mises en demeure passées",
    },
  ]

  if (step === 1) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
        style={{ background: '#091413' }}
      >
        {/* Grid texture */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(40,90,72,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(40,90,72,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-[480px]"
        >
          <div className="flex justify-center mb-12">
            <LexLogo />
          </div>

          <div className="text-center mb-10">
            <h1
              className="text-[32px] font-normal leading-tight tracking-[-0.02em] mb-3"
              style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
            >
              Bienvenue sur LexDraft
            </h1>
            <p className="text-[15px] leading-relaxed max-w-sm mx-auto" style={{ color: '#8aada4' }}>
              Générez des mises en demeure professionnelles en quelques secondes, dans votre style.
            </p>
          </div>

          <div className="space-y-2.5 mb-10">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-4 rounded-[0.75rem] px-5 py-4"
                style={{ background: '#0f1f1d', border: '1px solid #1e3b32' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(40,90,72,0.2)' }}
                >
                  <Icon size={18} style={{ color: '#285A48' }} />
                </div>
                <div>
                  <p className="font-semibold text-[13.5px]" style={{ color: '#F0F4F2' }}>{title}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: '#8aada4' }}>{desc}</p>
                </div>
                <div className="ml-auto">
                  <div className="step-number text-[10px]">{i + 1}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className="btn-primary w-full py-3.5 text-[14px] flex items-center justify-center gap-2"
          >
            Commencer <ArrowRight size={15} />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: '#091413' }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(40,90,72,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(40,90,72,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <div className="flex justify-center mb-10">
          <LexLogo />
        </div>

        <div
          className="rounded-[1rem] p-7"
          style={{ background: '#0f1f1d', border: '1px solid #1e3b32', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          {/* Progress */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-1 h-1 rounded-full" style={{ background: '#1e3b32' }}>
              <div className="h-full rounded-full" style={{ background: '#285A48', width: '50%' }} />
            </div>
            <span className="text-[11px] font-semibold" style={{ color: '#8aada4' }}>2 / 2</span>
          </div>

          <div className="mb-6">
            <h2
              className="text-[22px] font-normal leading-tight"
              style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
            >
              Configurez votre profil
            </h2>
            <p className="text-[13px] mt-1" style={{ color: '#8aada4' }}>
              Ces informations personnalisent vos documents
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="field-label">Votre nom</label>
              <input
                type="text"
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
            <button
              onClick={handleFinish}
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Enregistrement…</>
              ) : (
                <>Accéder à mon espace <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
