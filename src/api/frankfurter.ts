import type { Currencies, Rate, TimeSeries } from '../types/currency'
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

export async function getCurrencies(): Promise<Currencies> {
  return fetchJson<Currencies>(`${BASE_URL}/v2/currencies`)
}

export async function getLatest(
  base: string,
  symbols?: string[]
): Promise<Rate> {
  const params = new URLSearchParams({ base })
  if (symbols && symbols.length > 0) {
    params.set('symbols', symbols.join(','))
  }
  return fetchJson<Rate>(`${BASE_URL}/v2/latest?${params}`)
}

export async function getTimeSeries(
  base: string,
  target: string,
  start: string,
  end: string
): Promise<TimeSeries> {
  const params = new URLSearchParams({ base, symbols: target })
  return fetchJson<TimeSeries>(`${BASE_URL}/v2/${start}..${end}?${params}`)
}
