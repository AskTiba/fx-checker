import { describe, it, expect, beforeEach } from 'vitest'
import { getItem, setItem, removeItem } from '../lib/storage'

beforeEach(() => {
  localStorage.clear()
})

describe('getItem', () => {
  it('returns null for missing keys', () => {
    expect(getItem('nonexistent')).toBeNull()
  })

  it('returns parsed value for existing keys', () => {
    localStorage.setItem('fx-checker:test', JSON.stringify({ a: 1 }))
    expect(getItem<{ a: number }>('test')).toEqual({ a: 1 })
  })

  it('returns null on corrupted JSON', () => {
    localStorage.setItem('fx-checker:corrupt', '{bad json}')
    expect(getItem('corrupt')).toBeNull()
  })
})

describe('setItem', () => {
  it('writes stringified value', () => {
    setItem('key', [1, 2, 3])
    expect(localStorage.getItem('fx-checker:key')).toBe('[1,2,3]')
  })

  it('overwrites existing value', () => {
    setItem('key', 'first')
    setItem('key', 'second')
    expect(getItem('key')).toBe('second')
  })
})

describe('removeItem', () => {
  it('removes the key', () => {
    setItem('key', 'value')
    removeItem('key')
    expect(getItem('key')).toBeNull()
  })
})
