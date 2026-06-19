import { create } from 'zustand'
import type { ConversionEntry } from '../types/currency'
import { getItem, setItem } from '../lib/storage'

const STORAGE_KEY = 'log'
let nextId = Date.now()

function generateId(): string {
  return String(nextId++)
}

interface LogState {
  entries: ConversionEntry[]
  addEntry: (entry: Omit<ConversionEntry, 'id' | 'timestamp'>) => void
  removeEntry: (id: string) => void
  clearAll: () => void
}

export const useLogStore = create<LogState>((set, get) => ({
  entries: getItem<ConversionEntry[]>(STORAGE_KEY) ?? [],
  addEntry: (entry) => {
    const newEntry: ConversionEntry = {
      ...entry,
      id: generateId(),
      timestamp: Date.now(),
    }
    const updated = [newEntry, ...get().entries]
    set({ entries: updated })
    setItem(STORAGE_KEY, updated)
  },
  removeEntry: (id) => {
    const updated = get().entries.filter((e) => e.id !== id)
    set({ entries: updated })
    setItem(STORAGE_KEY, updated)
  },
  clearAll: () => {
    set({ entries: [] })
    setItem(STORAGE_KEY, [])
  },
}))
