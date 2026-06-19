import type { Currency } from '../types/currency'

const POPULAR_CURRENCIES = new Set(['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'])

export function isPopular(code: string): boolean {
  return POPULAR_CURRENCIES.has(code)
}

export function searchCurrencies(
  currencies: Currency[],
  query: string
): Currency[] {
  const q = query.toLowerCase().trim()
  if (!q) return currencies
  return currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
  )
}

export function groupCurrencies(currencies: Currency[]): {
  popular: Currency[]
  other: Currency[]
} {
  const popular: Currency[] = []
  const other: Currency[] = []
  for (const c of currencies) {
    if (isPopular(c.code)) {
      popular.push(c)
    } else {
      other.push(c)
    }
  }
  return { popular, other }
}
