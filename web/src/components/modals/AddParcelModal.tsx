'use client';

import React, { useState } from 'react';
import { X, Package, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { usePlexus } from '@/contexts/PlexusContext';

interface AddParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddParcelModal({ isOpen, onClose }: AddParcelModalProps) {
  const { addParcel, userName, userHostel, userRoom } = usePlexus();

  const [courier, setCourier] = useState('Amazon Logistics');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [arrivalGate, setArrivalGate] = useState('Main Gate Central Vault');
  const [reward, setReward] = useState(25);
  const [room, setRoom] = useState(userRoom);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    addParcel({
      trackingNumber: trackingNumber.trim().toUpperCase(),
      courier,
      arrivalGate,
      destinationHostel: userHostel,
      destinationRoom: room,
      recipientName: `${userName} R.`,
      reward,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Add Parcel Request</h3>
              <p className="text-xs text-slate-400">Request peer delivery from main gate</p>
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
              Courier Service
            </label>
            <select
              value={courier}
              onChange={e => setCourier(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Amazon Logistics">Amazon Logistics</option>
              <option value="Flipkart Express">Flipkart Express</option>
              <option value="Myntra Direct">Myntra Direct</option>
              <option value="BlueDart Air">BlueDart Air</option>
              <option value="Delhivery">Delhivery</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tracking / Order ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AMZ-9912-IN"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Arrival Gate
              </label>
              <select
                value={arrivalGate}
                onChange={e => setArrivalGate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Main Gate Central Vault">Main Gate</option>
                <option value="South Gate Counter">South Gate</option>
                <option value="Post Office Counter">Post Office</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Room No.
              </label>
              <input
                type="text"
                required
                value={room}
                onChange={e => setRoom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Peer Delivery Reward (₹)
            </label>
            <div className="flex items-center gap-2">
              {[15, 20, 25, 30, 50].map(amt => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setReward(amt)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    reward === amt
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              + Request Parcel Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
