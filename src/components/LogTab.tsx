import { useState } from 'react'
import { useLogStore } from '../store/useLogStore'
import { formatAmount, relativeTime } from '../lib/format'

export default function LogTab() {
  const { entries, removeEntry, clearAll } = useLogStore()
  const [showConfirm, setShowConfirm] = useState(false)

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-sm font-medium text-text-primary">No conversions logged yet</p>
        <p className="mt-1 text-xs text-text-secondary">
          Every conversion is recorded here automatically when you tap Log conversion. Your log
          is private to this session and this browser.
        </p>
      </div>
    )
  }

  function handleClearAll() {
    clearAll()
    setShowConfirm(false)
  }

  return (
    <div className="p-5 lg:p-6">
      <div className="mb-4 flex items-center">
        <h3 className="text-sm font-semibold text-text-primary">Conversion log</h3>
        <span className="ml-2 rounded bg-surface-600 px-2 py-0.5 text-[11px] text-text-secondary">
          {entries.length} logged
        </span>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="ml-auto cursor-pointer text-xs text-text-tertiary underline underline-offset-2 hover:text-text-secondary"
          >
            Clear all
          </button>
        ) : (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-text-secondary">Clear all entries?</span>
            <button
              onClick={handleClearAll}
              className="cursor-pointer rounded bg-negative px-2 py-0.5 text-[11px] text-white"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="cursor-pointer rounded bg-surface-600 px-2 py-0.5 text-[11px] text-text-secondary"
            >
              No
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1" role="log" aria-live="polite">
        {entries.map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-700"
          >
            <div className="flex items-center gap-2">
              <img
                src={`/assets/images/flags/${e.base.toLowerCase()}.webp`}
                alt=""
                className="size-5 rounded-full object-cover"
              />
              <span className="text-sm text-text-secondary">→</span>
              <img
                src={`/assets/images/flags/${e.target.toLowerCase()}.webp`}
                alt=""
                className="size-5 rounded-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text-primary">
                {e.base} → {e.target}
              </p>
            </div>

            <div className="text-right">
              <p className="font-mono text-sm text-text-primary">
                {formatAmount(e.sendAmount)}
              </p>
              <p className="font-mono text-xs text-text-secondary">
                {formatAmount(e.receiveAmount)}
              </p>
            </div>

            <span className="shrink-0 text-[11px] text-text-tertiary">
              {relativeTime(e.timestamp)}
            </span>

            <button
              onClick={() => removeEntry(e.id)}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-surface-600"
              aria-label={`Delete conversion ${e.base} to ${e.target}`}
            >
              <img src="/assets/images/icon-delete.svg" alt="" className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
