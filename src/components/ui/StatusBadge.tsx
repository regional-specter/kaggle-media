import type { ReactNode } from 'react'

type BadgeVariant = 'positive' | 'negative' | 'neutral'

const variantStyles: Record<BadgeVariant, string> = {
  positive: 'bg-emerald-50 text-emerald-800',
  negative: 'bg-red-50 text-red-800',
  neutral: 'bg-slate-100 text-slate-700',
}

interface StatusBadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

export function StatusBadge({
  children,
  variant = 'neutral',
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  )
}
