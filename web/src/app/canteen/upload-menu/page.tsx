'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Camera, Image, Upload, CheckCircle2, Loader2, X, AlertTriangle, ArrowLeft } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { extractMenuFromImage, OcrProgressUpdate, OcrExtractionResult } from '@/lib/ocr-service';
import { DigitalMenuEditor } from '@/components/canteen/DigitalMenuEditor';
import { ParsedMenuItem } from '@/lib/menu-parser';

export default function UploadMenuPage() {
  const { canteens, selectedCanteenId, setSelectedCanteenId, publishDigitalMenu } = usePlexus();
  const activeCanteen = canteens.find(c => c.id === selectedCanteenId) || canteens[0];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // OCR state
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState<OcrProgressUpdate | null>(null);
  const [extractionResult, setExtractionResult] = useState<OcrExtractionResult | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setExtractionResult(null);
    setOcrError(null);
    setPublishSuccess(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  const handleRunOcr = async () => {
    if (!selectedFile) return;
    setIsExtracting(true);
    setOcrError(null);

    try {
      const result = await extractMenuFromImage(selectedFile, update => {
        setProgress(update);
      });
      setExtractionResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tesseract OCR encountered an error extracting text.';
      setOcrError(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePublishMenu = async (items: ParsedMenuItem[]) => {
    setIsPublishing(true);
    try {
      const ok = await publishDigitalMenu(
        activeCanteen.id,
        activeCanteen.name,
        items,
        extractionResult?.rawText,
        selectedFile ? selectedFile.name : 'canteen-menu.jpg'
      );
      if (ok) {
        setPublishSuccess(true);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractionResult(null);
    setOcrError(null);
    setProgress(null);
    setPublishSuccess(false);
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
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Canteen
            </Link>
            <h2 className="text-2xl font-black text-slate-900">Upload Canteen Menu Photograph</h2>
            <p className="text-xs text-slate-400 font-medium">
              Tesseract.js OCR extraction · Review dish titles and rupee prices · Publish to campus
            </p>
          </div>
        </div>

        {/* Success View */}
        {publishSuccess ? (
          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-black text-lg text-emerald-900">Menu Successfully Verified &amp; Published!</h3>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  The verified digital menu for <span className="font-bold">{activeCanteen.name}</span> has been stored in the database. All students can now view the latest items and place orders!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/canteen/menu"
                className="flex items-center gap-1.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                View Live Published Menu →
              </Link>
              <button
                type="button"
                onClick={handleClear}
                className="px-5 py-3 border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Upload Another Menu
              </button>
            </div>
          </div>
        ) : extractionResult ? (
          /* Step 3: Interactive Review & Digital Table Editor */
          <div className="space-y-4">
            <DigitalMenuEditor
              canteenName={activeCanteen.name}
              canteenId={activeCanteen.id}
              imagePreviewUrl={previewUrl!}
              initialItems={extractionResult.parsedResult.items}
              rawOcrText={extractionResult.rawText}
              unparsedLines={extractionResult.parsedResult.unparsedLines}
              totalRecognizedLines={extractionResult.parsedResult.totalRecognizedLines}
              recallMetrics={extractionResult.parsedResult.recallMetrics}
              onPublish={handlePublishMenu}
              onReset={handleClear}
              isPublishing={isPublishing}
            />
          </div>
        ) : (
          /* Step 1 & 2: Select Canteen & Upload Image */
          <div className="space-y-6">
            {/* Canteen Selector Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-slate-900">Step 1: Select Target Campus Canteen *</h3>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  Current: {activeCanteen.name}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {canteens.map(cant => (
                  <button
                    key={cant.id}
                    type="button"
                    onClick={() => setSelectedCanteenId(cant.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer text-xs font-semibold ${
                      cant.id === selectedCanteenId
                        ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300/30 text-amber-900'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{cant.icon}</span>
                    <div>
                      <p className="font-black text-slate-900">{cant.name}</p>
                      <p className="text-[11px] text-slate-400">{cant.location}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Selection / Dropzone */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="font-black text-base text-slate-900">Step 2: Choose or Capture Blackboard Photograph *</h3>
              <p className="text-xs text-slate-500 font-medium">
                Ensure good lighting and that handwritten or printed text on the canteen board is clear.
              </p>

              {!selectedFile ? (
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
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
                      <h4 className="font-extrabold text-sm text-slate-800">Drag &amp; drop blackboard photo or select file</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">Supports JPEG, JPG, PNG, and WebP (Up to 10 MB)</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <Image className="w-3.5 h-3.5" />
                        Select Image File
                      </button>
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Take Photo (Camera)
                      </button>
                    </div>
                  </div>

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
                /* Selected File Preview */
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="relative bg-slate-900/5 max-h-80 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl!}
                      alt="Selected menu"
                      className="max-h-80 w-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Target: {activeCanteen.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer transition-all"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Run OCR Button & Progress */}
            {selectedFile && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                <h3 className="font-black text-base text-slate-900">Step 3: Run Tesseract.js OCR &amp; Extract Menu</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Client-side OCR will preprocess the image and extract dish names and prices directly on your device.
                </p>

                {isExtracting && progress && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                        {progress.message}
                      </span>
                      <span>{progress.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {ocrError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-red-700">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{ocrError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRunOcr}
                  disabled={isExtracting}
                  className="w-full py-4 bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Recognizing Characters &amp; Parsing Prices...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Extract Dishes &amp; Review Digital Menu
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
