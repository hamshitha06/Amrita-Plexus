'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function OfferServicePage() {
  const router = useRouter();
  const { publishService } = usePlexus();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic Tutoring');
  const [pricingModel, setPricingModel] = useState<'Hourly' | 'Fixed' | 'Negotiable'>('Hourly');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description) return;
    
    publishService({
      title,
      category,
      pricingModel,
      price: parseInt(price, 10),
      description,
      availability,
    });
    router.push('/services');
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Services & Skills / Offer a Service"
      title="Offer a Service"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <Link href="/services" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 mb-2 inline-block uppercase tracking-wider">
            ← Back to Services Directory
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Offer a Campus Service &amp; Skill</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Share your academic knowledge, tutoring, technical skills, or student business with fellow Amrita students
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-2xs space-y-8">
          
          {/* Step 1 Profile Readonly */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                Step 1: Your Student Provider Profile
                <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">✓ Active Profile</span>
              </h3>
              <span className="text-xs text-slate-500">Logged in as: <span className="font-bold text-slate-800">Sneha Patel (Student B)</span></span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Bio &amp; Introduction *</label>
                <div className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 h-16">
                  ECE 3rd Year student. Expert in OS formatting, software troubleshooting, and basic electrical repairs.
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Skills &amp; Subject Areas *</label>
                <div className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700">
                  Windows/Linux OS, Hardware Diagnostics, WiFi Troubleshoot
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Phone *</label>
                <div className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700">
                  +91 98765 43211
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Step 2: Create Service Listing</h3>
              <p className="text-xs text-slate-400 font-medium">Publish a service offer that other students can discover and request.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Service Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Data Structures 1-on-1 Tutoring / Acoustic Guitar Lessons for Beginners" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Service Category <span className="text-red-500">*</span></label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Academic Tutoring</option>
                    <option>Extracurricular &amp; Skill Tutoring</option>
                    <option>Technical Assistance</option>
                    <option>Electrical Repair</option>
                    <option>Maintenance</option>
                    <option>Student Businesses</option>
                    <option>Other Services</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Pricing Model <span className="text-red-500">*</span></label>
                  <select 
                    value={pricingModel}
                    onChange={e => setPricingModel(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hourly">Hourly Rate (₹/hour)</option>
                    <option value="Fixed">Fixed Task Rate (₹)</option>
                    <option value="Negotiable">Negotiable (Base ₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Price Amount (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  required
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="150" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Full Description &amp; Deliverables <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail what you provide, learning topics covered, prerequisites, or tools supplied..." 
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Years of Experience</label>
                  <input 
                    type="text" 
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    placeholder="1.5" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Specific Availability</label>
                  <input 
                    type="text" 
                    value={availability}
                    onChange={e => setAvailability(e.target.value)}
                    placeholder="Mon, Wed, Fri (5:00 PM - 8:00 PM)" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition-all cursor-pointer">
              Publish Service Listing →
            </button>
          </form>

        </div>
      </div>
    </AppLayout>
  );
}
