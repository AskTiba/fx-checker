export function formatAmount(amount: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

export function formatRate(rate: number): string {
  if (rate < 0.01) return rate.toFixed(6)
  if (rate < 1) return rate.toFixed(4)
  return rate.toFixed(4)
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${formatRate(value)}`
}

export function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatDate(dateStr: string, range: string): string {
  const date = new Date(dateStr)
  if (range === '1D') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  if (range === '1W' || range === '1M') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}
