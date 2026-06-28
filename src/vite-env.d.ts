/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public site URL for canonical links, Open Graph, sitemap, and robots.txt. */
  readonly VITE_SITE_URL?: string
  /** Override API base (default: `/api/kaggle` proxy). Set to full Kaggle URL only for debugging. */
  readonly VITE_KAGGLE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
