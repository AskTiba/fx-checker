import { create } from 'zustand'
import type { TabId } from '../types/currency'
import { getItem, setItem } from '../lib/storage'

const STORAGE_KEY = 'ui'

interface UIState {
  activeTab: TabId
  currencyPickerOpen: 'base' | 'target' | null
  searchQuery: string
  chartRange: string
  setActiveTab: (tab: TabId) => void
  openCurrencyPicker: (side: 'base' | 'target') => void
  closeCurrencyPicker: () => void
  setSearchQuery: (query: string) => void
  setChartRange: (range: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: getItem<{ tab: TabId }>(STORAGE_KEY)?.tab ?? 'history',
  currencyPickerOpen: null,
  searchQuery: '',
  chartRange: '1M',
  setActiveTab: (activeTab) => {
    set({ activeTab })
    setItem(STORAGE_KEY, { tab: activeTab })
  },
  openCurrencyPicker: (side) => set({ currencyPickerOpen: side, searchQuery: '' }),
  closeCurrencyPicker: () => set({ currencyPickerOpen: null, searchQuery: '' }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setChartRange: (chartRange) => set({ chartRange }),
}))
