import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-8 py-16 text-center shadow-card">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-gray-900">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
