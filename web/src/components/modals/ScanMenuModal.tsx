'use client';

import React, { useState } from 'react';
import { X, Moon, Camera, Sparkles, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { usePlexus } from '@/contexts/PlexusContext';

interface ScanMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScanMenuModal({ isOpen, onClose }: ScanMenuModalProps) {
  const { scanMenuFromImage, isScanningMenu } = usePlexus();
  const [selectedPreset, setSelectedPreset] = useState<'board1' | 'board2'>('board1');

  if (!isOpen) return null;

  const handleStartScan = async () => {
    await scanMenuFromImage(selectedPreset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
              📸
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">AI Menu Photo Scanner</h3>
              <p className="text-xs text-slate-400">OCR Model v2.4 Vision Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Select or upload a photo of today&apos;s handwritten canteen menu blackboard. Our AI Vision model will extract dish names, prices, and prep times automatically!
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedPreset('board1')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedPreset === 'board1'
                  ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="text-xl mb-1">📋</div>
              <p className="font-bold text-xs text-slate-800">Blackboard Photo #1</p>
              <p className="text-[10px] text-slate-500">Night Specials & Noodles</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPreset('board2')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedPreset === 'board2'
                  ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="text-xl mb-1">🥤</div>
              <p className="font-bold text-xs text-slate-800">Blackboard Photo #2</p>
              <p className="text-[10px] text-slate-500">Cold Shakes & Rolls</p>
            </button>
          </div>

          <div className="border-2 border-dashed border-purple-200 bg-purple-50/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-purple-50/60 transition-colors">
            <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Click to upload photo from camera / gallery</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG blackboard menu photos</p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={isScanningMenu}
              onClick={handleStartScan}
              className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isScanningMenu ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting Dishes & Prices via AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run AI OCR Scan & Update Menu
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
