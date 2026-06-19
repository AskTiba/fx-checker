import { describe, it, expect } from 'vitest'
import {
  formatAmount,
  formatRate,
  formatPercent,
  formatChange,
  relativeTime,
} from '../lib/format'

describe('formatAmount', () => {
  it('formats with commas and 2 decimals', () => {
    expect(formatAmount(1000)).toBe('1,000.00')
  })

  it('formats small numbers', () => {
    expect(formatAmount(0.5)).toBe('0.50')
  })

  it('formats large numbers', () => {
    expect(formatAmount(1234567.89)).toBe('1,234,567.89')
  })
})

describe('formatRate', () => {
  it('formats rates above 1', () => {
    expect(formatRate(1.234567)).toBe('1.2346')
  })

  it('formats rates below 0.01', () => {
    expect(formatRate(0.005)).toBe('0.005000')
  })

  it('formats rates between 0.01 and 1', () => {
    expect(formatRate(0.853)).toBe('0.8530')
  })
})

describe('formatPercent', () => {
  it('adds + for positive', () => {
    expect(formatPercent(1.5)).toBe('+1.50%')
  })

  it('adds - for negative', () => {
    expect(formatPercent(-0.75)).toBe('-0.75%')
  })
})

describe('formatChange', () => {
  it('formats positive change', () => {
    expect(formatChange(0.0123)).toBe('+0.0123')
  })
})

describe('relativeTime', () => {
  it('shows "now" for recent', () => {
    expect(relativeTime(Date.now())).toBe('now')
  })

  it('shows minutes', () => {
    expect(relativeTime(Date.now() - 5 * 60000)).toBe('5m')
  })

  it('shows hours', () => {
    expect(relativeTime(Date.now() - 3 * 3600000)).toBe('3h')
  })

  it('shows days', () => {
    expect(relativeTime(Date.now() - 4 * 86400000)).toBe('4d')
  })
})
