interface LexLogoProps {
  className?: string
  dark?: boolean
}

export function LexLogo({ className = '', dark = false }: LexLogoProps) {
  const textColor = dark ? '#091413' : '#F0F4F2'
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4.5h6M4 8.5h8M4 12.5h5" stroke="#285A48" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="15" cy="14" r="3.5" stroke="#285A48" strokeWidth="1.8"/>
        <path d="M17.5 16.5l2 2" stroke="#285A48" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
      <span
        style={{
          fontSize: '17px',
          color: textColor,
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        LexDraft
      </span>
    </div>
  )
}
