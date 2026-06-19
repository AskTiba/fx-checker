import { describe, it, expect } from 'vitest'
import { searchCurrencies, groupCurrencies, isPopular } from '../lib/filter'

const currencies: { code: string; name: string }[] = [
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'NGN', name: 'Nigerian Naira' },
  { code: 'CHF', name: 'Swiss Franc' },
]

describe('isPopular', () => {
  it('returns true for popular currencies', () => {
    expect(isPopular('USD')).toBe(true)
    expect(isPopular('EUR')).toBe(true)
    expect(isPopular('JPY')).toBe(true)
  })

  it('returns false for others', () => {
    expect(isPopular('NGN')).toBe(false)
  })
})

describe('searchCurrencies', () => {
  it('returns all when query is empty', () => {
    expect(searchCurrencies(currencies, '')).toHaveLength(5)
  })

  it('filters by code', () => {
    expect(searchCurrencies(currencies, 'usd')).toHaveLength(1)
    expect(searchCurrencies(currencies, 'usd')[0].code).toBe('USD')
  })

  it('filters by name', () => {
    expect(searchCurrencies(currencies, 'yen')).toHaveLength(1)
    expect(searchCurrencies(currencies, 'yen')[0].code).toBe('JPY')
  })

  it('is case-insensitive', () => {
    expect(searchCurrencies(currencies, 'nigerian')).toHaveLength(1)
  })
})

describe('groupCurrencies', () => {
  it('separates popular from other', () => {
    const { popular, other } = groupCurrencies(currencies)
    expect(popular.map((c) => c.code)).toEqual(['USD', 'EUR', 'JPY', 'CHF'])
    expect(other.map((c) => c.code)).toEqual(['NGN'])
  })
})
