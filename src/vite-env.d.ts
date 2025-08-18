/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // başka env değişkenlerin varsa buraya ekle
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
