'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { User, Phone, Mail, Home, ShieldCheck, CheckCircle2, Building, Hash, GraduationCap } from 'lucide-react';

export default function ProfileOnboardingPage() {
  const router = useRouter();
  const { 
    userName, userRollNumber, userBranchYear, userEmail, userPhone, 
    userHostel, userRoom, userEmergencyContact, updateUserProfile 
  } = usePlexus();

  const [name, setName] = useState(userName);
  const [rollNumber, setRollNumber] = useState(userRollNumber);
  const [branchYear, setBranchYear] = useState(userBranchYear);
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState(userPhone);
  const [hostel, setHostel] = useState(userHostel);
  const [room, setRoom] = useState(userRoom);
  const [emergencyContact, setEmergencyContact] = useState(userEmergencyContact);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rollNumber || !branchYear || !email || !phone || !hostel || !room) {
      alert('Please fill out all mandatory profile fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      updateUserProfile({
        userName: name,
        userRollNumber: rollNumber,
        userBranchYear: branchYear,
        userEmail: email,
        userPhone: phone,
        userHostel: hostel,
        userRoom: room,
        userEmergencyContact: emergencyContact,
      });
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 400);
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Account Setup"
      title="Complete Your Student Profile"
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                👤 Student Account Registration
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>📝</span> Personal Details Setup
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Please complete your personal details, contact info, and hostel location. These details enable verified peer parcel deliveries, ride sharing, and food requests.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 1. Academic & Identification */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                1. Academic &amp; Student Identification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Full Student Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    College Roll Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    placeholder="e.g. CB.EN.U4CSE23101"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Academic Branch &amp; Year <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={branchYear}
                    onChange={e => setBranchYear(e.target.value)}
                    placeholder="e.g. 3rd Yr CSE"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Verified College Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. alex.rivera@amrita.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Contact & Hostel Location */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                2. Contact Information &amp; Hostel Residence
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Emergency Contact Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={e => setEmergencyContact(e.target.value)}
                    placeholder="e.g. +91 98765 12345"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Hostel Name / Block <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={hostel}
                    onChange={e => setHostel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                  >
                    <option value="">-- Select Hostel Block --</option>
                    <option>Gargi Hostel (Block A)</option>
                    <option>Gargi Hostel (Block B)</option>
                    <option>Vasishta Hostel (Block 1)</option>
                    <option>Vasishta Hostel (Block 2)</option>
                    <option>Agastya Hostel (Block 3)</option>
                    <option>Day Scholar / Off-Campus</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Hostel Room Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    placeholder="e.g. Room A-201"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Details &amp; Launch Dashboard
              </button>
            </div>

          </form>
        </div>

      </div>
    </AppLayout>
  );
}
