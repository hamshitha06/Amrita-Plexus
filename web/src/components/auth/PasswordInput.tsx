'use client';

import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showCapsLock?: boolean;
}

export function PasswordInput({ showCapsLock = true, className = '', ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (typeof e.getModifierState === 'function') {
        setCapsLock(e.getModifierState('CapsLock'));
      }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
    };
  }, []);

  return (
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4 pointer-events-none" />
      <input
        ref={inputRef}
        type={show ? 'text' : 'password'}
        className={`auth-input pl-11 pr-20 ${className}`}
        {...props}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {showCapsLock && capsLock && (
          <span
            className="text-xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-medium select-none"
            aria-live="polite"
            role="alert"
          >
            CAPS
          </span>
        )}
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="p-1 text-muted hover:text-foreground transition-colors rounded focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
