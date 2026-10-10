'use client';

import React from 'react';
import Link from 'next/link';
import { 
  User, ShieldCheck, Star, Package, Utensils, Briefcase, ShoppingBag, 
  MapPin, Phone, Mail, GraduationCap, Edit, Clock, Award, ThumbsUp, ArrowLeft 
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function StudentProfilePage() {
  const { 
    userName, userRollNumber, userBranchYear, userEmail, userPhone, 
    userHostel, userRoom, userEmergencyContact, userRating, userRatingCount, 
    parcelDeliveryScore, foodDeliveryScore, servicesRating, marketplaceRating,
    parcels, foodRequests, marketplaceItems, campusServices 
  } = usePlexus();

  const myDeliveriesCount = parcels.filter(p => p.status === 'Delivered').length || 24;
  const myFoodDeliveriesCount = foodRequests.filter(f => f.status === 'Delivered').length || 12;

  // Mock student reviews
  const peerReviews = [
    {
      id: 'rev-1',
      reviewer: 'Rahul Sharma (4th Yr ECE)',
      category: '📦 Parcel Delivery',
      rating: 5.0,
      date: '08 Oct 2026',
      comment: 'Super fast delivery from Main Gate right to Room A-204! Very polite student.',
    },
    {
      id: 'rev-2',
      reviewer: 'Pooja K. (2nd Yr CSE)',
      category: '☕ Night Canteen Order',
      rating: 5.0,
      date: '05 Oct 2026',
      comment: 'Delivered hot cold coffee and rolls on time during late night exam study.',
    },
    {
      id: 'rev-3',
      reviewer: 'Vignesh R. (3rd Yr CCE)',
      category: '🛠️ DSA Tutoring Skill',
      rating: 5.0,
      date: '02 Oct 2026',
      comment: 'Helped me understand Graph Algorithms & Dynamic Programming in just 1 hour!',
    },
    {
      id: 'rev-4',
      reviewer: 'Ananya R. (3rd Yr ECE)',
      category: '🛒 Marketplace Sale',
      rating: 4.8,
      date: '28 Sep 2026',
      comment: 'Scientific calculator was in pristine condition as described. Smooth campus exchange.',
    }
  ];

  return (
    <AppLayout
      breadcrumb="Student Portal / Profile & Reputation Management"
      title="Student Profile & Peer Rating"
    >
      <div className="space-y-6">

        {/* Top Header Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-700 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {userName}
                  </h2>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-extrabold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Amrita Verified Student
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-bold">
                  {userBranchYear} • Roll No: {userRollNumber}
                </p>
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {userHostel}, {userRoom}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/onboarding"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs"
              >
                <Edit className="w-4 h-4 text-slate-500" />
                <span>Edit Profile Details</span>
              </Link>
            </div>

          </div>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN: Personal Details Card */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Personal &amp; Contact Details
              </h3>

              <div className="space-y-3 text-xs font-medium text-slate-600">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name:</span>
                  <span className="text-sm font-bold text-slate-900">{userName}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Roll Number:</span>
                  <span className="font-bold text-slate-800">{userRollNumber}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Branch &amp; Year:</span>
                  <span className="font-bold text-slate-800">{userBranchYear}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">College Email:</span>
                  <span className="font-bold text-blue-700">{userEmail}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobile Phone:</span>
                  <span className="font-bold text-slate-800">{userPhone}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hostel Residence:</span>
                  <span className="font-bold text-slate-800">{userHostel}, {userRoom}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Emergency Contact:</span>
                  <span className="font-bold text-slate-800">{userEmergencyContact}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/onboarding"
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" /> Update Personal Information
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Reserved Space for Peer Rating & Reputation Breakdown */}
          <div className="space-y-6 lg:col-span-2">

            {/* Overall Student Reputation Rating Card */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-2">
                    🌟 Student Trust &amp; Reputation Space
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    Peer Trust &amp; Performance Score
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    Calculated from verified peer reviews of deliveries, canteen service, tutoring, and marketplace transactions.
                  </p>
                </div>

                {/* Big Overall Score Badge */}
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center shrink-0 min-w-[140px]">
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-3xl">
                    <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
                    <span>{userRating}</span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-bold block mt-1">
                    out of 5.0 ({userRatingCount} ratings)
                  </span>
                </div>
              </div>

              {/* 4 Performance Breakdown Score Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Parcel Deliveries</span>
                  </div>
                  <div className="text-2xl font-black text-white">{parcelDeliveryScore}%</div>
                  <span className="text-[10px] text-slate-400 block">{myDeliveriesCount} Completed</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Food Deliveries</span>
                  </div>
                  <div className="text-2xl font-black text-white">{foodDeliveryScore}%</div>
                  <span className="text-[10px] text-slate-400 block">100% On-Time</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Skill Services</span>
                  </div>
                  <div className="text-2xl font-black text-white">{servicesRating} ★</div>
                  <span className="text-[10px] text-slate-400 block">8 Tutoring Reviews</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Marketplace</span>
                  </div>
                  <div className="text-2xl font-black text-white">{marketplaceRating} ★</div>
                  <span className="text-[10px] text-slate-400 block">6 Items Sold</span>
                </div>

              </div>

            </div>

            {/* Recent Verified Student Peer Reviews */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Recent Peer Feedback Reviews</h3>
                  <p className="text-xs text-slate-500 font-medium">Ratings left by campus peers after completed services &amp; deliveries</p>
                </div>
                <span className="text-xs font-bold text-slate-500">{peerReviews.length} Verified Reviews</span>
              </div>

              <div className="space-y-3">
                {peerReviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.reviewer}</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-extrabold">
                          {rev.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="text-[10px] text-slate-400 font-semibold text-right">
                      Reviewed on {rev.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}
