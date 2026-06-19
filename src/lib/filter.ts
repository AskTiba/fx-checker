const POPULAR_CURRENCIES = new Set(['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'])

export function isPopular(code: string): boolean {
  return POPULAR_CURRENCIES.has(code)
}

export function searchCurrencies(
  currencies: { code: string; name: string }[],
  query: string
): { code: string; name: string }[] {
  const q = query.toLowerCase().trim()
  if (!q) return currencies
  return currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
  )
}

export function groupCurrencies(currencies: { code: string; name: string }[]): {
  popular: { code: string; name: string }[]
  other: { code: string; name: string }[]
} {
  const popular: { code: string; name: string }[] = []
  const other: { code: string; name: string }[] = []
  for (const c of currencies) {
    if (isPopular(c.code)) {
      popular.push(c)
    } else {
      other.push(c)
    }
  }
  return { popular, other }
}
