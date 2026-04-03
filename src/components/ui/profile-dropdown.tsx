import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'

interface ProfileDropdownProps {
  name?: string
  email?: string
  onSignOut: () => void
}

export function ProfileDropdown({ name, email, onSignOut }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = name
    ? name.replace('Me.', '').trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : email?.[0]?.toUpperCase() || 'U'

  const displayName = name
    ? name.replace('Me.', '').trim().split(' ')[0]
    : email?.split('@')[0] || 'Utilisateur'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-[0.75rem] transition-all duration-150"
        style={{
          background: open ? '#122420' : 'transparent',
          border: `1px solid ${open ? '#1e3b32' : 'transparent'}`,
        }}
      >
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
          style={{ background: '#285A48' }}
        >
          {initials}
        </div>
        <span className="text-[13px] font-medium hidden sm:block" style={{ color: '#F0F4F2' }}>
          {displayName}
        </span>
        <ChevronDown
          size={13}
          style={{ color: '#8aada4', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-1.5 w-52 rounded-[0.75rem] z-50 overflow-hidden"
            style={{
              background: '#0f1f1d',
              border: '1px solid #1e3b32',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {/* Header */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e3b32' }}>
              <p className="text-[13px] font-semibold" style={{ color: '#F0F4F2' }}>
                {name || 'Mon compte'}
              </p>
              {email && (
                <p className="text-[11px] mt-0.5 truncate" style={{ color: '#8aada4' }}>
                  {email}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="py-1">
              <Link
                to="/profil"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors"
                style={{ color: '#F0F4F2' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#122420')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Settings size={14} style={{ color: '#8aada4' }} />
                Mon profil
              </Link>
              <button
                onClick={() => { setOpen(false); onSignOut() }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors"
                style={{ color: '#f08080' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1a1010')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut size={14} />
                Se déconnecter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
