import { z } from 'zod';

const envSchema = z.object({
  PORT: z
    .string()
    .default('4000')
    .transform((v) => parseInt(v, 10)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  OTP_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  WEB_ORIGIN: z.string().url(),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z
    .string()
    .default('1025')
    .transform((v) => parseInt(v, 10)),
  SMTP_SECURE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  EMAIL_FROM: z.string().default('noreply@campusconnect.local'),
  APP_URL: z.string().url(),
  ALLOWED_EMAIL_DOMAINS: z.string().default('cb.amrita.edu,am.amrita.edu,amrita.edu'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const ALLOWED_DOMAINS = env.ALLOWED_EMAIL_DOMAINS.split(',').map((d) =>
  d.trim().toLowerCase()
);
