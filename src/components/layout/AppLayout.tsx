import type { ReactNode } from 'react'

interface AppLayoutProps {
  navbar: ReactNode
  children: ReactNode
}

export function AppLayout({ navbar, children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh bg-[#F8F9FA]">
      {navbar}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
