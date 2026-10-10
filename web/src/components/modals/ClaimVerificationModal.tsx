'use client';

import React, { useState } from 'react';
import { X, Shield, Lock, Upload, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { usePlexus, FoundItemReport } from '@/contexts/PlexusContext';

interface ClaimVerificationModalProps {
  item: FoundItemReport;
  onClose: () => void;
}

export function ClaimVerificationModal({ item, onClose }: ClaimVerificationModalProps) {
  const { submitClaim } = usePlexus();

  // Dynamic question generation based on category & security level
  const getQuestions = () => {
    const cat = item.category.toLowerCase();
    if (cat.includes('everyday')) {
      return [
        'What brand, color, or exact size is the bottle/item?',
        'Describe any unique stickers, scratches, or markings.',
      ];
    } else if (cat.includes('personal')) {
      return [
        'What is the exact model or brand of this item?',
        'Describe any roll numbers, custom markings, or case details.',
        'What items/accessories were stored with it (if any)?',
      ];
    } else if (cat.includes('electronics')) {
      return [
        'What is the exact brand, model, and color?',
        'Describe the lock-screen wallpaper, case appearance, or protective skin.',
        'Provide the Serial Number, IMEI (last 4 digits), or device name if known.',
      ];
    } else if (cat.includes('sensitive')) {
      return [
        'What is the full name and Roll Number / ID printed on the document?',
        'Describe the wallet/holder color, contents, or key ring attachments.',
      ];
    } else {
      // High value / Jewellery
      return [
        'Describe the metal type, hallmark, design, or stones in detail.',
        'Are there any secret initials, date engravings, or custom craft marks?',
        'Where and when did you last possess this item?',
      ];
    }
  };

  const questions = getQuestions();
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [evidencePhoto, setEvidencePhoto] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some(a => !a.trim())) {
      alert('Please answer all verification questions to establish ownership.');
      return;
    }

    setSubmitting(true);

    const questionAnswerPairs = questions.map((q, idx) => ({
      question: q,
      answer: answers[idx],
    }));

    setTimeout(() => {
      const ok = submitClaim(item.id, questionAnswerPairs, evidencePhoto || undefined, notes || undefined);
      setSubmitting(false);
      if (ok) {
        onClose();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-extrabold uppercase">
                Level {item.securityLevel} Security Verification
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Ownership Verification — {item.itemName}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Answer the open-ended questions below to prove ownership. Incorrect or guessed claims will be flagged.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 mb-5 flex items-start gap-3 text-xs text-amber-800 font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900">Fraud Prevention Warning:</p>
            <p className="mt-0.5 text-[11px] leading-relaxed">
              False ownership claims and misuse of CampusConnect may be reviewed and reported to campus administration. Max 3 claims per 24 hours allowed.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {questions.map((q, idx) => (
            <div key={idx} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                {idx + 1}. {q} <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={answers[idx]}
                onChange={e => {
                  const updated = [...answers];
                  updated[idx] = e.target.value;
                  setAnswers(updated);
                }}
                placeholder="Provide detailed, specific details..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all resize-none"
              />
            </div>
          ))}

          {/* Optional Direct Evidence Upload */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 block">
              Supporting Photographic Evidence <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Upload an old photo showing you with the item, receipt, warranty card, or box (Max 5MB).
            </p>

            <div className="mt-2">
              {evidencePhoto ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-40">
                  <img src={evidencePhoto} alt="Evidence preview" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => setEvidencePhoto('')}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-slate-600">Choose Evidence File from Device</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Additional Notes for Reviewer <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Can meet near Main Security Gate after 5 PM..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Claim for Verification
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
