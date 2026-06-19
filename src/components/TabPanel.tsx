import { useUIStore } from '../store/useUIStore'
import { useFavoritesStore } from '../store/useFavoritesStore'
import { useLogStore } from '../store/useLogStore'
import type { TabId } from '../types/currency'
import HistoryTab from './HistoryTab'
import CompareTab from './CompareTab'
import FavoritesTab from './FavoritesTab'
import LogTab from './LogTab'

const tabs: { id: TabId; label: string }[] = [
  { id: 'history', label: 'History' },
  { id: 'compare', label: 'Compare' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'log', label: 'Log' },
]

export default function TabPanel() {
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const favCount = useFavoritesStore((s) => s.pairs.length)
  const logCount = useLogStore((s) => s.entries.length)

  function badgeCount(id: TabId): number | null {
    if (id === 'favorites') return favCount || null
    if (id === 'log') return logCount || null
    return null
  }

  return (
    <div className="space-y-4">
      {/* Desktop/tablet tab bar */}
      <div
        role="tablist"
        className="hidden gap-8 md:flex"
        aria-label="Sections"
      >
        {tabs.map((tab) => {
          const badge = badgeCount(tab.id)
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex cursor-pointer items-center gap-2 border-b-2 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? 'border-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              {badge !== null && (
                <span className="flex size-5 items-center justify-center rounded-full bg-surface-700 text-[10px] tabular-nums text-text-primary">
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <section className="rounded-2xl border border-surface-600 bg-surface-800 overflow-hidden">

      {/* Mobile tab dropdown */}
      <div className="border-b border-surface-600 md:hidden">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as TabId)}
          className="w-full cursor-pointer bg-surface-800 px-4 py-3 text-sm text-text-primary outline-none"
          aria-label="Select section"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
              {tab.id === 'favorites' && favCount > 0 ? ` (${favCount})` : ''}
              {tab.id === 'log' && logCount > 0 ? ` (${logCount})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Tab panels */}
      {activeTab === 'history' && <HistoryTab />}
      {activeTab === 'compare' && <CompareTab />}
      {activeTab === 'favorites' && <FavoritesTab />}
      {activeTab === 'log' && <LogTab />}
      </section>
    </div>
  )
}
