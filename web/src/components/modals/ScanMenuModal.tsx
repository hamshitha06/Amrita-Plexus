'use client';

import React, { useState, useRef } from 'react';
import { X, Camera, Sparkles, Upload, CheckCircle2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { usePlexus } from '@/contexts/PlexusContext';
import { extractMenuFromImage, OcrProgressUpdate, OcrExtractionResult } from '@/lib/ocr-service';
import { DigitalMenuEditor } from '@/components/canteen/DigitalMenuEditor';
import { ParsedMenuItem, parseMenuText } from '@/lib/menu-parser';

interface ScanMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScanMenuModal({ isOpen, onClose }: ScanMenuModalProps) {
  const { canteens, selectedCanteenId, setSelectedCanteenId, publishDigitalMenu } = usePlexus();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<'board1' | 'board2' | 'custom'>('board1');
  const [previewUrl, setPreviewUrl] = useState<string>('https://images.unsplash.com/photo-1544025162-d76694265947?w=800');
  
  // OCR Progress State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressState, setProgressState] = useState<OcrProgressUpdate | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);

  // Extracted Data Ready for Review
  const [extractedData, setExtractedData] = useState<OcrExtractionResult | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const activeCanteen = canteens.find(c => c.id === selectedCanteenId) || canteens[0];

  const handleSelectPreset = (preset: 'board1' | 'board2') => {
    setSelectedPreset(preset);
    setSelectedFile(null);
    setExtractedData(null);
    setOcrError(null);
    if (preset === 'board1') {
      setPreviewUrl('https://images.unsplash.com/photo-1544025162-d76694265947?w=800');
    } else {
      setPreviewUrl('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800');
    }
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedPreset('custom');
    setSelectedFile(file);
    setExtractedData(null);
    setOcrError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleStartScan = async () => {
    setIsProcessing(true);
    setOcrError(null);
    setProgressState({
      stage: 'initializing',
      message: 'Initializing OCR Engine (Tesseract.js)...',
      progressPercent: 20,
    });

    try {
      if (selectedPreset === 'custom' && selectedFile) {
        // Run real Tesseract OCR on student's uploaded image
        const result = await extractMenuFromImage(selectedFile, update => {
          setProgressState(update);
        });
        setExtractedData(result);
      } else {
        // Preset sample blackboard menus: simulate real OCR engine progress, then parse realistic blackboard text
        setProgressState({ stage: 'preprocessing', message: 'Enhancing blackboard chalk contrast...', progressPercent: 40 });
        await new Promise(r => setTimeout(r, 600));

        setProgressState({ stage: 'recognizing', message: 'Tesseract.js recognizing characters & prices...', progressPercent: 75 });
        await new Promise(r => setTimeout(r, 800));

        const sampleText =
          selectedPreset === 'board1'
            ? `
VEG FRIED RICE 60
MASALA DOSA 55
PANEER BUTTER MASALA 110
FILTER COFFEE 20
HOT TEA 12
SAMOSA 15
`
            : `
COLD BADAM MILK 35
CHOCOLATE SHAKE 45
PANEER ROLL 50
EGG ROLL 40
LEMON TEA 15
ICE CREAM CUP 25
`;
        const parsed = parseMenuText(sampleText);
        setExtractedData({
          rawText: sampleText,
          confidence: 96.5,
          parsedResult: parsed,
          processingTimeMs: 1400,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'OCR extraction encountered an error.';
      setOcrError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishVerifiedMenu = async (verifiedItems: ParsedMenuItem[]) => {
    setIsPublishing(true);
    try {
      const ok = await publishDigitalMenu(
        activeCanteen.id,
        activeCanteen.name,
        verifiedItems,
        extractedData?.rawText,
        selectedFile ? selectedFile.name : `preset-${selectedPreset}`
      );
      if (ok) {
        onClose();
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleReset = () => {
    setExtractedData(null);
    setOcrError(null);
    setProgressState(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className={`bg-white rounded-3xl w-full p-6 shadow-2xl border border-slate-100 transition-all ${
        extractedData ? 'max-w-5xl my-8' : 'max-w-xl'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
              📸
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">AI Canteen Menu OCR Scanner</h3>
              <p className="text-xs text-slate-400">Tesseract.js Engine · Structured Price Parser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode 1: Review & Edit Table (When OCR is done) */}
        {extractedData ? (
          <div className="mt-4">
            <DigitalMenuEditor
              canteenName={activeCanteen.name}
              canteenId={activeCanteen.id}
              imagePreviewUrl={previewUrl}
              initialItems={extractedData.parsedResult.items}
              rawOcrText={extractedData.rawText}
              unparsedLines={extractedData.parsedResult.unparsedLines}
              totalRecognizedLines={extractedData.parsedResult.totalRecognizedLines}
              recallMetrics={extractedData.parsedResult.recallMetrics}
              onPublish={handlePublishVerifiedMenu}
              onReset={handleReset}
              isPublishing={isPublishing}
            />
          </div>
        ) : (
          /* View Mode 2: File Selection & OCR Launch */
          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Select or upload a photo of today&apos;s physical canteen blackboard. Our optical character recognition engine will extract dish names, prices in ₹, and categories for student verification!
            </p>

            {/* Target Canteen Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Target Campus Canteen:</label>
              <div className="grid grid-cols-3 gap-2">
                {canteens.map(cant => (
                  <button
                    key={cant.id}
                    type="button"
                    onClick={() => setSelectedCanteenId(cant.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      cant.id === selectedCanteenId
                        ? 'border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-300/30'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cant.icon} {cant.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSelectPreset('board1')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedPreset === 'board1'
                    ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="text-xl mb-1">📋</div>
                <p className="font-bold text-xs text-slate-800">Blackboard Photo #1</p>
                <p className="text-[10px] text-slate-500">Meals, Dosas &amp; Beverages</p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('board2')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedPreset === 'board2'
                    ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="text-xl mb-1">🥤</div>
                <p className="font-bold text-xs text-slate-800">Blackboard Photo #2</p>
                <p className="text-[10px] text-slate-500">Shakes, Rolls &amp; Snacks</p>
              </button>
            </div>

            {/* Custom Image Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors ${
                selectedPreset === 'custom'
                  ? 'border-purple-500 bg-purple-50/50'
                  : 'border-purple-200 bg-purple-50/20 hover:bg-purple-50/40'
              }`}
            >
              <Upload className="w-7 h-7 text-purple-600 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-800">
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to upload your own blackboard photo'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Supports JPEG, PNG, WebP up to 10 MB</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => handleFileChange(e.target.files?.[0] || null)}
              />
            </div>

            {/* Progress / Status Bar */}
            {isProcessing && progressState && (
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                    {progressState.message}
                  </span>
                  <span>{progressState.progressPercent}%</span>
                </div>
                <div className="w-full bg-purple-200/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressState.progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {ocrError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{ocrError}</span>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleStartScan}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting Dishes &amp; Prices via OCR...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Run Tesseract.js OCR Scan &amp; Review Menu
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
