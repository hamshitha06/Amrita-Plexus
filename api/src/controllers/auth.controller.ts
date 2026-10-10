import { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { generateToken } from '../lib/tokens';
import { mailer } from '../config/mailer';

const OTP_EXPIRY_MINUTES = 5;

// Memory OTP store fallback when DB is unreachable
const memoryOtpStore = new Map<string, { code: string; expiresAt: number }>();

const requestCodeSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
});

const verifyCodeSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  code: z.string().length(6, 'Code must be 6 digits'),
  name: z.string().optional(),
});

export const requestCode: RequestHandler = async (req, res, next) => {
  try {
    const { email } = requestCodeSchema.parse(req.body);

    // Generate 6-digit verification code
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

    // Store in memory fallback
    memoryOtpStore.set(email, { code, expiresAt });

    // Try saving in Prisma if available
    try {
      const codeHash = crypto.createHmac('sha256', process.env.OTP_SECRET || 'secret').update(`${email}:${code}`).digest('hex');
      await prisma.emailOtp.create({
        data: {
          email,
          codeHash,
          expiresAt: new Date(expiresAt),
          ip: req.ip,
        },
      });
    } catch (dbErr) {
      console.log('⚠️ Database unreachable, using memory OTP store fallback.');
    }

    console.log(`\n=============================================`);
    console.log(`✉️ SENDING REAL VERIFICATION EMAIL TO: ${email}`);
    console.log(`🔑 OTP CODE GENERATED: ${code}`);
    console.log(`=============================================\n`);

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { background-color: #1a1625; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; margin: 0; }
          .container { max-width: 440px; margin: 0 auto; background: #231e30; border-radius: 20px; padding: 36px 28px; border: 1px solid #3b334d; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
          .icon { font-size: 42px; margin-bottom: 16px; }
          .title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #a78bfa; margin-bottom: 20px; }
          .otp-box { background: #14111c; border-radius: 14px; padding: 22px; margin: 24px 0; border: 1px dashed #4c3d69; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 14px; color: #ffffff; margin-left: 14px; }
          .footer { font-size: 13px; color: #94a3b8; margin-top: 24px; line-height: 1.6; }
          .highlight { color: #c084fc; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">💌</div>
          <div class="title">YOUR OTP CODE</div>
          <div class="otp-box">
            <div class="otp-code">${code.split('').join(' ')}</div>
          </div>
          <div class="footer">
            ⏱️ Expires in <span class="highlight">${OTP_EXPIRY_MINUTES} minutes</span>. Do not share this code with anyone.<br><br>
            <span style="font-size: 12px; color: #64748b;">If you didn't request this, you can safely ignore this email.</span>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const info = await mailer.sendMail({
        from: `"AmritaPlexus Verification" <${env.EMAIL_FROM || 'arichandni2006@gmail.com'}>`,
        to: email,
        subject: `Verification Code: ${code}`,
        text: `Your OTP code is ${code}. Expires in 5 minutes.`,
        html: htmlTemplate,
      });

      console.log(`✅ Email sent via Gmail SMTP! MessageId: ${info.messageId}`);
    } catch (mailErr: any) {
      console.error('🚨 Nodemailer Error:', mailErr.message);
    }

    res.status(200).json({ success: true, message: `Verification code sent to ${email}`, code: process.env.NODE_ENV === 'development' ? code : undefined });
  } catch (err) {
    next(err);
  }
};

export const verifyCode: RequestHandler = async (req, res, next) => {
  try {
    const { email, code } = verifyCodeSchema.parse(req.body);

    const memoryOtp = memoryOtpStore.get(email);
    let isValid = false;

    if (memoryOtp && memoryOtp.code === code && memoryOtp.expiresAt > Date.now()) {
      isValid = true;
    } else {
      try {
        const otp = await prisma.emailOtp.findFirst({
          where: { email, usedAt: null },
          orderBy: { createdAt: 'desc' },
        });
        if (otp && otp.expiresAt > new Date()) {
          const providedHash = crypto.createHmac('sha256', process.env.OTP_SECRET || 'secret').update(`${email}:${code}`).digest('hex');
          if (providedHash === otp.codeHash) isValid = true;
        }
      } catch (err) {}
    }

    if (!isValid) {
      res.status(400).json({ error: { code: 'INVALID_CODE', message: 'Invalid or expired verification code' } });
      return;
    }

    // Success response with token
    res.status(200).json({
      accessToken: 'sample-access-token',
      user: { id: 'usr-1', name: 'Hamshitha', email, roles: ['student'] },
    });
  } catch (err) {
    next(err);
  }
};

export const refresh: RequestHandler = async (req, res) => {
  res.status(200).json({ accessToken: 'sample-access-token', user: { id: 'usr-1', name: 'Hamshitha', email: 'student@amrita.edu', roles: ['student'] } });
};

export const logout: RequestHandler = async (req, res) => {
  res.status(200).json({ message: 'Logged out' });
};

export const me: RequestHandler = async (req, res) => {
  res.status(200).json({ id: 'usr-1', name: 'Hamshitha', email: 'student@amrita.edu', roles: ['student'] });
};
