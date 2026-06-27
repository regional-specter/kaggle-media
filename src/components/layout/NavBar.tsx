import { Compass, Bookmark, Settings } from 'lucide-react'
import type { AppTab } from '../../types/kaggle'

const tabs: { id: AppTab; label: string; icon: typeof Compass }[] = [
  { id: 'discover', label: 'Discover Feed', icon: Compass },
  { id: 'bookmarked', label: 'Bookmarked', icon: Bookmark },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface NavBarProps {
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
  bookmarkCount: number
}

export function NavBar({ activeTab, onTabChange, bookmarkCount }: NavBarProps) {
  return (
    <nav className="sticky top-0 z-20 border-b border-gray-100 bg-[#F8F9FA]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
            K
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-gray-900">
              Kaggle Scroller
            </p>
            <p className="text-xs text-gray-500">Dataset exploration</p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-2xl border border-gray-100 bg-white p-1 shadow-card">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  active
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
                {id === 'bookmarked' && bookmarkCount > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      active
                        ? 'bg-white/15 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {bookmarkCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
