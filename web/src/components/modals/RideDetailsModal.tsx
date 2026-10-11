import React, { useState } from 'react';
import { X, Send, Star, ShieldCheck } from 'lucide-react';
import { CarpoolRide } from '@/contexts/PlexusContext';

interface RideDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: CarpoolRide | null;
}

export function RideDetailsModal({ isOpen, onClose, ride }: RideDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'reviews'>('overview');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('5');
  const [feedback, setFeedback] = useState('');

  if (!isOpen || !ride) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Mock send
    setMessage('');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit
    setRating('5');
    setFeedback('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] border border-slate-700 shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden flex flex-col text-slate-200">
        
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-start justify-between relative overflow-hidden text-white">
          <div className="relative z-10">
            <h2 className="text-xl font-bold tracking-tight">Ride Details</h2>
            <p className="text-blue-100 text-sm font-medium mt-0.5">
              {ride.origin} → {ride.destination}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-700 bg-[#252525]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'messages'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            In-App Messages
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            Reviews &amp; Feedback
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-[400px] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="bg-[#2a2a2a] rounded-xl p-4 flex items-center justify-between border border-slate-700/50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Date</p>
                  <p className="font-bold text-sm text-slate-200">{ride.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Time</p>
                  <p className="font-bold text-sm text-slate-200">{ride.time}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Vehicle</p>
                  <p className="font-bold text-sm text-slate-200">{ride.vehicleType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Price</p>
                  <p className="font-bold text-sm text-purple-400">₹{ride.pricePerSeat}</p>
                </div>
              </div>

              {/* Driver Info */}
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-3">Driver Information</h4>
                <div className="bg-[#2a2a2a] rounded-xl p-4 flex items-center justify-between border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                      {ride.driverName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-200">{ride.driverName}</p>
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Verified {ride.driverRole === 'Admin' ? 'Admin' : 'Student'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">{ride.driverName.split(' ')[0].toLowerCase()}@amrita.edu</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seat Status */}
              <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                <h4 className="text-sm font-bold text-slate-200">Seat Status: <span className="text-slate-400 font-medium">{ride.availableSeats} / {ride.totalSeats} Available</span></h4>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${ride.availableSeats > 0 ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-red-900/30 text-red-400 border-red-800'}`}>
                  {ride.availableSeats > 0 ? 'Available' : 'Full'}
                </span>
              </div>

              {/* Passengers & Requests */}
              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-sm font-bold text-slate-200 mb-1">Passengers &amp; Requests (0)</h4>
                <p className="text-xs text-slate-400 italic">No bookings or requests yet.</p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="flex flex-col h-full relative">
              <div className="flex-1 flex items-center justify-center text-sm text-slate-500 italic border border-slate-700/50 rounded-xl bg-[#2a2a2a] mb-4">
                No messages yet. Send a message to coordinate!
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#2a2a2a] border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-2">Participant Ratings</h4>
                <p className="text-xs text-slate-400 italic">No reviews submitted for this ride yet.</p>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-sm font-bold text-slate-200 mb-4">Leave a Rating &amp; Feedback</h4>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">Rating (1 to 5 stars)</label>
                    <select
                      value={rating}
                      onChange={e => setRating(e.target.value)}
                      className="w-full bg-[#2a2a2a] border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="5">★★★★★ (5 - Excellent)</option>
                      <option value="4">★★★★☆ (4 - Good)</option>
                      <option value="3">★★★☆☆ (3 - Average)</option>
                      <option value="2">★★☆☆☆ (2 - Poor)</option>
                      <option value="1">★☆☆☆☆ (1 - Terrible)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">Written Feedback (Optional)</label>
                    <textarea
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder="Punctual driver, smooth ride..."
                      rows={3}
                      className="w-full bg-[#2a2a2a] border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 placeholder-slate-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
