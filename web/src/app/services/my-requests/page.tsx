'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, MapPin, Phone, Calendar, Star, FileText, AlertTriangle, X } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus, ServiceRequest } from '@/contexts/PlexusContext';

export default function MyServiceRequestsPage() {
  const { serviceRequests, cancelServiceRequest } = usePlexus();
  const [filter, setFilter] = useState('All');
  const [cancellingRequest, setCancellingRequest] = useState<ServiceRequest | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const filters = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];

  const filteredRequests = serviceRequests.filter(req => filter === 'All' || req.status === filter);

  const handleConfirmCancel = async () => {
    if (!cancellingRequest) return;
    setIsSubmittingCancel(true);
    await cancelServiceRequest(cancellingRequest.id, cancellationReason);
    setIsSubmittingCancel(false);
    setCancellingRequest(null);
    setCancellationReason('');
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Services & Skills / My Service Requests"
      title="My Service Requests"
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <FileText className="w-3 h-3" /> Student Requests Queue
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Service Requests</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Track request statuses, appointment schedules, provider notes, and cancel or review bookings.
            </p>
          </div>
          <Link 
            href="/services"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Find More Services
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                filter === f 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map(req => (
            <div key={req.id} className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
              
              {/* Header */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-extrabold text-slate-900">{req.requestNumber}</span>
                  <span className="text-slate-400 font-medium">Requested on {req.requestedAt}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  req.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  req.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  req.status === 'Rejected' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  Status: {req.status}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left side: Request Details */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-xl font-black text-slate-900">{req.serviceTitle}</h3>
                  
                  {req.customerNotes && (
                    <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-700 font-medium italic border border-slate-100">
                      "{req.customerNotes}"
                    </div>
                  )}

                  {req.cancellationReason && (
                    <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3 text-xs text-rose-800 font-medium">
                      <span className="font-bold">Cancellation Reason:</span> {req.cancellationReason}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 pt-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {req.providerHostel || 'Campus'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      {req.providerPhone || '+91 98765 43210'}
                    </div>
                  </div>
                </div>

                {/* Right side: Provider Details */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Service Provider</p>
                    <p className="font-bold text-sm text-slate-900">{req.providerName}</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight">{req.providerHostel}</p>
                    <p className="text-[11px] font-semibold text-blue-600 mt-1">{req.providerPhone}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Scheduled Appointment</p>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {req.appointmentDate}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Timezone: Asia/Kolkata</p>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs font-medium text-slate-500">
                  Rate: <span className="font-bold text-slate-900">₹{req.price}</span> ({req.pricingModel})
                </div>
                
                {req.status === 'Completed' ? (
                  req.reviewedScore ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-100">
                      Reviewed: <Star className="w-3 h-3 fill-emerald-500" /> {req.reviewedScore}
                    </div>
                  ) : (
                    <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs">
                      Leave Review
                    </button>
                  )
                ) : req.status === 'Cancelled' ? (
                  <span className="text-xs font-bold text-rose-600 px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-100">
                    Request Cancelled
                  </span>
                ) : req.status === 'Rejected' ? (
                  <span className="text-xs font-bold text-slate-500 px-3 py-1.5 bg-slate-100 rounded-lg">
                    Provider Declined
                  </span>
                ) : (
                  <button 
                    onClick={() => {
                      setCancellingRequest(req);
                      setCancellationReason('');
                    }}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-lg text-xs font-bold transition-all shadow-2xs"
                  >
                    Cancel Request
                  </button>
                )}
              </div>

            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl">
              <p className="text-slate-500 font-medium text-sm">No requests found for this filter.</p>
            </div>
          )}
        </div>

      </div>

      {/* Cancel Confirmation Modal */}
      {cancellingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 text-base">Cancel Service Request</h3>
              </div>
              <button 
                onClick={() => setCancellingRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600">
                Are you sure you want to cancel your request for <strong className="text-slate-900">{cancellingRequest.serviceTitle}</strong>? The provider will be notified.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g., Schedule conflict, resolved independently..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancellingRequest(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-all"
              >
                Keep Request
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isSubmittingCancel}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl transition-all shadow-xs"
              >
                {isSubmittingCancel ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
