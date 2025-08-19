/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // başka değişkenlerin varsa buraya ekle
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
