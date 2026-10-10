'use client';

import React, { useState } from 'react';
import { X, Wallet, CreditCard, ArrowUpRight, Check } from 'lucide-react';
import { usePlexus } from '@/contexts/PlexusContext';

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddWalletModal({ isOpen, onClose }: AddWalletModalProps) {
  const { walletBalance, addWalletFunds } = usePlexus();
  const [amount, setAmount] = useState(100);

  if (!isOpen) return null;

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    addWalletFunds(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Amrita E-Wallet</h3>
              <p className="text-xs text-slate-400">Current Balance: ₹{walletBalance}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAddFunds} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Select Top-Up Amount (₹)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 250, 500].map(amt => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    amount === amt
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  + ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Custom Amount (UPI / GPay)
            </label>
            <input
              type="number"
              min={10}
              max={5000}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Payment Method:</span>
            <span className="text-slate-900 font-bold flex items-center gap-1">
              📱 UPI / Amrita Student Pay
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Pay & Add ₹{amount} to E-Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
