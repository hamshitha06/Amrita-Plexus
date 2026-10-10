'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, Plus, Star, Users, Briefcase, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function ProviderManagementPage() {
  const { userName, campusServices, serviceRequests } = usePlexus();
  
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed'];

  // Stats
  const myServices = campusServices.filter(s => s.providerName === userName);
  const myIncomingRequests = serviceRequests.filter(req => 
    myServices.some(s => s.title === req.serviceTitle)
  );

  const pendingCount = myIncomingRequests.filter(r => r.status === 'Pending').length;
  const filteredRequests = myIncomingRequests.filter(req => filter === 'All' || req.status === filter);

  // Compute average rating from my services
  const totalRating = myServices.reduce((sum, s) => sum + s.rating, 0);
  const totalReviews = myServices.reduce((sum, s) => sum + s.reviewsCount, 0);
  const avgRating = myServices.length > 0 ? (totalRating / myServices.length).toFixed(1) : '0.0';

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
                <div key={req.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{req.serviceTitle}</h4>
                    <p className="text-xs text-slate-500">From: {req.providerName} • Status: {req.status}</p>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-800">
                    Manage →
                  </button>
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
    </AppLayout>
  );
}
