import { useState } from 'react'

export default function Flag({ code, className }: { code: string; className?: string }) {
  const [errorLevel, setErrorLevel] = useState(0)
  const countryCode = code.slice(0, 2).toLowerCase()

  if (errorLevel === 2) {
    // Final fallback: just show the initials 
    return (
      <div 
        className={`flex shrink-0 items-center justify-center rounded-full bg-surface-700/50 shadow-inner text-text-secondary font-bold ${className}`}
        style={{ fontSize: '10px' }}
      >
        {countryCode.toUpperCase()}
      </div>
    )
  }

  const src = errorLevel === 0 
    ? `/assets/images/flags/${countryCode}.webp` 
    : `https://flagcdn.com/w40/${countryCode}.png`

  return (
    <img
      src={src}
      alt=""
      className={`shrink-0 rounded-full object-cover ${className}`}
      onError={() => setErrorLevel(prev => prev + 1)}
      loading="lazy"
    />
  )
}
