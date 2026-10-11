'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Camera, Image, Upload, CheckCircle2, Loader2, X } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function UploadMenuPage() {
  const { canteens, selectedCanteenId, setSelectedCanteenId, scanMenuFromImage, isScanningMenu } = usePlexus();
  const activeCanteen = canteens.find(c => c.id === selectedCanteenId) || canteens[0];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadSuccess(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  const handleScanAndUpload = async () => {
    if (!selectedFile) return;
    await scanMenuFromImage(selectedFile.name);
    setUploadSuccess(true);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadSuccess(false);
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Hostel Services / Canteen / Upload Menu"
      title="Upload Canteen Menu Photograph"
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <div>
            <Link href="/canteen" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 mb-1">
              ← Canteen Dashboard
            </Link>
            <h2 className="text-2xl font-black text-slate-900">Upload Canteen Menu Photograph</h2>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-xl shrink-0">
              📸
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <span>📷</span> Upload Physical Canteen Menu Photograph
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Select or capture a photo of the physical canteen menu board from your phone or device. Our AI vision system will automatically store the image and extract food names and prices!
              </p>
              <p className="text-[11px] text-amber-600 font-semibold mt-2">
                * Notice: Max file size: 10 MB. Supported formats: JPEG, PNG, WebP
              </p>
            </div>
          </div>
        </div>

        {/* Main Upload Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900">Step 1: Select Canteen &amp; Upload Image File</h3>
            <span className="text-xs font-bold text-slate-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              ☕ {activeCanteen.name}
            </span>
          </div>

          {/* Canteen Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">1. Target Campus Canteen *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {canteens.map(cant => (
                <button
                  key={cant.id}
                  onClick={() => setSelectedCanteenId(cant.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all cursor-pointer text-xs font-semibold ${
                    cant.id === selectedCanteenId
                      ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300/30 text-amber-800'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-base">{cant.icon}</span>
                  <span>{cant.name} — ({cant.location})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">2. Choose or Capture Menu Photograph *</label>

            {!selectedFile ? (
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                  isDragging
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                      <Image className="w-7 h-7 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">Click to select photo or drag and drop image here</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">Supports JPEG, JPG, PNG, and WebP up to 10 MB</p>
                  </div>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <Image className="w-3.5 h-3.5" />
                      Select from Gallery / Files
                    </button>
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Take Photo (Camera)
                    </button>
                  </div>
                </div>

                {/* Hidden file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={e => handleFileChange(e.target.files?.[0] ?? null)}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={e => handleFileChange(e.target.files?.[0] ?? null)}
                />
              </div>
            ) : (
              /* Preview Area */
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl!}
                    alt="Selected menu"
                    className="w-full max-h-72 object-cover"
                  />
                  <button
                    onClick={handleClear}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-sm flex items-center justify-center text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {activeCanteen.name}
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer transition-all"
                  >
                    Change File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload / Scan Button */}
        {selectedFile && !uploadSuccess && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-black text-base text-slate-900">Step 2: AI Extract &amp; Upload Menu</h3>
            <p className="text-xs text-slate-500 font-medium">
              Our OCR AI Model v2.4 will scan the photo and automatically extract food item names and prices from the menu board.
            </p>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-200">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="text-xs font-bold text-purple-900">AI Vision OCR Processing</p>
                <p className="text-[11px] text-purple-600 font-medium">Will extract food names, prices and availability automatically.</p>
              </div>
            </div>

            <button
              onClick={handleScanAndUpload}
              disabled={isScanningMenu}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold text-sm rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isScanningMenu ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI Scanning &amp; Extracting Menu...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload &amp; AI Extract Menu Items
                </>
              )}
            </button>
          </div>
        )}

        {/* Success State */}
        {uploadSuccess && (
          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-black text-base text-emerald-900">Menu Successfully Uploaded &amp; Extracted!</h3>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  AI OCR Model v2.4 successfully processed the menu for {activeCanteen.name}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/canteen/menu"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                View Updated Digital Menu →
              </Link>
              <button
                onClick={handleClear}
                className="px-5 py-2.5 border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Upload Another Photo
              </button>
            </div>
          </div>
        )}

        {/* Past Upload History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">RECENT MENU UPLOADS FOR {activeCanteen.name.toUpperCase()}</h3>

          <div className="space-y-2">
            {[
              { by: activeCanteen.uploadedBy, time: activeCanteen.lastUploaded, items: 4, status: 'Published' },
            ].map((upload, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">Menu Photo Upload</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    By {upload.by} • {upload.time} • {upload.items} items extracted
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  ✓ {upload.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
