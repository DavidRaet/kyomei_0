/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KYOMEI_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
