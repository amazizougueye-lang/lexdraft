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
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <LexLogo />
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-semibold text-text mb-2">Créer mon compte</h1>
          <p className="text-muted text-sm mb-8">Rejoignez LexDraft et générez vos mises en demeure en quelques secondes</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Nom complet</label>
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
              <label className="block text-sm font-medium text-text mb-2">Courriel</label>
              <input
                type="email"
                className="input-field"
                placeholder="nom@cabinet.ca"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Mot de passe</label>
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
              className="btn-primary w-full"
            >
              {loading ? 'Création du compte…' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-muted">
            Vos données sont confidentielles et sécurisées.
          </p>
        </div>
      </div>
    </div>
  )
}
