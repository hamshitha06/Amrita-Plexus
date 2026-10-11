'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function CartCheckoutPage() {
  const {
    cart, cartCount, cartTotal,
    updateCartQty, removeFromCart,
    canteens,
    userName, userRoom,
    postFoodRequest,
  } = usePlexus();

  const [deliveryAddress, setDeliveryAddress] = useState(userRoom || '');
  const [instructions, setInstructions] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');

  // Determine active canteen from cart
  const cartCanteenId = cart[0]?.canteenId;
  const activeCanteen = canteens.find(c => c.id === cartCanteenId) || canteens[0];

  const totalAmount = cartTotal + deliveryFee;

  const handleSubmit = async () => {
    if (!deliveryAddress.trim() || cart.length === 0) return;
    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 500));
    const reqNum = `#REQ-P2P-${Math.floor(1000 + Math.random() * 9000)}`;
    const success = postFoodRequest(deliveryAddress, instructions, deliveryFee);
    setIsSubmitting(false);
    if (success) {
      setRequestNumber(reqNum);
      setSubmitted(true);
    }
  };

  // ── Success State ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <AppLayout breadcrumb="Student Portal / Canteen / Cart" title="Request Submitted!">
        <div className="space-y-6">
          <div>
            <Link href="/canteen" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 mb-1">
              ← Canteen Home
            </Link>
            <h2 className="text-2xl font-black text-slate-900">Request Posted Successfully!</h2>
          </div>
          <div className="bg-emerald-50 rounded-3xl p-10 border border-emerald-200 shadow-2xs text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-900">🍕 Your P2P Food Request is Live!</h3>
              <p className="text-sm text-emerald-700 font-medium mt-1">
                Request <strong>{requestNumber}</strong> posted. A peer deliverer will accept shortly.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 text-left space-y-2.5 max-w-sm mx-auto text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup Canteen</span>
                <strong className="text-slate-800">{activeCanteen.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deliver to</span>
                <strong className="text-slate-800">{deliveryAddress}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Food Subtotal</span>
                <span className="text-slate-800">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Fee</span>
                <span className="text-emerald-700">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="font-black text-slate-900">Total Deducted</span>
                <span className="font-black text-slate-900">₹{totalAmount}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center flex-wrap pt-2">
              <Link href="/canteen/my-requests" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all">
                Track My Request →
              </Link>
              <Link href="/canteen/menu" className="px-6 py-2.5 border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold transition-all">
                Order More Food
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Empty Cart ─────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <AppLayout breadcrumb="Student Portal / Canteen / Cart" title="Your Cart">
        <div className="space-y-6">
          <div>
            <Link href="/canteen/menu" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 mb-1">
              ← Back to Menu
            </Link>
            <h2 className="text-2xl font-black text-slate-900">Food Delivery Request Cart</h2>
          </div>
          <div className="bg-white rounded-3xl p-14 border border-slate-200/80 shadow-2xs text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-800">Your cart is empty</h3>
            <p className="text-xs text-slate-400 font-medium">Browse the menu and add items to get started.</p>
            <Link href="/canteen/menu" className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all">
              Browse Menu
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Cart & Checkout ────────────────────────────────────────────────────────
  return (
    <AppLayout breadcrumb="Student Portal / Canteen / Cart" title="Cart & Checkout">
      <div className="space-y-6">
        <div>
          <Link href="/canteen/menu" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 mb-1">
            ← Back to Menu
          </Link>
          <h2 className="text-2xl font-black text-slate-900">Food Delivery Request Cart &amp; Checkout</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Cart Items */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Items from {activeCanteen.name} ({cartCount})
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{activeCanteen.location}</p>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  {activeCanteen.icon} {activeCanteen.name}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-5">
                {cart.map(item => (
                  <div key={item.id} className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">₹{item.price} each</p>
                      </div>
                      <span className="font-black text-sm text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-black text-slate-700 cursor-pointer transition-all text-base leading-none"
                        >
                          −
                        </button>
                        <span className="text-sm font-extrabold text-slate-900 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-black text-slate-700 cursor-pointer transition-all text-base leading-none"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/canteen/menu" className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 pt-3 border-t border-slate-100">
                + Add More Items from Menu
              </Link>
            </div>
          </div>

          {/* Right: Post Delivery Request */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
              <h3 className="font-black text-base text-slate-900">Post Peer Delivery Request</h3>

              {/* Customer Info */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Customer Student</p>
                <p className="text-sm font-extrabold text-slate-900">{userName}</p>
                <p className="text-xs text-amber-700 font-semibold">
                  Pickup Canteen: <strong>{activeCanteen.name}</strong>
                </p>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Campus Delivery Address / Room *</label>
                <input
                  type="text"
                  placeholder="e.g. Hostel 3, Room 102"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Instructions for Peer Deliverer (Optional)</label>
                <textarea
                  placeholder="e.g. Please ask for extra chutney / call when near hostel gate"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400 resize-none"
                />
              </div>

              {/* Delivery Fee */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Peer Delivery Fee Incentive (₹) *</label>
                <div className="flex items-center gap-2">
                  {[10, 15, 20, 25, 30].map(fee => (
                    <button
                      key={fee}
                      onClick={() => setDeliveryFee(fee)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        deliveryFee === fee
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ₹{fee}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={deliveryFee}
                    onChange={e => setDeliveryFee(parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs font-semibold text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Higher fee incentivizes peer deliverers to accept quickly!</p>
              </div>

              {/* Bill Summary */}
              <div className="border border-slate-100 rounded-2xl p-4 space-y-2 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Estimated Food Subtotal</span>
                  <span className="font-bold text-slate-800">₹{cartTotal}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold">Peer Delivery Earning Fee</span>
                  <span className="font-bold text-emerald-600">+₹{deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 mt-1">
                  <span className="text-sm font-black text-slate-900">Total Estimated Payment</span>
                  <span className="text-lg font-black text-slate-900">₹{totalAmount}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 p-3.5 rounded-2xl">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                  ₹{totalAmount} will be deducted from your E-Wallet when you post this request.
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !deliveryAddress.trim()}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Posting Request...'
                ) : (
                  <>
                    Post P2P Delivery Request (₹{totalAmount})
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
