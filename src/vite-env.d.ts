/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Override API base (default: `/api/kaggle` proxy). Set to full Kaggle URL only for debugging. */
  readonly VITE_KAGGLE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
