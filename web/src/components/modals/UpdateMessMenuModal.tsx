'use client';

import React, { useState, useEffect } from 'react';
import { X, Utensils, Sparkles, Check, Upload, Tag, MessageSquare, AlertCircle } from 'lucide-react';
import { usePlexus } from '@/contexts/PlexusContext';
import { toast } from 'sonner';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface UpdateMessMenuData {
  items: string;
  tags: string[];
  specialNotes?: string;
  updatedBy: string;
  notifyChat: boolean;
}

interface UpdateMessMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayOfWeek;
  initialMealId?: string;
  existingItems?: string;
  existingTags?: string[];
  existingNotes?: string;
  onSave: (day: DayOfWeek, mealId: string, data: UpdateMessMenuData) => void;
}

const mealOptions = [
  { id: 'breakfast', label: '🌅 Breakfast (07:30 AM - 09:30 AM)' },
  { id: 'lunch', label: '☀️ Lunch (12:00 PM - 02:00 PM)' },
  { id: 'snacks', label: '☕ Evening Snacks (04:30 PM - 05:30 PM)' },
  { id: 'dinner', label: '🌙 Dinner (07:30 PM - 09:30 PM)' },
];

const availableTags = ['Pure Veg', 'Special Feast', 'Non-Veg Option', 'Festival Special', 'Diet Friendly', 'Sweet Included'];

const dishSuggestions: Record<string, string[]> = {
  breakfast: ['Ghee Podi Dosa', 'Idli & Medu Vada', 'Poori & Aloo Masala', 'Pongal', 'Rava Upma', 'Poha', 'Sambar & Coconut Chutney', 'Tea & Filter Coffee'],
  lunch: ['Paneer Butter Masala', 'Jeera Rice', 'Veg Dum Biryani', 'South Indian Meals', 'Dal Tadka', 'Chapathi / Phulka', 'Mor Kuzhambu', 'Curd & Pickle', 'Appalam / Papad'],
  snacks: ['Hot Samosa & Mint Chutney', 'Onion Pakoda', 'Veg Cutlet', 'Veg Puff', 'Bonda', 'Sweet Corn', 'Masala Chai', 'Ginger Tea'],
  dinner: ['Veg Biryani & Raitha', 'Paneer Butter Masala', 'Phulka Roti', 'Dal Makhani', 'Fried Rice & Manchurian', 'Jeera Rice & Kadai Paneer', 'Gulab Jamun', 'Ice Cream'],
};

export function UpdateMessMenuModal({
  isOpen,
  onClose,
  day: defaultDay,
  initialMealId = 'lunch',
  existingItems = '',
  existingTags = ['Pure Veg'],
  existingNotes = '',
  onSave,
}: UpdateMessMenuModalProps) {
  const { userName, userHostel, userRoom, postChatMessage } = usePlexus();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(defaultDay);
  const [selectedMealId, setSelectedMealId] = useState<string>(initialMealId);
  const [itemsText, setItemsText] = useState(existingItems);
  const [tags, setTags] = useState<string[]>(existingTags);
  const [specialNotes, setSpecialNotes] = useState(existingNotes);
  const [notifyChat, setNotifyChat] = useState(true);

  useEffect(() => {
    setSelectedDay(defaultDay);
    setSelectedMealId(initialMealId);
    setItemsText(existingItems);
    setTags(existingTags.length > 0 ? existingTags : ['Pure Veg']);
    setSpecialNotes(existingNotes || '');
  }, [defaultDay, initialMealId, existingItems, existingTags, existingNotes, isOpen]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const addDishSuggestion = (dish: string) => {
    if (!itemsText.trim()) {
      setItemsText(dish);
    } else if (!itemsText.includes(dish)) {
      setItemsText(itemsText.trim().replace(/,\s*$/, '') + ', ' + dish);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemsText.trim()) {
      toast.error('Please enter the menu items being served.');
      return;
    }

    const contributorName = `${userName || 'Student'} (${userHostel || 'Hostel'}${userRoom ? `, Room ${userRoom}` : ''})`;
    const mealLabel = mealOptions.find(m => m.id === selectedMealId)?.label.split(' ')[1] || 'Meal';

    onSave(selectedDay, selectedMealId, {
      items: itemsText.trim(),
      tags,
      specialNotes: specialNotes.trim() || undefined,
      updatedBy: contributorName,
      notifyChat,
    });

    if (notifyChat) {
      postChatMessage(
        `📢 Student Mess Update (${selectedDay} ${mealLabel}): "${itemsText.trim()}"${specialNotes ? ` - Note: ${specialNotes}` : ''}`
      );
    }

    toast.success(`Mess menu for ${selectedDay} ${mealLabel} updated! Thank you for helping your peers.`);
    onClose();
  };

  const suggestions = dishSuggestions[selectedMealId] || dishSuggestions.lunch;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
              🍲
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Update Mess Food Menu</h3>
              <p className="text-xs text-slate-400">Crowdsourced & Verified by Hostel Students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day & Meal Slot Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Day of Week
              </label>
              <select
                value={selectedDay}
                onChange={e => setSelectedDay(e.target.value as DayOfWeek)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Meal Slot
              </label>
              <select
                value={selectedMealId}
                onChange={e => setSelectedMealId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {mealOptions.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Menu Items Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Served Dishes & Items
              </label>
              <span className="text-[11px] text-slate-400">Comma-separated</span>
            </div>
            <textarea
              rows={3}
              value={itemsText}
              onChange={e => setItemsText(e.target.value)}
              placeholder="e.g. Ghee Podi Dosa, Sambar, Coconut Chutney, Tea / Coffee"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 leading-relaxed"
            />
          </div>

          {/* Quick Item Suggestion Chips */}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 mb-1.5">
              Quick Add Common Dishes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map(dish => (
                <button
                  type="button"
                  key={dish}
                  onClick={() => addDishSuggestion(dish)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors border border-slate-200/60"
                >
                  + {dish}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary & Highlight Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Dietary &amp; Feast Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map(tag => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Notice / Special Note (Optional)
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={e => setSpecialNotes(e.target.value)}
              placeholder="e.g. Ice cream served today! or Egg curry counter open"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Contributor Card & Chat Notice */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold">
                👤
              </span>
              <span>
                Posting as: <strong className="text-slate-900">{userName || 'Student'}</strong> ({userHostel || 'Hostel'})
              </span>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1 border-t border-slate-200/60">
              <input
                type="checkbox"
                checked={notifyChat}
                onChange={e => setNotifyChat(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded-sm focus:ring-teal-500"
              />
              <span>Broadcast update to hostel <strong>#mess-updates</strong> forum</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Update Menu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
