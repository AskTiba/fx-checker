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
    <section className="rounded-xl border border-surface-600 bg-surface-800">
      {/* Desktop/tablet tab bar */}
      <div
        role="tablist"
        className="hidden border-b border-surface-600 md:flex"
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
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              {badge !== null && (
                <span className="rounded-full bg-surface-600 px-2 py-0.5 text-[11px] tabular-nums">
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Mobile tab dropdown */}
      <div className="border-b border-surface-600 md:hidden">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as TabId)}
          className="w-full bg-surface-800 px-4 py-3 text-sm text-text-primary outline-none"
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
  )
}
