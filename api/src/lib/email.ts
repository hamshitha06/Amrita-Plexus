import { mailer } from '../config/mailer';
import { env } from '../config/env';

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const link = `${env.APP_URL}/verify?token=${token}`;

  console.log('\n=============================================');
  console.log(`✉️ DEV EMAIL INTERCEPT: Verification for ${to}`);
  console.log(`🔗 Click here to verify: ${link}`);
  console.log('=============================================\n');

  try {
    await mailer.sendMail({
      from: `"CampusConnect" <${env.EMAIL_FROM}>`,
      to,
      subject: 'Verify your CampusConnect account',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #F7F2EC; margin: 0; padding: 0; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #1A0A0D; padding: 40px 32px; }
    .header h1 { color: #E8932A; margin: 0; font-size: 24px; font-weight: 700; }
    .header p { color: #F7F2EC; margin: 8px 0 0; opacity: 0.8; }
    .body { padding: 32px; }
    .body p { color: #333; line-height: 1.6; }
    .btn { display: inline-block; background: #E8932A; color: #fff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .link { color: #666; font-size: 13px; word-break: break-all; }
    .footer { padding: 16px 32px; border-top: 1px solid #f0f0f0; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>CampusConnect</h1>
      <p>Amrita Vishwa Vidyapeetham</p>
    </div>
    <div class="body">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thanks for signing up! Click the button below to verify your email address and activate your account.</p>
      <a href="${link}" class="btn">Verify Email Address</a>
      <p class="link">Or copy this link: ${link}</p>
      <p>This link expires in <strong>24 hours</strong> and can only be used once.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CampusConnect · Amrita Vishwa Vidyapeetham</div>
  </div>
</body>
</html>
      `.trim(),
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const link = `${env.APP_URL}/reset-password?token=${token}`;

  try {
    await mailer.sendMail({
      from: `"CampusConnect" <${env.EMAIL_FROM}>`,
      to,
      subject: 'Reset your CampusConnect password',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #F7F2EC; margin: 0; padding: 0; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #1A0A0D; padding: 40px 32px; }
    .header h1 { color: #E8932A; margin: 0; font-size: 24px; font-weight: 700; }
    .body { padding: 32px; }
    .body p { color: #333; line-height: 1.6; }
    .btn { display: inline-block; background: #E8932A; color: #fff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .link { color: #666; font-size: 13px; word-break: break-all; }
    .footer { padding: 16px 32px; border-top: 1px solid #f0f0f0; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>CampusConnect</h1>
    </div>
    <div class="body">
      <p>Hi <strong>${name}</strong>,</p>
      <p>We received a request to reset your password. Click below to set a new one.</p>
      <a href="${link}" class="btn">Reset Password</a>
      <p class="link">Or copy this link: ${link}</p>
      <p>This link expires in <strong>1 hour</strong> and can only be used once.</p>
      <p>If you didn't request this, your account is safe — just ignore this email.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CampusConnect · Amrita Vishwa Vidyapeetham</div>
  </div>
</body>
</html>
      `.trim(),
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }
}
