/// <reference types="vite/client" />
declare module "vite-plugin-eslint";
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // thêm các biến môi trường khác nếu cần
  // readonly VITE_ANOTHER_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
