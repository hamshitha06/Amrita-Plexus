'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { ArrowLeft, Upload, CheckCircle2, ShieldCheck, Plus, X, Lock, AlertCircle } from 'lucide-react';

export default function ReportFoundItemPage() {
  const router = useRouter();
  const { reportFoundItem } = usePlexus();

  const [category, setCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [foundLocation, setFoundLocation] = useState('');
  const [dateFound, setDateFound] = useState('');
  const [timeFound, setTimeFound] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [privateCharacteristics, setPrivateCharacteristics] = useState('');
  const [custodyLocation, setCustodyLocation] = useState('');
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
    if (!category || !itemName || !description || !foundLocation || !dateFound || !privateCharacteristics || !custodyLocation) {
      alert('Please complete all mandatory fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      reportFoundItem({
        category,
        itemName,
        description,
        foundLocation,
        dateFound,
        timeFound: timeFound || undefined,
        photoUrl: photoUrl || undefined,
        privateCharacteristics,
        custodyLocation,
      });
      setIsSubmitting(false);
      router.push('/lost-found');
    }, 400);
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Lost & Found / Report Found Item"
      title="Report Found Belonging"
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Found Item Registration
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>➕</span> Report a Found Item
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Register an item found on campus. High-value electronics (L3), sensitive IDs (L4), or jewellery (L5) require security desk deposit instructions.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/lost-found"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>Back to Catalog</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">1. Found Item Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
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
                    Item Title / Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                    placeholder="e.g. Casio Calculator, iPhone 14, Milton Water Bottle..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Public Item Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide safe public details (e.g. Black Casio calculator left in AB-204 desk). Do NOT write serial numbers here!"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Found Location & Time */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">2. Found Location &amp; Time</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Exact Campus Found Location <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={foundLocation}
                    onChange={e => setFoundLocation(e.target.value)}
                    placeholder="e.g. Academic Block 2 (Room AB-204), Student Canteen"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Date Found <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dateFound}
                    onChange={e => setDateFound(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Time Found <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="time"
                    value={timeFound}
                    onChange={e => setTimeFound(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Direct Device Photo Upload */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">3. Item Photograph (Direct Local Upload)</h3>
              <p className="text-xs text-slate-500">
                Upload a clear photo of the found item from your device. For Level 5 jewellery, photos are kept confidential automatically.
              </p>

              <div>
                {photoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 w-full">
                    <img src={photoUrl} alt="Found Item Preview" className="w-full h-48 object-cover" />
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

            {/* Private distinguishing characteristics */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">4. Private Distinguishing Characteristics (Confidential)</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Describe unique internal features, serial numbers, wallpapers, markings, or engravings used ONLY by administrators to verify claimant answers.
              </p>

              <textarea
                required
                rows={3}
                value={privateCharacteristics}
                onChange={e => setPrivateCharacteristics(e.target.value)}
                placeholder="e.g. Has black marker writing on battery door, IMEI ends in 8842, lock screen is space shuttle..."
                className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl p-4 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Custody Location */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">5. Current Custody Information</h3>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Current Custody / Deposit Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={custodyLocation}
                  onChange={e => setCustodyLocation(e.target.value)}
                  placeholder="e.g. With Finder (Hostel A, Room 201), Deposited at Main Security Gate..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>

              {/* Security notice for high risk items */}
              <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-indigo-900 font-medium">
                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Security Protocol Notice:</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed">
                    Valuable electronics (L3), sensitive IDs (L4), and jewellery (L5) must be handed over to authorized Campus Security at Main Gate for safe vault storage.
                  </p>
                </div>
              </div>
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
                className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Publish Found Listing
              </button>
            </div>

          </form>
        </div>

      </div>
    </AppLayout>
  );
}
