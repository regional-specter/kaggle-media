import { useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { NavBar } from './components/layout/NavBar'
import { useBookmarks } from './hooks/useBookmarks'
import { useCredentials } from './hooks/useCredentials'
import type { AppTab } from './types/kaggle'
import { BookmarkedView } from './views/BookmarkedView'
import { DiscoverFeed } from './views/DiscoverFeed'
import { SettingsView } from './views/SettingsView'

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('discover')
  const { credentials, saveCredentials, clearCredentials, hasCredentials } =
    useCredentials()
  const { bookmarks, bookmarkedDatasets, isBookmarked, toggleBookmark } =
    useBookmarks()

  return (
    <AppLayout
      navbar={
        <NavBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          bookmarkCount={bookmarks.length}
        />
      }
    >
      {activeTab === 'discover' && (
        <DiscoverFeed
          credentials={credentials}
          hasCredentials={hasCredentials}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onGoToSettings={() => setActiveTab('settings')}
        />
      )}

      {activeTab === 'bookmarked' && (
        <BookmarkedView
          datasets={bookmarkedDatasets}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onGoToDiscover={() => setActiveTab('discover')}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          credentials={credentials}
          hasCredentials={hasCredentials}
          onSave={saveCredentials}
          onClear={clearCredentials}
        />
      )}
    </AppLayout>
  )
}

export default App
