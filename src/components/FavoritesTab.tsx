import { useEffect, useState } from 'react'
import { useFavoritesStore } from '../store/useFavoritesStore'
import { useConverterStore } from '../store/useConverterStore'
import { getLatest } from '../api/frankfurter'
import { formatRate } from '../lib/format'
import Flag from './Flag'

export default function FavoritesTab() {
  const { pairs, removePair } = useFavoritesStore()
  const { setBase, setTarget } = useConverterStore()
  const [liveRates, setLiveRates] = useState<Record<string, { rate: number; change: number }>>({})

  useEffect(() => {
    if (pairs.length === 0) return
    pairs.forEach((p) => {
      getLatest(p.base, [p.target])
        .then((data) => {
          const rate = data[p.target]
          setLiveRates((prev) => ({
            ...prev,
            [p.id]: { rate, change: 0 },
          }))
        })
        .catch(() => {})
    })
  }, [pairs])

  if (pairs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-sm font-medium text-text-primary">No pinned pairs yet</p>
        <p className="mt-1 text-xs text-text-secondary">
          Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row.
        </p>
      </div>
    )
  }

  function handleLoadPair(base: string, target: string) {
    setBase(base)
    setTarget(target)
  }

  return (
    <div className="p-5 lg:p-6">
      <div className="mb-4 flex items-center">
        <h3 className="text-sm font-semibold text-text-primary">Pinned pairs</h3>
        <span className="ml-auto rounded bg-surface-600 px-2 py-0.5 text-[11px] text-text-secondary">
          {pairs.length} {pairs.length === 1 ? 'favorite' : 'favorites'}
        </span>
      </div>

      <div className="space-y-1">
        {pairs.map((p) => {
          const live = liveRates[p.id]
          return (
            <div
              key={p.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-700"
              onClick={() => handleLoadPair(p.base, p.target)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleLoadPair(p.base, p.target)
              }}
            >
              <div className="flex items-center gap-2">
                <Flag
                  code={p.base}
                  className="relative z-10 size-6 shadow-sm"
                />
                <Flag
                  code={p.target}
                  className="size-5"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  {p.base} → {p.target}
                </p>
              </div>

              <div className="text-right">
                {live ? (
                  <>
                    <p className="font-mono text-sm text-text-primary">{formatRate(live.rate)}</p>
                    <p className="text-[11px] text-text-tertiary">0.00%</p>
                  </>
                ) : (
                  <p className="text-xs text-text-tertiary">Loading...</p>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removePair(p.id)
                }}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-surface-600"
                aria-label={`Unpin ${p.base} to ${p.target}`}
              >
                <img
                  src="/assets/images/icon-star-filled.svg"
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
