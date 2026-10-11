#!/usr/bin/env node
/**
 * Lightweight S3 CLI bridge for Cloudflare R2 when AWS CLI is not installed locally.
 * Matches standard 'aws --endpoint-url ... s3 cp/ls/rm' syntax.
 */
const fs = require('fs');
const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const args = process.argv.slice(2);

// Parse flags
let endpoint = process.env.R2_ENDPOINT || '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--endpoint-url' && args[i + 1]) {
    endpoint = args[i + 1];
    args.splice(i, 2);
    i--;
  }
}

const s3Index = args.indexOf('s3');
if (s3Index === -1) {
  console.error('Usage: r2-cli.js [--endpoint-url URL] s3 <cp|ls|rm> ...');
  process.exit(1);
}

const command = args[s3Index + 1];
const cmdArgs = args.slice(s3Index + 2);

const client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'auto',
  endpoint: endpoint || undefined,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

function parseS3Uri(uri) {
  const match = uri.match(/^s3:\/\/([^/]+)\/?(.*)$/);
  if (!match) throw new Error(`Invalid S3 URI: ${uri}`);
  return { Bucket: match[1], Key: match[2] };
}

async function main() {
  if (command === 'cp') {
    const [src, dest] = cmdArgs;
    if (dest.startsWith('s3://')) {
      const { Bucket, Key } = parseS3Uri(dest);
      const fileStream = fs.createReadStream(src);
      const stats = fs.statSync(src);
      await client.send(new PutObjectCommand({
        Bucket,
        Key,
        Body: fileStream,
        ContentLength: stats.size,
      }));
      console.log(`upload: ${src} to s3://${Bucket}/${Key}`);
    } else if (src.startsWith('s3://')) {
      console.error('Download via cp not implemented in fallback CLI');
      process.exit(1);
    }
  } else if (command === 'ls') {
    const uri = cmdArgs[0] || '';
    const { Bucket, Key } = parseS3Uri(uri);
    const prefix = Key ? Key.replace(/^\//, '') : '';
    const res = await client.send(new ListObjectsV2Command({
      Bucket,
      Prefix: prefix,
    }));
    for (const item of (res.Contents || [])) {
      const dt = new Date(item.LastModified).toISOString().replace('T', ' ').substring(0, 19);
      console.log(`${dt} ${String(item.Size).padStart(12)} ${item.Key.split('/').pop()}`);
    }
  } else if (command === 'rm') {
    const { Bucket, Key } = parseS3Uri(cmdArgs[0]);
    await client.send(new DeleteObjectCommand({ Bucket, Key }));
    console.log(`delete: s3://${Bucket}/${Key}`);
  } else {
    console.error(`Unknown S3 command: ${command}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('r2-cli error:', err.message);
  process.exit(1);
});
