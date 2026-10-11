'use client';

import React, { useState } from 'react';
import { ParsedMenuItem, parseMenuText, detectCategory } from '@/lib/menu-parser';
import { matchKnownDish } from '@/lib/dish-lexicon';
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  Send,
  RefreshCw,
  Wand2,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  HelpCircle
} from 'lucide-react';

interface DigitalMenuEditorProps {
  canteenName: string;
  canteenId: string;
  imagePreviewUrl: string;
  initialItems: ParsedMenuItem[];
  rawOcrText?: string;
  unparsedLines?: string[];
  totalRecognizedLines?: number;
  recallMetrics?: {
    extractionRecallPercent: number;
    priceAccuracyPercent: number;
  };
  onPublish: (items: ParsedMenuItem[]) => Promise<void>;
  onReset: () => void;
  isPublishing?: boolean;
}

export function DigitalMenuEditor({
  canteenName,
  imagePreviewUrl,
  initialItems,
  rawOcrText,
  unparsedLines = [],
  totalRecognizedLines,
  recallMetrics,
  onPublish,
  onReset,
  isPublishing = false,
}: DigitalMenuEditorProps) {
  const [items, setItems] = useState<ParsedMenuItem[]>(initialItems);
  const [unparsed, setUnparsed] = useState<string[]>(unparsedLines);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUnparsed, setShowUnparsed] = useState<boolean>(unparsedLines.length > 0 && initialItems.length < 5);
  const [showRawText, setShowRawText] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-format all items against campus lexicon
  const handleAutoFormatAll = () => {
    // 1. Try re-parsing composite lines through parseMenuText to split multi-dish rows and filter noise
    const linesToParse = items.map(item => `${item.title} ${item.price > 0 ? item.price : ''}`).join('\n');
    const reParsed = parseMenuText(linesToParse);

    if (reParsed.items.length >= 2) {
      setItems(reParsed.items);
      return;
    }

    // 2. Fallback per-item normalization
    setItems(prev =>
      prev.map(item => {
        const match = matchKnownDish(item.title);
        if (match) {
          return {
            ...item,
            title: match.canonicalName,
            category: match.category,
            price: item.price > 0 ? item.price : match.defaultPrice,
            needsReview: false,
          };
        }
        return item;
      })
    );
  };

  const handleUpdateItem = (id: string, updates: Partial<ParsedMenuItem>) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          if (updates.price !== undefined && updates.price > 0 && updated.title.trim().length > 0) {
            updated.needsReview = false;
          } else if (updates.price !== undefined && updates.price <= 0) {
            updated.needsReview = true;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    const newItem: ParsedMenuItem = {
      id: `manual-item-${Date.now()}`,
      title: 'New Dish Item',
      price: 40,
      category: 'Snacks',
      prepTime: '10 mins',
      isAvailable: true,
      needsReview: false,
      confidence: 1.0,
    };
    setItems(prev => [newItem, ...prev]);
  };

  // Convert an unparsed OCR line into an editable digital dish row
  const handleConvertUnparsedLine = (line: string, index: number) => {
    const candidateDish = matchKnownDish(line);
    const cat = candidateDish ? candidateDish.category : detectCategory(line);
    const defaultEstimate = cat === 'Beverages' ? 15 : cat === 'Breakfast' ? 45 : cat === 'Meals' ? 70 : 40;

    const newDish: ParsedMenuItem = {
      id: `unparsed-item-${Date.now()}-${index}`,
      title: candidateDish ? candidateDish.canonicalName : line.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(),
      price: candidateDish ? candidateDish.defaultPrice : defaultEstimate,
      category: cat,
      prepTime: '10 mins',
      isAvailable: true,
      needsReview: !candidateDish,
      confidence: 0.75,
      rawLine: line,
    };

    setItems(prev => [...prev, newDish]);
    setUnparsed(prev => prev.filter((_, idx) => idx !== index));
  };

  const handlePublishClick = async () => {
    setValidationError(null);

    if (items.length === 0) {
      setValidationError('Please have at least 1 menu item before publishing.');
      return;
    }

    // Validate that no item has empty title or non-positive price
    const invalidItem = items.find(i => !i.title.trim() || isNaN(i.price) || i.price <= 0);
    if (invalidItem) {
      setValidationError(`Please check dish "${invalidItem.title || 'Untitled'}". Every item must have a valid title and price greater than ₹0.`);
      return;
    }

    await onPublish(items);
  };

  const needsReviewCount = items.filter(i => i.needsReview || i.price <= 0).length;
  const readyToPublishCount = items.length - needsReviewCount;
  const totalLinesCount = totalRecognizedLines || (items.length + unparsed.length);

  // Filter items by category and search
  const filteredItems = items.filter(item => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Needs Review'
        ? item.needsReview || item.price <= 0
        : item.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h3 className="text-lg font-black text-slate-900">Digital Menu Review &amp; Verification</h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {canteenName}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Complete extraction view: verify all dishes, categorize items, adjust prices, and convert unparsed lines.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAutoFormatAll}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-xl text-xs font-bold text-purple-700 cursor-pointer transition-all shadow-2xs"
            title="Clean typos, separate multi-column mergers, and standardize dish names & prices"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-600" />
            Auto-Format &amp; Clean Noise
          </button>

          {rawOcrText && (
            <button
              type="button"
              onClick={() => setShowRawText(!showRawText)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-all"
            >
              {showRawText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showRawText ? 'Hide Raw OCR' : 'View Raw OCR'}
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Upload Another
          </button>
        </div>
      </div>

      {/* Extraction Completeness Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Recognized Lines</span>
            <FileText className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-black text-slate-900">{totalLinesCount}</div>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Total OCR text lines</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-purple-200/80 bg-purple-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-purple-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Parsed Dishes</span>
            <Layers className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-black text-purple-900">{items.length}</div>
          <p className="text-[10px] text-purple-700/70 font-medium mt-0.5">Ready for menu table</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 bg-emerald-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ready to Publish</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-900">{readyToPublishCount}</div>
          <p className="text-[10px] text-emerald-700/70 font-medium mt-0.5">Complete name &amp; price</p>
        </div>

        <div className={`rounded-2xl p-4 border shadow-2xs ${needsReviewCount > 0 ? 'bg-amber-50/40 border-amber-200' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Needs Review</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-900">{needsReviewCount}</div>
          <p className="text-[10px] text-amber-700 font-medium mt-0.5">Missing price or title</p>
        </div>

        <div className={`rounded-2xl p-4 border shadow-2xs col-span-2 sm:col-span-1 ${unparsed.length > 0 ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Unparsed Lines</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-black text-slate-900">{unparsed.length}</div>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Available to convert</p>
        </div>
      </div>

      {/* Raw OCR Debug View (collapsible) */}
      {showRawText && rawOcrText && (
        <div className="bg-slate-900 rounded-2xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 pb-1 border-b border-slate-800">
            <span>Raw OCR Text Stream from Tesseract.js (Complete Photograph Capture)</span>
            <span>{items.length} dishes parsed · {unparsed.length} unparsed</span>
          </div>
          <pre className="whitespace-pre-wrap">{rawOcrText}</pre>
        </div>
      )}

      {/* Main Grid: Photo Preview (Left) and Digital Menu Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Photo Preview Pane */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <h4 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">Source Photograph</h4>
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative max-h-[500px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreviewUrl}
              alt="Canteen Menu"
              className="w-full h-auto object-contain max-h-[480px]"
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            💡 Compare the blackboard image directly against the editable digital table.
          </p>

          {/* Unparsed Lines Section in Side Pane */}
          {unparsed.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setShowUnparsed(!showUnparsed)}
                className="w-full flex items-center justify-between text-xs font-extrabold text-slate-700 hover:text-slate-900 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  Unparsed Lines ({unparsed.length})
                </span>
                {showUnparsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showUnparsed && (
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  <p className="text-[10px] text-slate-400 font-medium">
                    Lines not definitively matched as food items. Click to convert into a dish:
                  </p>
                  {unparsed.map((line, idx) => (
                    <div
                      key={`unparsed-${idx}`}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="font-mono text-[11px] text-slate-700 truncate" title={line}>
                        {line}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleConvertUnparsedLine(line, idx)}
                        className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold shrink-0 cursor-pointer transition-all"
                      >
                        + Add as Dish
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Editable Digital Menu Table Pane */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          {/* Controls: Search, Filter Tabs, Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                Extracted Digital Menu ({filteredItems.length} of {items.length} items visible)
              </h4>
              <p className="text-xs text-slate-400 font-medium">
                No items hidden. Click any field to edit. Every item must have a valid price &gt; ₹0.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Missing Dish
            </button>
          </div>

          {/* Search Bar & Category Filter Pills */}
          <div className="space-y-2.5 pt-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dish name or category..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['All', 'Breakfast', 'Meals', 'Snacks', 'Beverages', 'Desserts', 'Needs Review'].map(cat => {
                const count =
                  cat === 'All'
                    ? items.length
                    : cat === 'Needs Review'
                    ? needsReviewCount
                    : items.filter(i => i.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Complete Table with Full Scrolling (No Hidden Limits) */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-[560px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3 min-w-[200px]">Dish Title</th>
                  <th className="py-3 px-3 min-w-[120px]">Category</th>
                  <th className="py-3 px-3 min-w-[110px]">Price (₹)</th>
                  <th className="py-3 px-3 min-w-[90px]">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                      No dishes match &quot;{searchQuery || selectedCategory}&quot;. Try switching categories or clearing search.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const isMissingPrice = !item.price || item.price <= 0;
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          item.needsReview || isMissingPrice ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>

                        {/* Title */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={item.title}
                            onChange={e => handleUpdateItem(item.id, { title: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
                            placeholder="Dish Name"
                          />
                          {(() => {
                            const match = matchKnownDish(item.title);
                            if (match && match.canonicalName.toLowerCase() !== item.title.toLowerCase()) {
                              return (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(item.id, {
                                      title: match.canonicalName,
                                      category: match.category,
                                      price: item.price > 0 ? item.price : match.defaultPrice,
                                      needsReview: false,
                                    })
                                  }
                                  className="text-[10px] text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 mt-1 cursor-pointer transition-colors"
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-purple-500" /> Suggestion: {match.canonicalName}
                                </button>
                              );
                            }
                            return null;
                          })()}
                        </td>

                        {/* Category */}
                        <td className="py-2.5 px-3">
                          <select
                            value={item.category}
                            onChange={e => handleUpdateItem(item.id, { category: e.target.value })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-purple-500"
                          >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Meals">Meals</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Desserts">Desserts</option>
                          </select>
                        </td>

                        {/* Price */}
                        <td className="py-2.5 px-3">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold">₹</span>
                            <input
                              type="number"
                              min="1"
                              max="999"
                              value={item.price > 0 ? item.price : ''}
                              onChange={e =>
                                handleUpdateItem(item.id, {
                                  price: parseInt(e.target.value, 10) || 0,
                                })
                              }
                              className={`w-full pl-6 pr-2 py-1.5 bg-white border rounded-lg text-xs font-bold focus:outline-hidden ${
                                isMissingPrice
                                  ? 'border-red-300 text-red-700 bg-red-50/50 focus:border-red-500 ring-1 ring-red-200'
                                  : 'border-slate-200 text-slate-800 focus:border-purple-500'
                              }`}
                              placeholder="Price"
                            />
                          </div>
                          {(() => {
                            const match = matchKnownDish(item.title);
                            if (match && match.defaultPrice > 0 && item.price !== match.defaultPrice) {
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItem(item.id, { price: match.defaultPrice, needsReview: false })}
                                  className="text-[10px] text-purple-600 hover:text-purple-800 font-bold flex items-center gap-0.5 mt-0.5 cursor-pointer transition-colors"
                                >
                                  <span>Standard: ₹{match.defaultPrice}</span>
                                </button>
                              );
                            }
                            if (isMissingPrice) {
                              return <span className="text-[10px] font-bold text-red-600 block mt-0.5">Price required</span>;
                            }
                            return null;
                          })()}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3">
                          {item.needsReview || isMissingPrice ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap">
                              <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> Needs Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Ready
                            </span>
                          )}
                        </td>

                        {/* Delete */}
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              {validationError}
            </div>
          )}

          {/* Bottom Action: Publish */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-medium">
              Publishing will persist all <span className="font-bold text-slate-800">{items.length} verified items</span> to the database under <span className="font-bold text-slate-800">{canteenName}</span>.
            </p>

            <button
              type="button"
              disabled={isPublishing || items.length === 0}
              onClick={handlePublishClick}
              className="w-full sm:w-auto px-7 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving {items.length} Dishes to Database...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publish Verified Menu ({items.length} Dishes)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
