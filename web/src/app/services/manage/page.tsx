'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, Plus, Star, Users, Briefcase, ChevronRight, X, Clock, MapPin, Phone, User, Calendar, CheckCircle2, XCircle, Play } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus, ServiceRequest } from '@/contexts/PlexusContext';

export default function ProviderManagementPage() {
  const { userName, campusServices, serviceRequests, updateServiceRequestStatus } = usePlexus();
  
  const [filter, setFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const filters = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];

  // Stats
  const myServices = campusServices.filter(s => s.providerName === userName);
  const myIncomingRequests = serviceRequests.filter(req => 
    myServices.some(s => s.title === req.serviceTitle) || req.providerName === userName
  );

  const pendingCount = myIncomingRequests.filter(r => r.status === 'Pending').length;
  const filteredRequests = myIncomingRequests.filter(req => filter === 'All' || req.status === filter);

  // Compute average rating from my services
  const totalRating = myServices.reduce((sum, s) => sum + s.rating, 0);
  const totalReviews = myServices.reduce((sum, s) => sum + s.reviewsCount, 0);
  const avgRating = myServices.length > 0 ? (totalRating / myServices.length).toFixed(1) : '0.0';

  const handleUpdateStatus = async (
    newStatus: 'Accepted' | 'In Progress' | 'Completed' | 'Rejected' | 'Cancelled'
  ) => {
    if (!selectedRequest) return;
    setUpdatingStatus(true);
    await updateServiceRequestStatus(selectedRequest.id, newStatus, adminNotes);
    setUpdatingStatus(false);
    setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Services & Skills / Provider Console"
      title="Provider Dashboard & Requests"
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Settings className="w-3 h-3" /> Provider Management Console
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Provider Dashboard &amp; Requests</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Manage your published service offers, respond to incoming student requests, and fulfill bookings.
            </p>
          </div>
          <Link 
            href="/services/offer"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Create Another Listing
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Average Rating</p>
            <div className="flex items-baseline gap-2">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span className="text-2xl font-black text-slate-900">{avgRating}</span>
              <span className="text-xs font-medium text-slate-500">({totalReviews} reviews)</span>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Incoming Requests</p>
            <div className="flex items-baseline gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-black text-slate-900">{myIncomingRequests.length}</span>
              <span className="text-xs font-medium text-amber-600">({pendingCount} pending)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Active Services Offered</p>
            <div className="flex items-baseline gap-2">
              <Briefcase className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-black text-purple-600">{myServices.length}</span>
            </div>
          </div>
        </div>

        {/* Incoming Student Requests Section */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                📥 Incoming Student Requests ({myIncomingRequests.length})
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Accept, start work on, and complete service requests from student clients.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                    filter === f 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-slate-900">No incoming requests in this view.</p>
              <p className="text-xs text-slate-500 font-medium mt-1">When students submit requests for your listings, they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map(req => (
                <div key={req.id} className="border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{req.serviceTitle}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        req.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        req.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        req.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      From: <strong className="text-slate-800">{req.requesterName || 'Student Client'}</strong> • {req.requesterHostel || 'Campus'} • Requested: {req.requestedAt}
                    </p>
                    {req.customerNotes && (
                      <p className="text-xs text-slate-600 italic line-clamp-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        "{req.customerNotes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-slate-900">
                      ₹{req.price} <span className="text-[10px] text-slate-400 font-normal">({req.pricingModel})</span>
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedRequest(req);
                        setAdminNotes('');
                      }}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                    >
                      Manage <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Published Service Listings Section */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="text-lg font-black text-slate-900">
            My Published Service Listings ({myServices.length})
          </h3>
          
          {myServices.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-sm text-slate-500 font-medium">You haven't published any services yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myServices.map(service => (
                <div key={service.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="inline-block bg-purple-100 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded-md mb-2">
                        {service.category}
                      </span>
                      <span className="font-black text-sm text-slate-900">₹{service.price}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">{service.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2">{service.description}</p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-[10px] font-bold text-amber-700">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {service.rating} ({service.reviewsCount})
                    </div>
                    <button className="flex items-center text-[10px] font-bold text-slate-600 hover:text-blue-600">
                      Edit Listing <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Manage Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Manage Service Booking</div>
                <h3 className="font-black text-slate-900 text-base leading-tight mt-0.5">{selectedRequest.serviceTitle}</h3>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Status Header */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-medium text-slate-600">Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  selectedRequest.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  selectedRequest.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  selectedRequest.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  selectedRequest.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {selectedRequest.status}
                </span>
              </div>

              {/* Client Info Card */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Student Client Details</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    {selectedRequest.requesterName || 'Student Client'}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {selectedRequest.requesterHostel || 'Campus Hostel'}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold col-span-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    {selectedRequest.requesterPhone || '+91 98765 43211'}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Agreed Rate:</span>
                  <span className="font-black text-slate-900">₹{selectedRequest.price} ({selectedRequest.pricingModel})</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-700 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Scheduled for: <strong>{selectedRequest.appointmentDate}</strong></span>
                </div>
              </div>

              {/* Client Notes */}
              {selectedRequest.customerNotes && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Client Requirements &amp; Notes</label>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-700 font-medium italic">
                    "{selectedRequest.customerNotes}"
                  </div>
                </div>
              )}

              {/* Optional Progress Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Add Provider Update Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g., Confirmed room visit at 4:30 PM, equipment ready..."
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              {/* Status Action Workflow Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Workflow Actions</div>
                
                {selectedRequest.status === 'Pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus('Accepted')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Request
                    </button>
                    <button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus('Rejected')}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                  </div>
                )}

                {selectedRequest.status === 'Accepted' && (
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus('In Progress')}
                    className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4" /> Start Work (Mark In Progress)
                  </button>
                )}

                {selectedRequest.status === 'In Progress' && (
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus('Completed')}
                    className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Service as Completed
                  </button>
                )}

                {selectedRequest.status === 'Completed' && (
                  <div className="text-center p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-100">
                    🎉 Service successfully fulfilled and completed!
                  </div>
                )}

                {selectedRequest.status === 'Cancelled' && (
                  <div className="text-center p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-bold border border-rose-100">
                    ⚠️ This request was cancelled by the student client.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
