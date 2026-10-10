'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Search,
  Truck,
  Wallet,
  MessageSquare,
  ShoppingBag,
  Moon,
  Utensils,
  MessageCircle,
  Car,
  ChevronDown,
  Menu,
  X,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  LogOut,
  Sparkles,
  ShoppingCart,
  Camera,
  ClipboardList,
  Map,
  Briefcase,
  Wrench,
  ClipboardCheck,
  Settings,
  ShieldAlert,
  HelpCircle,
  FileQuestion,
  Shield,
} from 'lucide-react';
import { usePlexus } from '@/contexts/PlexusContext';
import { AddParcelModal } from '@/components/modals/AddParcelModal';
import { AddWalletModal } from '@/components/modals/AddWalletModal';

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumb: string;
  title: string;
}

export function AppLayout({ children, breadcrumb, title }: AppLayoutProps) {
  const pathname = usePathname();
  const { 
    walletBalance, userName, userRollNumber, userBranchYear, userHostel, 
    parcels, snacks, chatMessages, cartCount, marketplaceItems = [], 
    potentialMatches = [], foundReports = [] 
  } = usePlexus();

  // Sidebar collapsible section toggles (only open active section by default for clean UX)
  const [parcelSectionOpen, setParcelSectionOpen] = useState(pathname.startsWith('/parcels') || pathname === '/dashboard');
  const [hostelSectionOpen, setHostelSectionOpen] = useState(pathname.startsWith('/hostel'));
  const [canteenSectionOpen, setCanteenSectionOpen] = useState(pathname.startsWith('/canteen'));
  const [carpoolSectionOpen, setCarpoolSectionOpen] = useState(pathname.startsWith('/carpool'));
  const [servicesSectionOpen, setServicesSectionOpen] = useState(pathname.startsWith('/services'));
  const [marketplaceSectionOpen, setMarketplaceSectionOpen] = useState(pathname.startsWith('/marketplace'));
  const [lostFoundSectionOpen, setLostFoundSectionOpen] = useState(pathname.startsWith('/lost-found'));

  // Mobile sidebar toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal states
  const [addParcelModalOpen, setAddParcelModalOpen] = useState(false);
  const [addWalletModalOpen, setAddWalletModalOpen] = useState(false);

  // Counts for badges
  const awaitingParcelsCount = parcels.filter(p => p.status === 'Awaiting Delivery').length;
  const snacksCount = snacks.length;

  interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }

  const parcelNavItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'My Parcels',
      href: '/parcels/my-parcels',
      icon: Package,
      badge: awaitingParcelsCount > 0 ? awaitingParcelsCount.toString() : '2',
      badgeColor: 'blue',
    },
    {
      name: 'Find Deliveries',
      href: '/parcels/find-deliveries',
      icon: Search,
      badge: '2',
      badgeColor: 'blue',
    },
    {
      name: 'My Deliveries',
      href: '/parcels/my-deliveries',
      icon: Truck,
    },
    {
      name: 'E-Wallet',
      href: '/parcels/wallet',
      icon: Wallet,
    },
    {
      name: 'Messages',
      href: '/parcels/messages',
      icon: MessageSquare,
      badge: '1',
      badgeColor: 'blue',
    },
  ];

  const hostelNavItems: NavItem[] = [
    {
      name: 'P2P Student Snacks',
      href: '/hostel/snacks',
      icon: ShoppingBag,
      badge: '2',
      badgeColor: 'teal',
    },
    {
      name: 'Night Canteen (AI Menu)',
      href: '/hostel/canteen',
      icon: Moon,
      badge: 'AI',
      badgeColor: 'teal',
    },
    {
      name: 'Mess Food Menu',
      href: '/hostel/mess',
      icon: Utensils,
    },
    {
      name: 'Hostel General Chat',
      href: '/hostel/chat',
      icon: MessageCircle,
    },
  ];

  const canteenNavItems: NavItem[] = [
    {
      name: 'Canteen Home',
      href: '/canteen',
      icon: Utensils,
    },
    {
      name: 'Digital Menu',
      href: '/canteen/menu',
      icon: ShoppingBag,
    },
    {
      name: 'My Cart',
      href: '/canteen/cart',
      icon: ShoppingCart,
      badge: cartCount > 0 ? cartCount.toString() : undefined,
      badgeColor: 'amber',
    },
    {
      name: 'Upload Menu Photo',
      href: '/canteen/upload-menu',
      icon: Camera,
    },
    {
      name: 'My Food Requests',
      href: '/canteen/my-requests',
      icon: ClipboardList,
    },
    {
      name: 'Deliver & Earn',
      href: '/canteen/deliver',
      icon: Truck,
    },
    {
      name: 'My Deliveries',
      href: '/canteen/my-deliveries',
      icon: Package,
    },
  ];

  const carpoolNavItems: NavItem[] = [
    {
      name: 'Carpool Home',
      href: '/carpool',
      icon: Map,
    },
    {
      name: 'Find a Ride',
      href: '/carpool/find',
      icon: Search,
    },
    {
      name: 'Offer a Ride',
      href: '/carpool/offer',
      icon: Plus,
    },
    {
      name: 'My Rides',
      href: '/carpool/my-rides',
      icon: Car,
    },
  ];

  const servicesNavItems: NavItem[] = [
    {
      name: 'Discover Services',
      href: '/services',
      icon: Briefcase,
    },
    {
      name: 'Offer Your Skill',
      href: '/services/offer',
      icon: Plus,
    },
    {
      name: 'My Requests',
      href: '/services/my-requests',
      icon: ClipboardCheck,
    },
    {
      name: 'Provider Console',
      href: '/services/manage',
      icon: Settings,
    },
  ];

  const marketplaceNavItems: NavItem[] = [
    {
      name: 'Buy & Sell Marketplace',
      href: '/marketplace',
      icon: ShoppingBag,
      badge: marketplaceItems.length > 0 ? marketplaceItems.filter(i => i.status === 'Available').length : undefined,
    },
    {
      name: 'My Listings',
      href: '/marketplace/my-listings',
      icon: ClipboardList,
      badge: marketplaceItems.filter(i => i.sellerName === userName).length || undefined,
    },
    {
      name: 'Post Item',
      href: '/marketplace/post',
      icon: Plus,
    },
  ];

  const lostFoundNavItems: NavItem[] = [
    {
      name: 'Lost & Found Overview',
      href: '/lost-found',
      icon: ShieldAlert,
      badge: foundReports.filter(f => f.status !== 'Collected' && f.status !== 'Closed').length || undefined,
    },
    {
      name: 'Report Lost Item',
      href: '/lost-found/report-lost',
      icon: FileQuestion,
    },
    {
      name: 'Report Found Item',
      href: '/lost-found/report-found',
      icon: Plus,
    },
    {
      name: 'My Reports & Claims',
      href: '/lost-found/my-items',
      icon: ClipboardList,
    },
    {
      name: 'Potential Matches',
      href: '/lost-found/matches',
      icon: Sparkles,
      badge: potentialMatches.filter(m => m.status === 'Pending Verification').length || undefined,
    },
    {
      name: 'Security Custody Desk',
      href: '/lost-found/custody',
      icon: Shield,
    },
  ];

  const isHostelModuleActive = pathname.startsWith('/hostel');

  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] text-slate-800 flex flex-col font-sans antialiased">
      {/* Top Navbar & Mobile Header */}
      <header className="bg-white border-b border-slate-200/80 shrink-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Mobile hamburger & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <nav className="text-xs text-slate-400 font-medium tracking-tight">
                {breadcrumb}
              </nav>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>
            </div>
          </div>

          {/* Right: Wallet & User Profile Pill (Matching UI Design) */}
          <div className="flex items-center gap-3">
            {/* Campus Wallet pill with Top Up */}
            <button
              onClick={() => setAddWalletModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                ₹
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-emerald-800 uppercase font-extrabold tracking-wider">CAMPUS WALLET</span>
                <span className="text-slate-900 font-extrabold text-xs">₹{walletBalance.toLocaleString()}</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-700 text-white rounded-full text-[10px] font-extrabold">
                + Top Up
              </span>
            </button>

            {/* Profile pill linking to /profile */}
            <Link
              href="/profile"
              className="flex items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {userName}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {userBranchYear} • {userRollNumber}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <aside
          className={`absolute lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 transition-transform duration-200 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-6 overflow-y-auto flex-1">
            {/* Logo Section */}
            <div className="px-2 pt-1 pb-3 border-b border-slate-100">
              <Link href="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-xs tracking-tight">
                  AP
                </div>
                <div>
                  <div className="text-base font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                    AmritaPlexus
                  </div>
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">
                    CAMPUS PLATFORM
                  </p>
                </div>
              </Link>
            </div>

            {/* Group 1: AMAZON PARCEL MANAGEMENT */}
            <div className="space-y-1">
              <button
                onClick={() => setParcelSectionOpen(!parcelSectionOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase hover:text-slate-800"
              >
                <span>Amazon Parcel Management</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    parcelSectionOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {parcelSectionOpen && (
                <div className="space-y-0.5 pt-1">
                  {parcelNavItems.map(item => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-50 text-blue-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Group 2: HOSTEL SERVICES */}
            <div className="space-y-1">
              <button
                onClick={() => setHostelSectionOpen(!hostelSectionOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase hover:text-slate-800"
              >
                <span>Hostel Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    hostelSectionOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {hostelSectionOpen && (
                <div className="space-y-0.5 pt-1">
                  {hostelNavItems.map(item => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#0D9488] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Group 3: CANTEEN */}
            <div className="space-y-1">
              <button
                onClick={() => setCanteenSectionOpen(!canteenSectionOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase hover:text-slate-800"
              >
                <span>🍕 Canteen &amp; Food</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    canteenSectionOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {canteenSectionOpen && (
                <div className="space-y-0.5 pt-1">
                  {canteenNavItems.map(item => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Group 4: CARPOOLING */}
            <div className="space-y-1">
              <button
                onClick={() => setCarpoolSectionOpen(!carpoolSectionOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase hover:text-slate-800"
              >
                <span>🚗 Carpooling</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    carpoolSectionOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {carpoolSectionOpen && (
                <div className="space-y-0.5 pt-1">
                  {carpoolNavItems.map(item => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Group 5: SERVICES & SKILLS */}
            <div className="space-y-1">
              <button
                onClick={() => setServicesSectionOpen(!servicesSectionOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase hover:text-slate-800"
              >
                <span>🛠️ Services &amp; Skills</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    servicesSectionOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {servicesSectionOpen && (
                <div className="space-y-0.5 pt-1">
                  {servicesNavItems.map(item => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Group 6: CAMPUS MARKETPLACE */}
            <div className="space-y-1">
              <button
                onClick={() => setMarketplaceSectionOpen(!marketplaceSectionOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase hover:text-slate-800"
              >
                <span>🛒 Campus Marketplace</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    marketplaceSectionOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {marketplaceSectionOpen && (
                <div className="space-y-0.5 pt-1">
                  {marketplaceNavItems.map(item => {
                    const isActive = pathname === item.href || (item.href === '/marketplace' && pathname === '/marketplace/post');
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Group 7: LOST & FOUND MANAGEMENT */}
            <div className="space-y-1">
              <button
                onClick={() => setLostFoundSectionOpen(!lostFoundSectionOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase hover:text-slate-800"
              >
                <span>🔍 Lost &amp; Found</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    lostFoundSectionOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {lostFoundSectionOpen && (
                <div className="space-y-0.5 pt-1">
                  {lostFoundNavItems.map(item => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-indigo-700 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-indigo-50 text-indigo-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100 shrink-0 space-y-3 bg-white">
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold text-emerald-800 truncate">
                Verified Student (@amrita.edu)
              </span>
            </div>

            <button
              onClick={() => {
                window.location.href = '/login';
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Log Out Securely
            </button>
          </div>
        </aside>

        {/* Overlay for mobile drawer */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <AddParcelModal
        isOpen={addParcelModalOpen}
        onClose={() => setAddParcelModalOpen(false)}
      />
      <AddWalletModal
        isOpen={addWalletModalOpen}
        onClose={() => setAddWalletModalOpen(false)}
      />
    </div>
  );
}
