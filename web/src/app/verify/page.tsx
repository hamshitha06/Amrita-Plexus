'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Suspense } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type VerifyState = 'loading' | 'success' | 'expired' | 'used' | 'invalid';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<VerifyState>('loading');
  const [resendEmail, setResendEmail] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!token) {
      setState('invalid');
      return;
    }

    fetch(`${API_URL}/api/auth/verify?token=${token}`)
      .then(async (res) => {
        const body = await res.json();
        if (res.ok) {
          setState('success');
        } else if (body.error?.code === 'TOKEN_EXPIRED') {
          setState('expired');
        } else if (body.error?.code === 'TOKEN_USED') {
          setState('used');
        } else {
          setState('invalid');
        }
      })
      .catch(() => setState('invalid'));
  }, [token]);

  async function handleResend() {
    if (!resendEmail) return;
    if (countdown > 0) return;

    try {
      await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });
      toast.success('New verification email sent!');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch {
      toast.error('Failed to resend email. Try again.');
    }
  }

  const states = {
    loading: {
      icon: <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />,
      title: 'Verifying your email…',
      desc: 'Please wait while we verify your link.',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
    },
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
      title: 'Email verified! 🎉',
      desc: 'Your account is active. You can now log in.',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    expired: {
      icon: <Clock className="w-12 h-12 text-orange-500" />,
      title: 'Link expired',
      desc: 'This verification link has expired (24h limit). Request a new one below.',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
    used: {
      icon: <CheckCircle2 className="w-12 h-12 text-blue-500" />,
      title: 'Already verified',
      desc: 'This link has already been used. Your account is already active.',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    invalid: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      title: 'Invalid link',
      desc: 'This verification link is not valid. It may have been malformed.',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
  };

  const current = states[state];

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 250, delay: 0.1 }}
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${current.bg} mx-auto`}
        >
          {current.icon}
        </motion.div>

        <div className="space-y-2">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {current.title}
          </h2>
          <p className="text-muted text-sm max-w-sm mx-auto leading-relaxed">
            {current.desc}
          </p>
        </div>

        {/* Resend section for expired/invalid states */}
        {(state === 'expired' || state === 'invalid') && (
          <div className="space-y-3 pt-2">
            <input
              type="email"
              placeholder="Enter your college email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="auth-input text-center"
            />
            <button
              type="button"
              onClick={handleResend}
              disabled={!resendEmail || countdown > 0}
              className="auth-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4" />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend verification email'}
            </button>
          </div>
        )}

        <div className="pt-2 space-y-2">
          {state === 'success' && (
            <Link href="/login" className="auth-btn inline-flex">
              Go to login
            </Link>
          )}
          {state === 'used' && (
            <Link href="/login" className="auth-btn inline-flex">
              Go to login
            </Link>
          )}
          <div>
            <Link
              href="/login"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      </AuthLayout>
    }>
      <VerifyContent />
    </Suspense>
  );
}
