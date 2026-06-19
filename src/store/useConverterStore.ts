import { create } from 'zustand'

interface ConverterState {
  base: string
  target: string
  amount: number
  rate: number | null
  setBase: (code: string) => void
  setTarget: (code: string) => void
  setAmount: (amount: number) => void
  setRate: (rate: number | null) => void
  swap: () => void
}

export const useConverterStore = create<ConverterState>((set) => ({
  base: 'USD',
  target: 'EUR',
  amount: 1000,
  rate: null,
  setBase: (base) => set({ base }),
  setTarget: (target) => set({ target }),
  setAmount: (amount) => set({ amount }),
  setRate: (rate) => set({ rate }),
  swap: () => set((s) => ({ base: s.target, target: s.base })),
}))
