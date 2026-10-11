'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Store, Plus } from 'lucide-react';
import { usePlexus } from '@/contexts/PlexusContext';

interface SellSnackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellSnackModal({ isOpen, onClose }: SellSnackModalProps) {
  const { addSnack, userName, userHostel, userRoom } = usePlexus();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Homemade Treats');
  const [price, setPrice] = useState(40);
  const [availableQty, setAvailableQty] = useState(3);
  const [iconType, setIconType] = useState<'brownie' | 'noodles' | 'cookies' | 'chips' | 'beverage'>('brownie');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addSnack({
      title: title.trim(),
      category,
      price,
      seller: `${userName} R.`,
      pickupLocation: `${userHostel}, Room ${userRoom}`,
      availableQty,
      iconType,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
              🍿
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">List Snack Item</h3>
              <p className="text-xs text-slate-400">Sell homemade treats & pantry snacks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Snack Item Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Homemade Chocolate Cookies"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Homemade Treats">Homemade Treats</option>
                <option value="Instant Noodles">Instant Noodles</option>
                <option value="Bakery & Cookies">Bakery & Cookies</option>
                <option value="Chips & Munchies">Chips & Munchies</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Icon Type
              </label>
              <select
                value={iconType}
                onChange={e => setIconType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="brownie">🧁 Brownies / Dessert</option>
                <option value="noodles">🍜 Instant Noodles</option>
                <option value="cookies">🍪 Bakery Cookies</option>
                <option value="chips">🍟 Chips / Munchies</option>
                <option value="beverage">🥤 Cold Coffee / Drink</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Price per Unit (₹)
              </label>
              <input
                type="number"
                required
                min={10}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Available Quantity
              </label>
              <input
                type="number"
                required
                min={1}
                value={availableQty}
                onChange={e => setAvailableQty(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs text-slate-600">
            <p className="font-bold text-slate-800">Pickup Location:</p>
            <p>{userHostel}, Room {userRoom}</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              List Snack in Gargi Pantry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
