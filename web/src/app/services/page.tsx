'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, ClipboardCheck, Settings, Star, Clock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function ServicesDirectoryPage() {
  const { campusServices, bookService } = usePlexus();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
    'Academic Tutoring',
    'Extracurricular & Skill Tutoring',
    'Technical Assistance',
    'Electrical Repair',
    'Maintenance',
    'Student Businesses',
    'Other Services'
  ];

  const filteredServices = campusServices.filter(s => {
    const matchCat = category === 'All' || s.category === category;
    const matchSearch = !search.trim() || 
      s.title.toLowerCase().includes(search.toLowerCase()) || 
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AppLayout
      breadcrumb="Student Portal / Services & Skills"
      title="Services & Skills Directory"
    >
      <div className="space-y-6">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-3xl p-6 md:p-10 shadow-sm text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="text-[10px] font-bold tracking-wider uppercase text-blue-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-300"></span>
              Module 6.8 • Student-to-Student Campus Services
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Discover Campus Services &amp; Skills
            </h1>
            <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-xl">
              Connect with fellow Amrita students for academic tutoring, guitar &amp; skill lessons, tech repair, campus businesses, and everyday assistance.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link href="/services/offer" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Offer Your Skill / Service
              </Link>
              <Link href="/services/my-requests" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4" /> Track My Requests
              </Link>
              <Link href="/services/manage" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5">
                <Settings className="w-4 h-4" /> Provider Console
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 md:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input 
                type="text" 
                placeholder="Search by topic, skill (e.g. DSA, Python, OS Format, Guitar, Merch)..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pricing:</span>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none">
                <option>All Pricing Types</option>
                <option>Hourly</option>
                <option>Fixed</option>
                <option>Negotiable</option>
              </select>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                    category === cat 
                      ? 'bg-slate-800 text-white border-slate-800' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'All' ? '✨ ' : ''}{cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-4">
          <h3 className="font-black text-slate-900 text-lg">All Available Services ({filteredServices.length})</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredServices.map(service => (
              <div key={service.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs hover:shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between space-y-4">
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="inline-block bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {service.category}
                    </span>
                    <div className="text-right">
                      <p className="font-black text-lg leading-none text-slate-900">₹{service.price}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{service.pricingModel}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-black text-base text-slate-900 leading-tight mb-1.5">{service.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                        {service.providerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{service.providerName}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{service.providerHostel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded text-[10px] font-bold text-amber-700">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {service.rating.toFixed(1)} ({service.reviewsCount})
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 max-w-[140px] truncate">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{service.availability || 'Schedule flexible'}</span>
                    </div>
                    
                    <button
                      onClick={() => bookService(service.id, 'I need this service ASAP.', '2026-10-20')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      View &amp; Request →
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
