import { useEffect } from 'react'
import { useConverterStore } from '../store/useConverterStore'
import { useFavoritesStore } from '../store/useFavoritesStore'
import { useLogStore } from '../store/useLogStore'
import { useUIStore } from '../store/useUIStore'
import { formatAmount, formatRate } from '../lib/format'
import Flag from './Flag'
import { getRate } from '../api/frankfurter'

export default function Converter() {
  const { base, target, amount, rate, setAmount, swap, setRate } = useConverterStore()
  const isPinned = useFavoritesStore((s) => s.isPinned(base, target))
  const addPair = useFavoritesStore((s) => s.addPair)
  const removePair = useFavoritesStore((s) => s.removePair)
  const addLogEntry = useLogStore((s) => s.addEntry)
  const openCurrencyPicker = useUIStore((s) => s.openCurrencyPicker)

  useEffect(() => {
    setRate(null)
    getRate(base, target).then(setRate).catch(() => setRate(null))
  }, [base, target, setRate])

  const pinnedId = useFavoritesStore((s) => {
    const p = s.pairs.find((p) => p.base === base && p.target === target)
    return p?.id ?? null
  })

  const receiveAmount = rate !== null ? amount * rate : null

  function handleLog() {
    if (rate === null) return
    addLogEntry({ base, target, sendAmount: amount, receiveAmount: amount * rate, rate })
  }

  function handleToggleFavorite() {
    if (isPinned && pinnedId) {
      removePair(pinnedId)
    } else {
      addPair(base, target)
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-primary md:text-sm">
        Check the rate
      </h2>
      <section className="rounded-2xl border border-surface-600 bg-surface-800 p-5 lg:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Send */}
          <div className="flex-1 rounded-2xl bg-surface-700/40 p-4 md:p-6">
            <label className="mb-3 block text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Send</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-transparent font-mono text-3xl font-bold text-text-primary outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                aria-label="Amount to send"
              />
              <button
                onClick={() => openCurrencyPicker('base')}
                className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-surface-600 px-3 py-2 text-sm transition-colors hover:bg-surface-500"
                aria-haspopup="dialog"
              >
                <Flag code={base} className="size-5" />
                <span className="font-semibold">{base}</span>
                <Chevron />
              </button>
            </div>
          </div>

          {/* Swap */}
          <div className="flex justify-center -my-2 md:my-0 md:-mx-2 z-10 shrink-0">
            <button
              onClick={swap}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border-4 border-surface-800 bg-surface-600 transition-transform hover:scale-110 hover:bg-surface-500"
              aria-label="Swap currencies"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 9 2 5l4-4M2 5h16m-4 6 4 4-4 4m4-4H2" />
              </svg>
            </button>
          </div>

          {/* Receive */}
          <div className="flex-1 rounded-2xl bg-surface-700/40 p-4 md:p-6">
            <label className="mb-3 block text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Receive</label>
            <div className="flex items-center gap-3">
              <span className="w-full font-mono text-3xl font-bold text-accent" aria-live="polite">
                {receiveAmount !== null ? formatAmount(receiveAmount) : '—'}
              </span>
              <button
                onClick={() => openCurrencyPicker('target')}
                className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-surface-600 px-3 py-2 text-sm transition-colors hover:bg-surface-500"
                aria-haspopup="dialog"
              >
                <Flag code={target} className="size-5" />
                <span className="font-semibold">{target}</span>
                <Chevron />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-dashed border-surface-600 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-sm text-text-secondary" aria-live="polite">
            1 {base} = {rate !== null ? formatRate(rate) : '—'} {target}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleToggleFavorite}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                isPinned
                  ? 'bg-[#cef739] text-[#111111]'
                  : 'border border-surface-500 text-text-primary hover:border-surface-400'
              }`}
              aria-pressed={isPinned}
            >
              <img
                src={isPinned ? '/assets/images/icon-star-filled.svg' : '/assets/images/icon-star.svg'}
                alt=""
                className="size-4"
                style={isPinned ? { filter: 'brightness(0)' } : { filter: 'brightness(0) invert(1)' }}
              />
              {isPinned ? 'FAVORITED' : 'FAVORITE'}
            </button>

            <button
              onClick={handleLog}
              disabled={rate === null}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-surface-500 px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-surface-400 disabled:opacity-40"
            >
              LOG CONVERSION
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

// The local Flag function is removed.

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path fill="#fff" d="M2.988 4.02h6.024c.422 0 .633.515.328.82l-3 3a.48.48 0 0 1-.68 0l-3-3c-.304-.305-.093-.82.328-.82"/>
    </svg>
  )
}
