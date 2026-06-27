import type { ReactNode } from 'react'

interface AppLayoutProps {
  navbar: ReactNode
  children: ReactNode
}

export function AppLayout({ navbar, children }: AppLayoutProps) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#F8F9FA]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(17,24,39,0.03),_transparent_55%)]"
      />

      {navbar}

      <main className="relative mx-auto max-w-7xl px-3 py-5 pb-24 sm:px-6 sm:py-8 sm:pb-8 lg:px-8">
        {children}
      </main>
    </div>
  )
}
