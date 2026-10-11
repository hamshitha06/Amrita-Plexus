'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Utensils,
  Calendar,
  Clock,
  Sparkles,
  Edit3,
  ThumbsUp,
  CheckCircle2,
  AlertCircle,
  Search,
  RotateCcw,
  UserCheck,
  Building,
  Flame,
  MessageSquare,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { UpdateMessMenuModal, DayOfWeek, UpdateMessMenuData } from '@/components/modals/UpdateMessMenuModal';
import { toast } from 'sonner';

interface MealSlotData {
  id: string; // 'breakfast' | 'lunch' | 'snacks' | 'dinner'
  meal: string;
  timeRange: string;
  startHour: number;
  endHour: number;
  items: string;
  tags: string[];
  specialNotes?: string;
  updatedBy: string;
  updatedAt: string;
  verifiedCount: number;
}

type WeeklyMenu = Record<DayOfWeek, MealSlotData[]>;

const initialWeeklyMenu: WeeklyMenu = {
  Monday: [
    {
      id: 'breakfast',
      meal: 'Breakfast',
      timeRange: '07:30 AM - 09:30 AM',
      startHour: 7.5,
      endHour: 9.5,
      items: 'Idli, Medu Vada, Sambar, Coconut & Tomato Chutney, Tea / Coffee',
      tags: ['Pure Veg'],
      updatedBy: 'Ananya Sharma (Gargi)',
      updatedAt: '07:15 AM',
      verifiedCount: 18,
    },
    {
      id: 'lunch',
      meal: 'Lunch',
      timeRange: '12:00 PM - 02:00 PM',
      startHour: 12,
      endHour: 14,
      items: 'Steamed Rice, Sambar, Aloo Gobi Masala, Tomato Rasam, Curd, Appalam, Pickle',
      tags: ['Pure Veg'],
      updatedBy: 'Rahul Verma (Agastya)',
      updatedAt: '11:45 AM',
      verifiedCount: 22,
    },
    {
      id: 'snacks',
      meal: 'Evening Snacks',
      timeRange: '04:30 PM - 05:30 PM',
      startHour: 16.5,
      endHour: 17.5,
      items: 'Crispy Onion Pakoda & Hot Filter Coffee / Tea',
      tags: ['Pure Veg'],
      updatedBy: 'Divya K. (Mythreyi)',
      updatedAt: '04:10 PM',
      verifiedCount: 14,
    },
    {
      id: 'dinner',
      meal: 'Dinner',
      timeRange: '07:30 PM - 09:30 PM',
      startHour: 19.5,
      endHour: 21.5,
      items: 'Phulka Roti, Dal Fry, Kadai Paneer, Veg Pulao, Curd, Cut Cucumber',
      tags: ['Pure Veg'],
      updatedBy: 'Sanjay M. (Bhavani)',
      updatedAt: '07:05 PM',
      verifiedCount: 20,
    },
  ],
  Tuesday: [
    {
      id: 'breakfast',
      meal: 'Breakfast',
      timeRange: '07:30 AM - 09:30 AM',
      startHour: 7.5,
      endHour: 9.5,
      items: 'Fluffy Poori, Aloo Masala Bhaji, Hot Tea / Filter Coffee',
      tags: ['Pure Veg', 'Popular'],
      updatedBy: 'Kiran Raj (Agastya)',
      updatedAt: '07:20 AM',
      verifiedCount: 25,
    },
    {
      id: 'lunch',
      meal: 'Lunch',
      timeRange: '12:00 PM - 02:00 PM',
      startHour: 12,
      endHour: 14,
      items: 'Rice, Mor Kuzhambu, Beetroot Poriyal, Yellow Dal Tadka, Curd, Crisp Papad',
      tags: ['Pure Veg'],
      updatedBy: 'Meera N. (Gargi)',
      updatedAt: '11:50 AM',
      verifiedCount: 16,
    },
    {
      id: 'snacks',
      meal: 'Evening Snacks',
      timeRange: '04:30 PM - 05:30 PM',
      startHour: 16.5,
      endHour: 17.5,
      items: 'Hot Vegetable Puff & Ginger Cardamom Tea',
      tags: ['Pure Veg'],
      updatedBy: 'Arjun Das (Bhavani)',
      updatedAt: '04:15 PM',
      verifiedCount: 19,
    },
    {
      id: 'dinner',
      meal: 'Dinner',
      timeRange: '07:30 PM - 09:30 PM',
      startHour: 19.5,
      endHour: 21.5,
      items: 'Chapathi, Paneer Bhurji / Gravy, Jeera Rice, Dal Tadka, Mixed Fruit Bowl',
      tags: ['Pure Veg'],
      updatedBy: 'Pooja S. (Mythreyi)',
      updatedAt: '07:10 PM',
      verifiedCount: 21,
    },
  ],
  Wednesday: [
    {
      id: 'breakfast',
      meal: 'Breakfast',
      timeRange: '07:30 AM - 09:30 AM',
      startHour: 7.5,
      endHour: 9.5,
      items: 'Vegetable Rava Upma, Coconut Chutney, Fresh Banana, Tea / Coffee',
      tags: ['Pure Veg'],
      updatedBy: 'Rohan Gupta (Agastya)',
      updatedAt: '07:25 AM',
      verifiedCount: 15,
    },
    {
      id: 'lunch',
      meal: 'Lunch',
      timeRange: '12:00 PM - 02:00 PM',
      startHour: 12,
      endHour: 14,
      items: 'Variety Rice (Lemon Rice & Curd Rice), Golden Potato Fry, Dal, Papad, Pickle',
      tags: ['Pure Veg'],
      updatedBy: 'Sneha L. (Gargi)',
      updatedAt: '11:55 AM',
      verifiedCount: 18,
    },
    {
      id: 'snacks',
      meal: 'Evening Snacks',
      timeRange: '04:30 PM - 05:30 PM',
      startHour: 16.5,
      endHour: 17.5,
      items: 'Steamed Sweet Corn Masala / Boiled Channa & Masala Chai',
      tags: ['Pure Veg', 'Healthy'],
      updatedBy: 'Gaurav K. (Bhavani)',
      updatedAt: '04:20 PM',
      verifiedCount: 12,
    },
    {
      id: 'dinner',
      meal: 'Dinner',
      timeRange: '07:30 PM - 09:30 PM',
      startHour: 19.5,
      endHour: 21.5,
      items: 'Veg Biryani, Mirchi Ka Salan, Onion Raitha, Warm Gulab Jamun',
      tags: ['Special Feast', 'Pure Veg'],
      specialNotes: 'Gulab Jamun included for all students!',
      updatedBy: 'Alex Rivera (Gargi)',
      updatedAt: '07:00 PM',
      verifiedCount: 34,
    },
  ],
  Thursday: [
    {
      id: 'breakfast',
      meal: 'Breakfast',
      timeRange: '07:30 AM - 09:30 AM',
      startHour: 7.5,
      endHour: 9.5,
      items: 'Crispy Masala Dosa, Potato Masala, Sambar, Green Mint Chutney, Tea / Coffee',
      tags: ['Pure Veg', 'Popular'],
      updatedBy: 'Swathi R. (Mythreyi)',
      updatedAt: '07:15 AM',
      verifiedCount: 29,
    },
    {
      id: 'lunch',
      meal: 'Lunch',
      timeRange: '12:00 PM - 02:00 PM',
      startHour: 12,
      endHour: 14,
      items: 'Rice, Methi Dal, Mixed Veg Korma, Tomato Pepper Rasam, Curd, Pickle',
      tags: ['Pure Veg'],
      updatedBy: 'Aditya P. (Agastya)',
      updatedAt: '11:40 AM',
      verifiedCount: 17,
    },
    {
      id: 'snacks',
      meal: 'Evening Snacks',
      timeRange: '04:30 PM - 05:30 PM',
      startHour: 16.5,
      endHour: 17.5,
      items: 'Mysore Bonda with Coconut Chutney & Hot Tea',
      tags: ['Pure Veg'],
      updatedBy: 'Harish V. (Bhavani)',
      updatedAt: '04:15 PM',
      verifiedCount: 16,
    },
    {
      id: 'dinner',
      meal: 'Dinner',
      timeRange: '07:30 PM - 09:30 PM',
      startHour: 19.5,
      endHour: 21.5,
      items: 'Roti / Naan, Shahi Paneer, Peas Pulao, Dal Makhani, Fresh Onion Rings',
      tags: ['Pure Veg'],
      updatedBy: 'Kavita M. (Gargi)',
      updatedAt: '07:15 PM',
      verifiedCount: 23,
    },
  ],
  Friday: [
    {
      id: 'breakfast',
      meal: 'Breakfast',
      timeRange: '07:30 AM - 09:30 AM',
      startHour: 7.5,
      endHour: 9.5,
      items: 'Ven Pongal, Crispy Medu Vada, Ghee Sambar, Coconut Chutney, Tea / Coffee',
      tags: ['Pure Veg', 'Traditional'],
      updatedBy: 'Venkatesh S. (Agastya)',
      updatedAt: '07:10 AM',
      verifiedCount: 26,
    },
    {
      id: 'lunch',
      meal: 'Lunch',
      timeRange: '12:00 PM - 02:00 PM',
      startHour: 12,
      endHour: 14,
      items: 'Traditional Friday South Indian Thali: Rice, Drumstick Sambar, Cabbage Kootu, Rasam, Semiya Payasam, Appalam',
      tags: ['Special Feast', 'Pure Veg'],
      specialNotes: 'Semiya Payasam dessert served today!',
      updatedBy: 'Aishwarya M. (Gargi)',
      updatedAt: '11:35 AM',
      verifiedCount: 31,
    },
    {
      id: 'snacks',
      meal: 'Evening Snacks',
      timeRange: '04:30 PM - 05:30 PM',
      startHour: 16.5,
      endHour: 17.5,
      items: 'Crisp Potato Samosa with Mint & Tamarind Chutney, Hot Masala Tea',
      tags: ['Pure Veg', 'Popular'],
      updatedBy: 'Naveen K. (Bhavani)',
      updatedAt: '04:10 PM',
      verifiedCount: 24,
    },
    {
      id: 'dinner',
      meal: 'Dinner',
      timeRange: '07:30 PM - 09:30 PM',
      startHour: 19.5,
      endHour: 21.5,
      items: 'Indo-Chinese Night: Veg Fried Rice, Gobi Manchurian, Schezwan Sauce, Sweet Corn Soup',
      tags: ['Pure Veg', 'Student Favorite'],
      updatedBy: 'Tarun B. (Agastya)',
      updatedAt: '07:20 PM',
      verifiedCount: 38,
    },
  ],
  Saturday: [
    {
      id: 'breakfast',
      meal: 'Breakfast',
      timeRange: '07:30 AM - 09:30 AM',
      startHour: 7.5,
      endHour: 9.5,
      items: 'Ghee Podi Dosa, Sambar, Fresh Coconut Chutney, Tea / Filter Coffee',
      tags: ['Pure Veg', 'Popular'],
      updatedBy: 'Alex Rivera (Gargi, Room A-201)',
      updatedAt: 'Today, 08:15 AM',
      verifiedCount: 28,
    },
    {
      id: 'lunch',
      meal: 'Lunch',
      timeRange: '12:00 PM - 02:00 PM',
      startHour: 12,
      endHour: 14,
      items: 'Jeera Rice, Hot Chapathi, Paneer Butter Masala, Dal Tadka, Fresh Curd, Green Salad',
      tags: ['Pure Veg', 'Special Feast'],
      specialNotes: 'Extra paneer servings available upon request at counter 2.',
      updatedBy: 'Priya Nair (Gargi, Room B-104)',
      updatedAt: 'Today, 11:50 AM',
      verifiedCount: 35,
    },
    {
      id: 'snacks',
      meal: 'Evening Snacks',
      timeRange: '04:30 PM - 05:30 PM',
      startHour: 16.5,
      endHour: 17.5,
      items: 'Spicy Potato Samosa & Hot Ginger Tea',
      tags: ['Pure Veg'],
      updatedBy: 'Hamshitha (Room A-204)',
      updatedAt: 'Today, 04:05 PM',
      verifiedCount: 19,
    },
    {
      id: 'dinner',
      meal: 'Dinner',
      timeRange: '07:30 PM - 09:30 PM',
      startHour: 19.5,
      endHour: 21.5,
      items: 'Weekend Special: Veg Biryani, Mirchi Ka Salan, Cucumber Raitha, Vanilla Ice Cream Scoop',
      tags: ['Special Feast', 'Sweet Included'],
      specialNotes: 'Ice cream counter open beside the beverage station!',
      updatedBy: 'Karthik Raja (Agastya, Room C-302)',
      updatedAt: 'Today, 06:45 PM',
      verifiedCount: 42,
    },
  ],
  Sunday: [
    {
      id: 'breakfast',
      meal: 'Breakfast',
      timeRange: '08:00 AM - 10:00 AM',
      startHour: 8,
      endHour: 10,
      items: 'Chole Bhature, Pickled Onions, Mint Chutney, Sweet Lassi / Tea',
      tags: ['Special Feast', 'Sunday Special'],
      updatedBy: 'Deepak V. (Agastya)',
      updatedAt: '07:45 AM',
      verifiedCount: 45,
    },
    {
      id: 'lunch',
      meal: 'Lunch',
      timeRange: '12:00 PM - 02:30 PM',
      startHour: 12,
      endHour: 14.5,
      items: 'Sunday Dum Biryani (Hyderabadi Style), Veg Korma, Boondi Raitha, Papad, Rice Kheer Dessert',
      tags: ['Special Feast', 'Dessert Included'],
      specialNotes: 'Extended lunch hours until 2:30 PM for Sunday leisure.',
      updatedBy: 'Shreya P. (Gargi)',
      updatedAt: '11:30 AM',
      verifiedCount: 48,
    },
    {
      id: 'snacks',
      meal: 'Evening Snacks',
      timeRange: '04:30 PM - 05:30 PM',
      startHour: 16.5,
      endHour: 17.5,
      items: 'Veg Cutlet / Bread Butter Toast with Masala Chai',
      tags: ['Pure Veg'],
      updatedBy: 'Manish T. (Bhavani)',
      updatedAt: '04:15 PM',
      verifiedCount: 16,
    },
    {
      id: 'dinner',
      meal: 'Dinner',
      timeRange: '07:30 PM - 09:30 PM',
      startHour: 19.5,
      endHour: 21.5,
      items: 'Soft Chapathi, Malai Kofta Curry, Peas Pulao, Dal Fry, Fresh Watermelon Cut Fruits',
      tags: ['Pure Veg'],
      updatedBy: 'Archana R. (Mythreyi)',
      updatedAt: '07:10 PM',
      verifiedCount: 27,
    },
  ],
};

const hostelOptions = ['Gargi Hostel Mess (Girls)', 'Agastya Hostel Mess (Boys)', 'Mythreyi Hostel Mess', 'Bhavani Mess'];

export default function MessFoodMenuPage() {
  const { userName, userHostel } = usePlexus();

  // Determine current day of week
  const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayNames[new Date().getDay()] as DayOfWeek;

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDayName);
  const [selectedHostel, setSelectedHostel] = useState<string>(hostelOptions[0]);
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>(initialWeeklyMenu);
  const [verifiedSlots, setVerifiedSlots] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string>('lunch');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedMenu = localStorage.getItem('amrita_plexus_mess_menu_v2');
      if (savedMenu) {
        setWeeklyMenu(JSON.parse(savedMenu));
      }
      const savedVerified = localStorage.getItem('amrita_plexus_mess_verified_v2');
      if (savedVerified) {
        setVerifiedSlots(JSON.parse(savedVerified));
      }
    } catch {
      // fallback to initial state
    }
  }, []);

  // Save changes to localStorage
  const saveWeeklyMenu = (updated: WeeklyMenu) => {
    setWeeklyMenu(updated);
    try {
      localStorage.setItem('amrita_plexus_mess_menu_v2', JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  };

  const handleOpenUpdateModal = (mealId?: string) => {
    if (mealId) {
      setEditingMealId(mealId);
    }
    setIsUpdateModalOpen(true);
  };

  const handleSaveMenuUpdate = (
    day: DayOfWeek,
    mealId: string,
    data: UpdateMessMenuData
  ) => {
    const updated = { ...weeklyMenu };
    const dayMeals = [...(updated[day] || [])];
    const index = dayMeals.findIndex(m => m.id === mealId);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (index !== -1) {
      dayMeals[index] = {
        ...dayMeals[index],
        items: data.items,
        tags: data.tags,
        specialNotes: data.specialNotes,
        updatedBy: data.updatedBy,
        updatedAt: `Today, ${formattedTime}`,
        verifiedCount: (dayMeals[index].verifiedCount || 10) + 1,
      };
      updated[day] = dayMeals;
      saveWeeklyMenu(updated);
    }
  };

  const handleVerifyMeal = (mealId: string) => {
    const key = `${selectedDay}-${mealId}`;
    if (verifiedSlots[key]) {
      toast.info('You have already verified this meal today.');
      return;
    }

    const updated = { ...weeklyMenu };
    const dayMeals = [...(updated[selectedDay] || [])];
    const index = dayMeals.findIndex(m => m.id === mealId);

    if (index !== -1) {
      dayMeals[index] = {
        ...dayMeals[index],
        verifiedCount: (dayMeals[index].verifiedCount || 0) + 1,
      };
      updated[selectedDay] = dayMeals;
      saveWeeklyMenu(updated);

      const newVerified = { ...verifiedSlots, [key]: true };
      setVerifiedSlots(newVerified);
      try {
        localStorage.setItem('amrita_plexus_mess_verified_v2', JSON.stringify(newVerified));
      } catch {
        // ignore
      }

      toast.success(`Verified! Thank you for confirming today's ${dayMeals[index].meal}.`);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset the weekly timetable to default campus schedule?')) {
      setWeeklyMenu(initialWeeklyMenu);
      setVerifiedSlots({});
      localStorage.removeItem('amrita_plexus_mess_menu_v2');
      localStorage.removeItem('amrita_plexus_mess_verified_v2');
      toast.success('Mess schedule reset to standard college timetable.');
    }
  };

  // Determine if a meal is serving right now
  const isMealServingNow = (startHour: number, endHour: number, day: DayOfWeek) => {
    if (day !== todayDayName) return false;
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    return currentHour >= startHour && currentHour <= endHour;
  };

  // Filter meals if search query is provided
  const mealsForSelectedDay = weeklyMenu[selectedDay] || [];
  const filteredMeals = useMemo(() => {
    if (!searchQuery.trim()) return mealsForSelectedDay;
    const q = searchQuery.toLowerCase();
    return mealsForSelectedDay.filter(
      m =>
        m.items.toLowerCase().includes(q) ||
        m.meal.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q)) ||
        (m.specialNotes && m.specialNotes.toLowerCase().includes(q))
    );
  }, [mealsForSelectedDay, searchQuery]);

  // Selected meal data for the modal prefill
  const editingMealData = mealsForSelectedDay.find(m => m.id === editingMealId);

  return (
    <AppLayout
      breadcrumb="Student Portal / Hostel Services / Mess Food Menu"
      title="Mess Food Menu"
    >
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-teal-700" />
                  Student-Updated Mess Timetable
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  ✓ Verified by Peers
                </span>
                {selectedDay === todayDayName && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                    🌟 Today&apos;s Active Menu
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>🍽️</span> {selectedDay}&apos;s Daily Mess Menu
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Notice a change on the blackboard? Students can update menu items, post announcements, and verify meal accuracy in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
              <button
                onClick={() => handleOpenUpdateModal('lunch')}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Edit3 className="w-4 h-4" />
                <span>✏️ Update Mess Menu</span>
              </button>

              <button
                onClick={handleResetToDefaults}
                title="Reset timetable to standard college menu"
                className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar: Day Switcher, Hostel Selector & Dish Search */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-4">
          {/* Day of Week Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {dayNames.map(day => {
              const isSelected = selectedDay === day;
              const isToday = day === todayDayName;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{day}</span>
                  {isToday && (
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/25 text-white' : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-bar: Hostel Picker and Dish Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Building className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedHostel}
                onChange={e => setSelectedHostel(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {hostelOptions.map(h => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Dosa, Biryani)..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Meal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeals.map(slot => {
            const servingNow = isMealServingNow(slot.startHour, slot.endHour, selectedDay);
            const isVerifiedByMe = verifiedSlots[`${selectedDay}-${slot.id}`];

            return (
              <div
                key={slot.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-2xs space-y-4 flex flex-col justify-between ${
                  servingNow
                    ? 'border-teal-500/80 ring-2 ring-teal-500/20 shadow-sm'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Meal Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span className="text-sm font-black text-slate-900">{slot.meal}</span>
                      <span className="text-slate-400 font-normal">({slot.timeRange})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {servingNow && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Serving Now
                        </span>
                      )}
                      <button
                        onClick={() => handleOpenUpdateModal(slot.id)}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-teal-700 bg-slate-50 hover:bg-teal-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {slot.tags.map(t => (
                      <span
                        key={t}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <p className="text-sm font-black text-slate-800 leading-snug">
                    {slot.items}
                  </p>

                  {slot.specialNotes && (
                    <div className="flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200/70 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{slot.specialNotes}</span>
                    </div>
                  )}
                </div>

                {/* Footer: Contributor & Peer Verification */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs flex-wrap">
                  <div className="text-[11px] text-slate-400">
                    <span>Updated by </span>
                    <strong className="text-slate-700">{slot.updatedBy}</strong>
                    <span className="text-slate-400"> • {slot.updatedAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ✓ {slot.verifiedCount} verified
                    </span>
                    <button
                      onClick={() => handleVerifyMeal(slot.id)}
                      disabled={isVerifiedByMe}
                      className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                        isVerifiedByMe
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                          : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{isVerifiedByMe ? 'Verified' : 'Verify'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Info Box */}
        <div className="bg-linear-to-r from-teal-50 to-emerald-50 rounded-3xl p-6 border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-700" />
              <span>How Student Mess Updates Work</span>
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-2xl">
              Any verified student residing in Amrita hostels can update the dishes served for breakfast, lunch, snacks, or dinner. When verified peers vote, the accuracy score increases, and updates are broadcasted to the hostel&apos;s <strong>#mess-updates</strong> forum.
            </p>
          </div>

          <Link
            href="/hostel/chat"
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl transition-colors shadow-2xs self-start sm:self-auto shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open #mess-updates Chat</span>
          </Link>
        </div>
      </div>

      {/* Update Mess Menu Modal */}
      <UpdateMessMenuModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        day={selectedDay}
        initialMealId={editingMealId}
        existingItems={editingMealData?.items}
        existingTags={editingMealData?.tags}
        existingNotes={editingMealData?.specialNotes}
        onSave={handleSaveMenuUpdate}
      />
    </AppLayout>
  );
}
