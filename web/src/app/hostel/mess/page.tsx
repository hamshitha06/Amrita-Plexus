'use client';

import React from 'react';
import { Utensils, Calendar, Clock, Star } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function MessFoodMenuPage() {
  const todayMenu = [
    { meal: 'Breakfast (07:30 AM - 09:30 AM)', items: 'Ghee Podi Dosa, Sambar, Coconut Chutney, Tea / Coffee' },
    { meal: 'Lunch (12:00 PM - 02:00 PM)', items: 'Jeera Rice, Chapathi, Paneer Butter Masala, Dal Tadka, Curd, Salad' },
    { meal: 'Evening Snacks (04:30 PM - 05:30 PM)', items: 'Samosa & Hot Ginger Tea' },
    { meal: 'Dinner (07:30 PM - 09:30 PM)', items: 'Veg Biryani, Mirchi Ka Salan, Raitha, Gulab Jamun' },
  ];

  return (
    <AppLayout
      breadcrumb="Student Portal / Hostel Services / Mess Food Menu"
      title="Mess Food Menu"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Gargi Mess Daily Timetable
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">Today&apos;s Special Mess Menu</h2>
            <p className="text-xs text-slate-400 font-medium">Fresh hygienic meals prepared daily</p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            📅 Saturday Schedule
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todayMenu.map(m => (
            <div key={m.meal} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>{m.meal}</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800 leading-snug">
                {m.items}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
