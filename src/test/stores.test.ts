import { describe, it, expect, beforeEach } from 'vitest'
import { useConverterStore } from '../store/useConverterStore'
import { useFavoritesStore } from '../store/useFavoritesStore'

beforeEach(() => {
  useConverterStore.setState({ base: 'USD', target: 'EUR', amount: 1000, rate: null })
  useFavoritesStore.setState({ pairs: [] })
})

describe('useConverterStore', () => {
  it('starts with defaults', () => {
    const s = useConverterStore.getState()
    expect(s.base).toBe('USD')
    expect(s.target).toBe('EUR')
    expect(s.amount).toBe(1000)
  })

  it('swaps base and target', () => {
    useConverterStore.getState().swap()
    const s = useConverterStore.getState()
    expect(s.base).toBe('EUR')
    expect(s.target).toBe('USD')
  })

  it('updates amount', () => {
    useConverterStore.getState().setAmount(500)
    expect(useConverterStore.getState().amount).toBe(500)
  })
})

describe('useFavoritesStore', () => {
  it('starts empty', () => {
    expect(useFavoritesStore.getState().pairs).toHaveLength(0)
  })

  it('adds a pair', () => {
    useFavoritesStore.getState().addPair('USD', 'EUR')
    expect(useFavoritesStore.getState().pairs).toHaveLength(1)
    expect(useFavoritesStore.getState().pairs[0].base).toBe('USD')
  })

  it('does not duplicate pairs', () => {
    useFavoritesStore.getState().addPair('USD', 'EUR')
    useFavoritesStore.getState().addPair('USD', 'EUR')
    expect(useFavoritesStore.getState().pairs).toHaveLength(1)
  })

  it('removes a pair', () => {
    useFavoritesStore.getState().addPair('USD', 'EUR')
    const id = useFavoritesStore.getState().pairs[0].id
    useFavoritesStore.getState().removePair(id)
    expect(useFavoritesStore.getState().pairs).toHaveLength(0)
  })

  it('checks if a pair is pinned', () => {
    expect(useFavoritesStore.getState().isPinned('USD', 'EUR')).toBe(false)
    useFavoritesStore.getState().addPair('USD', 'EUR')
    expect(useFavoritesStore.getState().isPinned('USD', 'EUR')).toBe(true)
  })
})
