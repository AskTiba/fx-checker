export default function Ticker() {
  const pairs = [
    { code: 'USD/EUR', rate: '0.8530', change: '+0.12', up: true },
    { code: 'USD/JPY', rate: '110.45', change: '-0.34', up: false },
    { code: 'USD/GBP', rate: '0.7234', change: '+0.05', up: true },
    { code: 'USD/CHF', rate: '0.9123', change: '+0.21', up: true },
    { code: 'USD/CAD', rate: '1.2567', change: '-0.08', up: false },
    { code: 'USD/AUD', rate: '1.3890', change: '+0.15', up: true },
    { code: 'USD/NZD', rate: '1.5120', change: '-0.11', up: false },
  ]

  return (
    <div
      className="flex overflow-hidden border-b border-surface-600 bg-surface-800"
      role="marquee"
      aria-label="Live exchange rates"
    >
      <div className="z-10 flex shrink-0 items-center gap-2 bg-accent px-4 py-2 font-mono text-xs font-bold tracking-wider text-surface-900 md:px-6">
        <span className="size-1.5 rounded-full bg-surface-900"></span>
        LIVE MARKETS
      </div>
      <div className="flex animate-marquee items-center gap-8 whitespace-nowrap px-8 hover:[animation-play-state:paused]">
        {[...pairs, ...pairs, ...pairs].map((pair, i) => (
          <span key={i} className="flex items-center gap-2 font-mono text-sm">
            <span className="text-text-secondary">{pair.code}</span>
            <span className="text-text-primary">{pair.rate}</span>
            <span className={pair.up ? 'text-positive' : 'text-negative'}>
              {pair.up ? '▲' : '▼'} {pair.change}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

