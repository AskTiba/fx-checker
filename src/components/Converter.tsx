import { useConverterStore } from '../store/useConverterStore'
import { useFavoritesStore } from '../store/useFavoritesStore'
import { useLogStore } from '../store/useLogStore'
import { useUIStore } from '../store/useUIStore'
import { formatAmount, formatRate } from '../lib/format'

export default function Converter() {
  const { base, target, amount, rate, setAmount, swap } = useConverterStore()
  const isPinned = useFavoritesStore((s) => s.isPinned(base, target))
  const addPair = useFavoritesStore((s) => s.addPair)
  const removePair = useFavoritesStore((s) => s.removePair)
  const addLogEntry = useLogStore((s) => s.addEntry)
  const openCurrencyPicker = useUIStore((s) => s.openCurrencyPicker)

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
    <section className="rounded-xl border border-surface-600 bg-surface-800 p-5 lg:p-6">
      <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Check the rate
      </h2>

      <div className="mb-4">
        <label className="mb-1 block text-xs text-text-tertiary">Send</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-transparent font-mono text-2xl text-text-primary outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label="Amount to send"
          />
          <button
            onClick={() => openCurrencyPicker('base')}
            className="flex items-center gap-1.5 rounded-lg border border-surface-500 bg-surface-700 px-3 py-1.5 text-sm hover:bg-surface-600"
            aria-haspopup="dialog"
          >
            <Flag code={base} />
            <span className="font-semibold">{base}</span>
            <Chevron />
          </button>
        </div>
      </div>

      <div className="flex justify-center py-2">
        <button
          onClick={swap}
          className="flex size-8 items-center justify-center rounded-full bg-surface-600 hover:bg-surface-500"
          aria-label="Swap currencies"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 9 2 5l4-4M2 5h16m-4 6 4 4-4 4m4-4H2" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs text-text-tertiary">Receive</label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xl text-text-primary" aria-live="polite">
            {receiveAmount !== null ? formatAmount(receiveAmount) : '—'}
          </span>
          <button
            onClick={() => openCurrencyPicker('target')}
            className="flex items-center gap-1.5 rounded-lg border border-surface-500 bg-surface-700 px-3 py-1.5 text-sm hover:bg-surface-600"
            aria-haspopup="dialog"
          >
            <Flag code={target} />
            <span className="font-semibold">{target}</span>
            <Chevron />
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-text-secondary" aria-live="polite">
        1 {base} = {rate !== null ? formatRate(rate) : '—'} {target}
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleToggleFavorite}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-colors ${
            isPinned
              ? 'bg-accent/15 text-accent'
              : 'border border-surface-500 text-text-secondary hover:border-surface-400'
          }`}
          aria-pressed={isPinned}
        >
          <img
            src={isPinned ? '/assets/images/icon-star-filled.svg' : '/assets/images/icon-star.svg'}
            alt=""
            className="size-4"
          />
          {isPinned ? 'Favorited' : 'Favorite'}
        </button>

        <button
          onClick={handleLog}
          disabled={rate === null}
          className="flex items-center gap-1.5 rounded-lg border border-surface-500 px-4 py-2 text-sm text-text-secondary hover:border-surface-400 disabled:opacity-40"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path fill="#fff" d="M12.875 3.875c.188 0 .375.188.375.375v.375c0 .21-.187.375-.375.375H12.5l-.516 7.945c-.023.586-.539 1.055-1.125 1.055H5.117c-.586 0-1.101-.469-1.125-1.055L3.5 5h-.375a.37.37 0 0 1-.375-.375V4.25c0-.187.164-.375.375-.375h1.922l.797-1.312c.187-.305.61-.563.96-.563h2.368c.351 0 .773.258.96.563l.798 1.312zm-6.07-.75-.446.75h3.258l-.445-.75zm4.054 9.75L11.352 5H4.625l.492 7.875z"/>
          </svg>
          Log conversion
        </button>
      </div>
    </section>
  )
}

function Flag({ code }: { code: string }) {
  return (
    <img
      src={`/assets/images/flags/${code.toLowerCase()}.webp`}
      alt=""
      className="size-5 rounded-full object-cover"
      loading="lazy"
    />
  )
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path fill="#fff" d="M2.988 4.02h6.024c.422 0 .633.515.328.82l-3 3a.48.48 0 0 1-.68 0l-3-3c-.304-.305-.093-.82.328-.82"/>
    </svg>
  )
}
