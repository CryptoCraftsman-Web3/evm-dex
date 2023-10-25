global {
  namespace NodeJS {
    interface ProcessEnv {
      VERCEL_ENV: 'development' | 'preview' | 'production';
      NEXT_PUBLIC_WC_PID: string;
      NEXT_PUBLIC_INFURA_API_KEY: string;
      DATABASE_HOST: string;
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
    }
  }
}

export {};
