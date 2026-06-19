export interface Currency {
  code: string
  name: string
}

export type Currencies = Record<string, string>

export interface Rate {
  base: string
  date: string
  rates: Record<string, number>
}

export interface TimeSeriesPoint {
  date: string
  rate: number
}

export interface TimeSeries {
  base: string
  target: string
  start: string
  end: string
  rates: Record<string, Record<string, number>>
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
