import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-5 py-12 text-center shadow-card sm:px-8 sm:py-16">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-gray-900">
        {title}
      </h3>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Try again
        </button>
      )}
    </div>
  )
}
