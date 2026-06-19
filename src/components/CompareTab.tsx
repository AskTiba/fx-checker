import { useEffect, useState } from 'react'
import { useConverterStore } from '../store/useConverterStore'
import { useFavoritesStore } from '../store/useFavoritesStore'
import { getLatest } from '../api/frankfurter'
import { formatAmount, formatRate } from '../lib/format'

const POPULAR_CURRENCIES = ['EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'DKK']

export default function CompareTab() {
  const { base, amount } = useConverterStore()
  const addPair = useFavoritesStore((s) => s.addPair)
  const removePair = useFavoritesStore((s) => s.removePair)
  const isPinned = useFavoritesStore((s) => s.isPinned)
  const pinnedPairs = useFavoritesStore((s) => s.pairs)

  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getLatest(base, POPULAR_CURRENCIES)
      .then((data) => setRates(data.rates))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [base])

  const currencies = POPULAR_CURRENCIES.filter((c) => c !== base)

  if (!amount || amount <= 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-sm font-medium text-text-primary">No comparison available</p>
        <p className="mt-1 text-xs text-text-secondary">
          Enter an amount in Send above to see what your money is worth in other currencies.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-text-secondary">
        Loading rates...
      </div>
    )
  }

  return (
    <div className="p-5 lg:p-6">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-text-primary">Multi-currency</h3>
        <span className="text-xs text-text-secondary">
          {formatAmount(amount)} from {base}
        </span>
        <span className="ml-auto rounded bg-surface-600 px-2 py-0.5 text-[11px] text-text-secondary">
          {currencies.length} pairs
        </span>
      </div>

      <div className="space-y-1">
        {currencies.map((code) => {
          const rate = rates[code]
          if (!rate) return null
          const converted = amount * rate
          const pinned = isPinned(base, code)
          const pinnedId = pinnedPairs.find(
            (p) => p.base === base && p.target === code
          )?.id

          function handlePin() {
            if (pinned && pinnedId) removePair(pinnedId)
            else addPair(base, code)
          }

          return (
            <div
              key={code}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-700"
            >
              <img
                src={`/assets/images/flags/${code.toLowerCase()}.webp`}
                alt=""
                className="size-6 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">{code}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-text-primary">{formatAmount(converted)}</p>
                <p className="text-[11px] text-text-tertiary">@ {formatRate(rate)}</p>
              </div>
              <button
                onClick={handlePin}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-surface-600"
                aria-label={pinned ? `Unpin ${code}` : `Pin ${code}`}
                aria-pressed={pinned}
              >
                <img
                  src={pinned ? '/assets/images/icon-star-filled.svg' : '/assets/images/icon-star.svg'}
                  alt=""
                  className="size-4"
                />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
