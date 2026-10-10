'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { ArrowLeft, Upload, CheckCircle2, ShieldCheck, FileQuestion, X, Lock } from 'lucide-react';

export default function ReportLostItemPage() {
  const router = useRouter();
  const { reportLostItem } = usePlexus();

  const [category, setCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [dateLost, setDateLost] = useState('');
  const [timeLost, setTimeLost] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [privateFeatures, setPrivateFeatures] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !itemName || !description || !lastSeenLocation || !dateLost || !privateFeatures) {
      alert('Please complete all mandatory fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      reportLostItem({
        category,
        itemName,
        description,
        lastSeenLocation,
        dateLost,
        timeLost: timeLost || undefined,
        photoUrl: photoUrl || undefined,
        privateFeatures,
        additionalInfo: additionalInfo || undefined,
      });
      setIsSubmitting(false);
      router.push('/lost-found/my-items');
    }, 400);
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Lost & Found / Report Lost Item"
      title="Report Lost Belonging"
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                Loss Incident Reporting
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>🔍</span> Report a Lost Belonging
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Submit a loss report with confidential distinguishing features. Our intelligent engine will automatically search for matches against campus found listings.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/lost-found"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>Back to Overview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">1. Item Basic Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white transition-all"
                  >
                    <option value="">-- Select Category --</option>
                    <option>Everyday Belongings</option>
                    <option>Personal Belongings</option>
                    <option>Valuable Electronics</option>
                    <option>Sensitive Items</option>
                    <option>High-Value &amp; Jewellery</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Item Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                    placeholder="e.g. Milton 750ml Water Bottle, Casio fx-991EX, iPhone 14 Pro..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  General Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide general appearance, color, brand, or main characteristics visible publicly..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Location & Time */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">2. Loss Location &amp; Proximity</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Last Seen Location <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastSeenLocation}
                    onChange={e => setLastSeenLocation(e.target.value)}
                    placeholder="e.g. Academic Block 2, Room AB-204"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Approximate Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dateLost}
                    onChange={e => setDateLost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Approximate Time <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="time"
                    value={timeLost}
                    onChange={e => setTimeLost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Direct Device Photo Upload */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">3. Item Photograph (Direct Local Upload)</h3>
              <p className="text-xs text-slate-500">
                Upload a photograph of your lost belonging directly from your device storage (Max 5MB).
              </p>

              <div>
                {photoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 w-full">
                    <img src={photoUrl} alt="Lost Item Preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-3 right-3 bg-slate-900/80 text-white p-2 rounded-full hover:bg-slate-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">Click to Select Image from Local Device Storage</span>
                    <span className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WEBP (Max 5MB)</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Private Identifying Details */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">4. Private Distinguishing Features (Confidential)</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter secret identifying details (e.g. Serial/IMEI, unique scratches, roll numbers on back, custom stickers, or lock-screen text). These are NEVER shown publicly and are used strictly for ownership verification.
              </p>

              <textarea
                required
                rows={3}
                value={privateFeatures}
                onChange={e => setPrivateFeatures(e.target.value)}
                placeholder="e.g. Roll number CB.EN.U4CSE21045 written on back in marker, sticker of anime character on cover..."
                className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl p-4 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Additional info */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Additional Comments or Notes <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={additionalInfo}
                onChange={e => setAdditionalInfo(e.target.value)}
                placeholder="e.g. Might have dropped near the library bench or canteen area..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white transition-all"
              />
            </div>

            {/* Form Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Link
                href="/lost-found"
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit Report &amp; Start Matching Engine
              </button>
            </div>

          </form>
        </div>

      </div>
    </AppLayout>
  );
}
