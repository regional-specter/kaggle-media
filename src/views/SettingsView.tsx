import { CredentialsForm } from '../components/settings/CredentialsForm'
import type { KaggleCredentials } from '../types/kaggle'

interface SettingsViewProps {
  credentials: KaggleCredentials
  hasCredentials: boolean
  onSave: (credentials: KaggleCredentials) => void
  onClear: () => void
}

export function SettingsView({
  credentials,
  hasCredentials,
  onSave,
  onClear,
}: SettingsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your Kaggle API connection and preferences.
        </p>
      </div>

      <CredentialsForm
        credentials={credentials}
        hasCredentials={hasCredentials}
        onSave={onSave}
        onClear={onClear}
      />
    </div>
  )
}
