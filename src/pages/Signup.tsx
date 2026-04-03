import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LexLogo } from '../components/LexLogo'
import { toast } from 'sonner'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, nom)
    setLoading(false)
    if (error) {
      toast.error(error.message || 'Erreur lors de la création du compte.')
    } else {
      navigate('/onboarding')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: '#091413' }}
    >
      {/* Subtle grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(40,90,72,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(40,90,72,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[400px] rounded-[1rem] p-8"
        style={{
          background: '#0f1f1d',
          border: '1px solid #1e3b32',
          boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
        }}
      >
        <div className="flex justify-center mb-8">
          <LexLogo />
        </div>

        <div className="text-center mb-7">
          <h1
            className="font-serif text-[26px] tracking-[-0.01em] leading-tight mb-1.5"
            style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
          >
            Créer mon compte
          </h1>
          <p className="text-[14px]" style={{ color: '#8aada4' }}>
            Votre première mise en demeure en quelques secondes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Nom complet</label>
            <input
              type="text"
              className="input-field"
              placeholder="Me. Jean Tremblay"
              value={nom}
              onChange={e => setNom(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="field-label">Courriel</label>
            <input
              type="email"
              className="input-field"
              placeholder="nom@cabinet.ca"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="field-label">Mot de passe</label>
            <input
              type="password"
              className="input-field"
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-[14px] mt-2"
          >
            {loading ? 'Création du compte…' : 'Créer mon compte →'}
          </button>
        </form>

        <p className="text-center mt-5" style={{ fontSize: '11px', color: '#8aada4' }}>
          Vos données sont confidentielles et sécurisées
        </p>

        <p className="text-center mt-3 text-[13px]" style={{ color: '#8aada4' }}>
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="font-semibold transition-colors hover:underline underline-offset-2"
            style={{ color: '#6cc4a0' }}
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
