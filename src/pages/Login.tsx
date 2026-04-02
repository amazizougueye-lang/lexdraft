import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LexLogo } from '../components/LexLogo'
import { toast } from 'sonner'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      toast.error('Identifiants incorrects. Vérifiez votre courriel et mot de passe.')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <LexLogo />
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-semibold text-text mb-2">Connexion</h1>
          <p className="text-muted text-sm mb-8">Accédez à votre espace LexDraft</p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="••••••••"
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
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
