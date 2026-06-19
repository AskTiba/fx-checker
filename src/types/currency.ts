export interface CurrencyData {
  iso_code: string
  name: string
  symbol: string
  start_date: string
  end_date: string
}

export interface RateEntry {
  date: string
  base: string
  quote: string
  rate: number
}

export interface FavoritePair {
  id: string
  base: string
  target: string
  pinnedAt: number
}

export interface ConversionEntry {
  id: string
  base: string
  target: string
  sendAmount: number
  receiveAmount: number
  rate: number
  timestamp: number
}

export type TabId = 'history' | 'compare' | 'favorites' | 'log'

export type ChartRange = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'

export interface ChartStats {
  open: number
  last: number
  change: number
  percentChange: number
}
