import { env } from './env';

export const r2Config = {
  accountId: env.R2_ACCOUNT_ID,
  accessKeyId: env.R2_ACCESS_KEY_ID,
  secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  endpoint: env.R2_ENDPOINT,
  token: env.R2_TOKEN,
  bucketName: env.R2_BUCKET_NAME || 'amrita-plexus',
};

/**
 * Returns public/presigned URL structure for assets stored in Cloudflare R2
 */
export function getR2AssetUrl(key: string): string {
  if (!r2Config.endpoint) return `/uploads/${key}`;
  return `${r2Config.endpoint}/${r2Config.bucketName}/${key}`;
}
