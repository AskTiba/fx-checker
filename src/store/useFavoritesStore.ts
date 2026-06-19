import { create } from 'zustand'
import type { FavoritePair } from '../types/currency'
import { getItem, setItem } from '../lib/storage'

const STORAGE_KEY = 'favorites'
let nextId = Date.now()

function generateId(): string {
  return String(nextId++)
}

interface FavoritesState {
  pairs: FavoritePair[]
  addPair: (base: string, target: string) => void
  removePair: (id: string) => void
  isPinned: (base: string, target: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  pairs: getItem<FavoritePair[]>(STORAGE_KEY) ?? [],
  addPair: (base, target) => {
    const { pairs } = get()
    const exists = pairs.some(
      (p) => p.base === base && p.target === target
    )
    if (exists) return
    const newPair: FavoritePair = {
      id: generateId(),
      base,
      target,
      pinnedAt: Date.now(),
    }
    const updated = [newPair, ...pairs]
    set({ pairs: updated })
    setItem(STORAGE_KEY, updated)
  },
  removePair: (id) => {
    const updated = get().pairs.filter((p) => p.id !== id)
    set({ pairs: updated })
    setItem(STORAGE_KEY, updated)
  },
  isPinned: (base, target) => {
    return get().pairs.some(
      (p) => p.base === base && p.target === target
    )
  },
}))
