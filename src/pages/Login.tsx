import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LexLogo } from '../components/LexLogo'
import { toast } from 'sonner'

// Dot-matrix canvas animation
function DotMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const dots: { x: number; y: number; alpha: number; speed: number }[] = []
    const SPACING = 28

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      dots.length = 0
      for (let x = 0; x < canvas.width; x += SPACING) {
        for (let y = 0; y < canvas.height; y += SPACING) {
          dots.push({ x, y, alpha: Math.random(), speed: 0.005 + Math.random() * 0.01 })
        }
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      for (const dot of dots) {
        const dist = Math.hypot(dot.x - cx, dot.y - cy)
        const maxDist = Math.hypot(cx, cy)
        const radialFade = 1 - dist / maxDist
        dot.alpha += dot.speed
        if (dot.alpha > 1 || dot.alpha < 0) dot.speed *= -1
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(40, 90, 72, ${dot.alpha * radialFade * 0.6})`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.9 }}
    />
  )
}

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
    <div
      className="min-h-screen relative flex flex-col items-center justify-center px-4"
      style={{ background: '#091413' }}
    >
      {/* Animated dot matrix background */}
      <DotMatrix />

      {/* Radial gradient overlay (fades dots to dark in center) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(9,20,19,0.85) 0%, rgba(9,20,19,0.1) 100%)',
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[400px] rounded-[1rem] p-8"
        style={{
          background: 'rgba(15,31,29,0.95)',
          border: '1px solid #1e3b32',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <LexLogo />
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1
            className="font-serif text-[26px] tracking-[-0.01em] leading-tight mb-1.5"
            style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
          >
            Connexion
          </h1>
          <p className="text-[14px]" style={{ color: '#8aada4' }}>
            Accédez à votre espace LexDraft
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-[14px] mt-2"
          >
            {loading ? 'Connexion…' : 'Se connecter →'}
          </button>
        </form>

        {/* Beta notice */}
        <p className="text-center mt-5" style={{ fontSize: '11px', color: '#8aada4' }}>
          Beta — accès sur invitation seulement
        </p>

        {/* Sign-up link */}
        <p className="text-center mt-3 text-[13px]" style={{ color: '#8aada4' }}>
          Pas encore de compte ?{' '}
          <Link
            to="/signup"
            className="font-semibold transition-colors hover:underline underline-offset-2"
            style={{ color: '#6cc4a0' }}
          >
            Créer un compte
          </Link>
        </p>

        {/* Legal links */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <Link
            to="/politique-de-confidentialite"
            className="text-[11px] transition-colors hover:text-[#6cc4a0]"
            style={{ color: '#8aada4', opacity: 0.6 }}
          >
            Politique de confidentialité
          </Link>
          <span style={{ color: '#1e3b32' }}>·</span>
          <Link
            to="/conditions-utilisation"
            className="text-[11px] transition-colors hover:text-[#6cc4a0]"
            style={{ color: '#8aada4', opacity: 0.6 }}
          >
            Conditions d'utilisation
          </Link>
        </div>
      </div>
    </div>
  )
}
