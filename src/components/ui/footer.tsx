import { Link } from 'react-router-dom'
import { LexLogo } from '../LexLogo'

export function Footer() {
  return (
    <footer
      className="w-full px-6 py-8"
      style={{ background: '#091413', borderTop: '1px solid #1e3b32' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left */}
        <p className="text-[12px]" style={{ color: '#8aada4' }}>
          © {new Date().getFullYear()} LexDraft — Flowmatic
        </p>

        {/* Center — links */}
        <div className="flex items-center gap-5">
          <Link
            to="/politique-de-confidentialite"
            className="text-[12px] transition-colors hover:text-[#285A48]"
            style={{ color: '#8aada4' }}
          >
            Politique de confidentialité
          </Link>
          <span style={{ color: '#1e3b32' }}>·</span>
          <Link
            to="/conditions-utilisation"
            className="text-[12px] transition-colors hover:text-[#285A48]"
            style={{ color: '#8aada4' }}
          >
            Conditions d'utilisation
          </Link>
        </div>

        {/* Right */}
        <a
          href="mailto:flowmatic.ca@gmail.com"
          className="text-[12px] transition-colors hover:text-[#285A48]"
          style={{ color: '#8aada4' }}
        >
          flowmatic.ca@gmail.com
        </a>
      </div>
    </footer>
  )
}
