import { useEffect, useState } from 'react'
import { getCurrencies } from '../api/frankfurter'

export default function Header() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    getCurrencies()
      .then((currencies) => setCount(currencies.length))
      .catch(() => setCount(null))
  }, [])

  return (
    <header className="flex items-center gap-3 border-b border-surface-600 px-4 py-3 lg:px-10 lg:py-4">
      <img src="/assets/images/logo.svg" alt="FX Checker" className="h-6" />

      <span className="ml-auto text-sm text-text-secondary">
        {count !== null ? `${count} Currencies` : 'Currencies'} · EOD · ECB data
      </span>
    </header>
  )
}
