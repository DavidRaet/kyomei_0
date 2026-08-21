/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_KYOMEI_API?: string
  readonly VITE_KYOMEI_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
