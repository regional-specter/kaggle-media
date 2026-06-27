import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, KeyRound, Shield, Trash2 } from 'lucide-react'
import { validateCredentials } from '../../api/kaggle'
import type { KaggleCredentials } from '../../types/kaggle'
import { ErrorState } from '../ui/ErrorState'
import { StatusBadge } from '../ui/StatusBadge'

interface CredentialsFormProps {
  credentials: KaggleCredentials
  hasCredentials: boolean
  onSave: (credentials: KaggleCredentials) => void
  onClear: () => void
}

export function CredentialsForm({
  credentials,
  hasCredentials,
  onSave,
  onClear,
}: CredentialsFormProps) {
  const [username, setUsername] = useState(credentials.username)
  const [apiKey, setApiKey] = useState(credentials.apiKey)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    const next = { username: username.trim(), apiKey: apiKey.trim() }

    try {
      await validateCredentials(next)
      onSave(next)
      setSaved(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to validate credentials with Kaggle.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-700">
              <KeyRound className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              API Credentials
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Connect your Kaggle account using Basic Authentication. Credentials
              are stored locally in your browser and never sent anywhere except
              Kaggle&apos;s API.
            </p>
          </div>
          {hasCredentials ? (
            <StatusBadge variant="positive">Connected</StatusBadge>
          ) : (
            <StatusBadge variant="negative">Not configured</StatusBadge>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-kaggle-username"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
            />
          </div>

          <div>
            <label
              htmlFor="apiKey"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              autoComplete="current-password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Kaggle API token"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
            />
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <p className="text-xs leading-relaxed text-gray-500">
              Find your API token at{' '}
              <a
                href="https://www.kaggle.com/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-700 underline-offset-2 hover:underline"
              >
                kaggle.com/settings
              </a>
              . We encode credentials as{' '}
              <code className="rounded bg-white px-1 py-0.5 text-[11px] text-gray-600">
                Authorization: Basic
              </code>{' '}
              for each request.
            </p>
          </div>

          {error && (
            <div className="rounded-xl">
              <ErrorState title="Authentication failed" message={error} />
            </div>
          )}

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <CheckCircle2 className="h-4 w-4" />
              Credentials saved and verified successfully.
            </motion.div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !username.trim() || !apiKey.trim()}
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Validating…' : 'Save credentials'}
            </button>

            {hasCredentials && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear stored credentials
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
