'use client';

import { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
}

function getStrength(password: string): StrengthResult {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  score = Math.min(score, 4);

  const levels: StrengthResult[] = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Weak', color: 'bg-red-500' },
    { score: 2, label: 'Fair', color: 'bg-orange-400' },
    { score: 3, label: 'Good', color: 'bg-yellow-400' },
    { score: 4, label: 'Strong', color: 'bg-green-500' },
  ];

  return levels[score];
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5" aria-live="polite" aria-label={`Password strength: ${strength.label}`}>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              strength.score >= level ? strength.color : 'bg-muted/30'
            }`}
          />
        ))}
      </div>
      {strength.label && (
        <p className={`text-xs font-medium ${
          strength.score <= 1 ? 'text-red-500' :
          strength.score === 2 ? 'text-orange-400' :
          strength.score === 3 ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          {strength.label}
        </p>
      )}
    </div>
  );
}
