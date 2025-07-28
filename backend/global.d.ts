declare namespace NodeJS {
  interface ProcessEnv {
    ADMIN_LOGIN_USERNAME: string;
    ADMIN_LOGIN_PASSWORD: string;
    JWT_SECRET: string;
    // Add any other required env vars here
  }
} 