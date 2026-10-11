import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: [],
    testTimeout: 30000,
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://test_user:test_password@localhost:5432/test_db',
      JWT_ACCESS_SECRET: 'test_access_secret_at_least_32_characters_long',
      JWT_REFRESH_SECRET: 'test_refresh_secret_at_least_32_characters_long',
      OTP_SECRET: 'test_otp_secret_at_least_32_characters_long',
      JWT_ACCESS_EXPIRY: '15m',
      JWT_REFRESH_EXPIRY: '7d',
      WEB_ORIGIN: 'http://localhost:3000',
      SMTP_HOST: 'localhost',
      SMTP_PORT: '1025',
      SMTP_SECURE: 'false',
      SMTP_USER: '',
      SMTP_PASS: '',
      EMAIL_FROM: 'test@campusconnect.local',
      APP_URL: 'http://localhost:3000',
      ALLOWED_EMAIL_DOMAINS: 'cb.amrita.edu,am.amrita.edu,amrita.edu',
      PORT: '4001',
    },
  },
});
