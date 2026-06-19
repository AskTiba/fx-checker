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
      {/* Scrollable tab bar */}
      <div
        role="tablist"
        className="no-scrollbar flex gap-6 overflow-x-auto border-b border-surface-600/30 pb-[1px] md:gap-8"
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
              className={`group flex shrink-0 cursor-pointer items-center gap-2 border-b-2 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className={`transition-transform duration-300 ${activeTab !== tab.id ? 'group-hover:scale-105' : ''}`}>
                {tab.label}
              </span>
              {badge !== null && (
                <span className="flex size-5 items-center justify-center rounded-full bg-accent/20 text-[10px] tabular-nums text-accent">
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <section className="rounded-2xl border border-surface-600 bg-surface-800 overflow-hidden shadow-2xl shadow-black/20 transition-all">

      {/* Tab panels */}
      {activeTab === 'history' && <HistoryTab />}
      {activeTab === 'compare' && <CompareTab />}
      {activeTab === 'favorites' && <FavoritesTab />}
      {activeTab === 'log' && <LogTab />}
      </section>
    </div>
  )
}
