/// <reference types="vite/client" />

declare module 'react-router-dom' {
  export * from 'react-router-dom';
}

interface ImportMeta {
  readonly env: {
    readonly VITE_API_URL: string;
  };
} 