import type { RateEntry } from '../types/currency'
import { getCached, setCache } from '../lib/cache'

const BASE_URL = 'https://api.frankfurter.dev'
const CACHE_PREFIX = 'frankfurter:'

async function fetchJson<T>(url: string): Promise<T> {
  const cached = getCached<T>(CACHE_PREFIX + url)
  if (cached) return cached

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Frankfurter API: ${response.status} ${response.statusText}`)
  }
  const data = (await response.json()) as T
  setCache(CACHE_PREFIX + url, data)
  return data
}

export async function getCurrencies(): Promise<
  { code: string; name: string }[]
> {
  const data = await fetchJson<
    { iso_code: string; name: string }[]
  >(`${BASE_URL}/v2/currencies`)
  return data.map((c) => ({ code: c.iso_code, name: c.name }))
}

export async function getRate(
  base: string,
  target: string
): Promise<number> {
  const data = await fetchJson<{ rate: number }>(
    `${BASE_URL}/v2/rate/${base}/${target}`
  )
  return data.rate
}

export async function getLatest(
  base: string,
  quotes?: string[]
): Promise<Record<string, number>> {
  const params = new URLSearchParams({ base })
  if (quotes && quotes.length > 0) {
    params.set('quotes', quotes.join(','))
  }
  const data = await fetchJson<RateEntry[]>(
    `${BASE_URL}/v2/rates?${params}`
  )
  const result: Record<string, number> = {}
  for (const entry of data) {
    result[entry.quote] = entry.rate
  }
  return result
}

export async function getTimeSeries(
  base: string,
  target: string,
  from: string,
  to: string
): Promise<RateEntry[]> {
  const params = new URLSearchParams({ base, quotes: target, from, to })
  return fetchJson<RateEntry[]>(
    `${BASE_URL}/v2/rates?${params}`
  )
}
