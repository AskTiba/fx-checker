import { useEffect, useState, useRef } from 'react'
import { getCurrencies } from '../api/frankfurter'
import { searchCurrencies, groupCurrencies } from '../lib/filter'
import { useConverterStore } from '../store/useConverterStore'
import { useUIStore } from '../store/useUIStore'

export default function CurrencyPicker() {
  const { base, target, setBase, setTarget } = useConverterStore()
  const side = useUIStore((s) => s.currencyPickerOpen)!
  const close = useUIStore((s) => s.closeCurrencyPicker)
  const searchQuery = useUIStore((s) => s.searchQuery)
  const setSearchQuery = useUIStore((s) => s.setSearchQuery)

  const [currencies, setCurrencies] = useState<{ code: string; name: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const selectedCode = side === 'base' ? base : target

  useEffect(() => {
    getCurrencies()
      .then(setCurrencies)
      .catch(() => {})
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, input, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [close])

  const filtered = searchCurrencies(currencies, searchQuery)
  const grouped = groupCurrencies(filtered)

  function handleSelect(code: string) {
    if (side === 'base') setBase(code)
    else setTarget(code)
    close()
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) close()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-12 md:items-center md:pt-0"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Select currency"
        className="mx-2 max-h-[80vh] w-full max-w-md overflow-hidden rounded-xl border border-surface-500 bg-surface-800 shadow-2xl"
      >
        <div className="border-b border-surface-600 p-3">
          <div className="relative">
            <img
              src="/assets/images/icon-search.svg"
              alt=""
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search currencies..."
              className="w-full rounded-lg bg-surface-700 py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder-text-tertiary outline-none focus:ring-1 focus:ring-accent"
              aria-label="Search currencies"
            />
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 60px)' }}>
          {!searchQuery && (
            <Section title="Popular" currencies={grouped.popular} selected={selectedCode} onSelect={handleSelect} />
          )}
          <Section
            title={searchQuery ? 'Results' : 'Other currencies'}
            currencies={searchQuery ? filtered : grouped.other}
            selected={selectedCode}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  currencies,
  selected,
  onSelect,
}: {
  title: string
  currencies: { code: string; name: string }[]
  selected: string
  onSelect: (code: string) => void
}) {
  if (currencies.length === 0) return null

  return (
    <div className="border-b border-surface-600 last:border-b-0">
      <div className="flex items-center gap-2 px-4 py-2 text-xs text-text-secondary">
        <span>{title}</span>
        <span className="rounded bg-surface-600 px-1.5 py-0.5 text-[10px]">{currencies.length}</span>
      </div>

      {currencies.map((c) => (
        <button
          key={c.code}
          onClick={() => onSelect(c.code)}
          className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-700 ${
            c.code === selected ? 'bg-accent/5' : ''
          }`}
        >
          <img
            src={`/assets/images/flags/${c.code.toLowerCase()}.webp`}
            alt=""
            className="size-6 rounded-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span className={`font-semibold ${c.code === selected ? 'text-accent' : 'text-text-primary'}`}>
            {c.code}
          </span>
          <span className="text-text-secondary">{c.name}</span>
          {c.code === selected && (
            <img src="/assets/images/icon-check.svg" alt="Selected" className="ml-auto size-3" />
          )}
        </button>
      ))}
    </div>
  )
}
