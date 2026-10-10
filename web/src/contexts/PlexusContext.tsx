'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Parcel {
  id: string;
  trackingNumber: string;
  courier: string;
  arrivalGate: string;
  destinationHostel: string;
  destinationRoom: string;
  recipientName: string;
  status: 'Awaiting Delivery' | 'In Transit' | 'Delivered';
  reward: number;
  otp?: string;
  dateAdded: string;
  delivererName?: string;
}

export interface Snack {
  id: string;
  title: string;
  category: string;
  price: number;
  seller: string;
  pickupLocation: string;
  availableQty: number;
  iconType: 'brownie' | 'noodles' | 'cookies' | 'chips' | 'beverage';
  dateAdded: string;
}

export interface CanteenItem {
  id: string;
  title: string;
  category: string;
  price: number;
  prepTime: string;
  isAvailable: boolean;
  aiVerifiedScore: number;
  categoryBadge: string;
  canteenId?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  canteenId: string;
  canteenName: string;
}

export interface FoodRequest {
  id: string;
  requestNumber: string;
  requesterName: string;
  requesterRoom: string;
  canteenId: string;
  canteenName: string;
  canteenLocation: string;
  items: { title: string; price: number; quantity: number }[];
  deliveryAddress: string;
  instructions: string;
  foodSubtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'Open' | 'Accepted' | 'Picked Up' | 'Delivered' | 'Cancelled';
  delivererName?: string;
  postedAt: string;
  acceptedAt?: string;
  deliveredAt?: string;
}

export interface ChatMessage {
  id: string;
  author: string;
  roleInfo: string;
  badgeText?: string;
  badgeType?: 'notice' | 'official' | 'student';
  timestamp: string;
  channel: 'general-discussion' | 'mess-updates' | 'announcements';
  content: string;
  isNotice?: boolean;
}

export interface CarpoolRide {
  id: string;
  origin: string;
  destination: string;
  driverName: string;
  driverRole: string;
  vehicleType: string;
  date: string;
  time: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
  status: 'AVAILABLE' | 'FULL' | 'CANCELLED';
  isOfferedByMe?: boolean;
}

export interface CarpoolBooking {
  id: string;
  rideId: string;
  rideTitle: string;
  driverName: string;
  schedule: string;
  vehicleType: string;
  price: number;
  status: 'ACCEPTED' | 'PENDING' | 'CANCELLED';
}

export interface CampusService {
  id: string;
  title: string;
  category: string;
  description: string;
  providerName: string;
  providerHostel: string;
  price: number;
  pricingModel: 'Hourly' | 'Fixed' | 'Negotiable';
  rating: number;
  reviewsCount: number;
  availability: string;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  serviceTitle: string;
  providerName: string;
  providerHostel: string;
  providerPhone: string;
  appointmentDate: string;
  customerNotes: string;
  price: number;
  pricingModel: string;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
  reviewedScore?: number;
  requestedAt: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: string;
  condition: string;
  sellingPrice: number;
  originalPrice?: number;
  pickupLocation: string;
  description: string;
  sellerName: string;
  sellerRating: number;
  sellerReviewsCount: number;
  status: 'Available' | 'Reserved' | 'Sold';
  createdAt: string;
}

// ─── Lost & Found Interfaces ──────────────────────────────────────────────────

export type SecurityLevel = 1 | 2 | 3 | 4 | 5;

export interface LostItemReport {
  id: string;
  reporterName: string;
  reporterEmail: string;
  category: string;
  itemName: string;
  description: string;
  lastSeenLocation: string;
  dateLost: string;
  timeLost?: string;
  photoUrl?: string;
  privateFeatures: string;
  additionalInfo?: string;
  securityLevel: SecurityLevel;
  status: 'Reported' | 'Potential Match' | 'Claimed' | 'Recovered' | 'Closed';
  createdAt: string;
}

export interface FoundItemReport {
  id: string;
  finderName: string;
  finderEmail: string;
  category: string;
  itemName: string;
  description: string;
  foundLocation: string;
  dateFound: string;
  timeFound?: string;
  photoUrl?: string;
  privateCharacteristics: string;
  custodyLocation: string;
  securityLevel: SecurityLevel;
  status: 'Reported' | 'Potential Match' | 'Awaiting Secure Deposit' | 'In Custody' | 'Verification In Progress' | 'Approved for Handover' | 'Disputed' | 'Collected' | 'Closed';
  createdAt: string;
}

export interface PotentialMatch {
  id: string;
  lostReportId: string;
  foundReportId: string;
  matchScore: number;
  matchReason: string;
  status: 'Pending Verification' | 'Claim Initiated' | 'Dismissed';
  detectedAt: string;
}

export interface LostFoundClaim {
  id: string;
  foundItemId: string;
  claimantName: string;
  claimantEmail: string;
  answers: { question: string; answer: string }[];
  evidencePhotoUrl?: string;
  additionalNotes?: string;
  advisoryMatchScore: number;
  status: 'Pending' | 'Under Review' | 'Additional Evidence Requested' | 'Approved' | 'Rejected' | 'Disputed' | 'Withdrawn' | 'Collected';
  handoverOTP?: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SecurityCustodyRecord {
  id: string;
  foundItemId: string;
  storageLocker: string;
  receivingStaffId: string;
  receivingStaffName: string;
  secondaryStaffName?: string;
  conditionNotes: string;
  intakeTimestamp: string;
  handoverCompletedAt?: string;
}

export interface CampusCanteen {
  id: string;
  name: string;
  location: string;
  icon: string;
  lastUploaded: string;
  uploadedBy: string;
}

// Legacy type kept for backward compat
export interface FoodDeliveryJob {
  id: string;
  orderNumber: string;
  deliveryLocation: string;
  customerName: string;
  feeEarned: number;
  status: 'Completed' | 'In Progress';
}

interface PlexusContextType {
  // User Profile & Wallet
  userName: string;
  userRollNumber: string;
  userBranchYear: string;
  userEmail: string;
  userPhone: string;
  userHostel: string;
  userRoom: string;
  userEmergencyContact: string;
  userRating: number;
  userRatingCount: number;
  parcelDeliveryScore: number;
  foodDeliveryScore: number;
  servicesRating: number;
  marketplaceRating: number;
  walletBalance: number;
  addWalletFunds: (amount: number) => void;
  deductWalletFunds: (amount: number, reason: string) => boolean;
  updateUserProfile: (data: Partial<{
    userName: string;
    userRollNumber: string;
    userBranchYear: string;
    userEmail: string;
    userPhone: string;
    userHostel: string;
    userRoom: string;
    userEmergencyContact: string;
  }>) => void;

  // Parcels
  parcels: Parcel[];
  addParcel: (parcel: Omit<Parcel, 'id' | 'dateAdded' | 'status'>) => void;
  acceptDelivery: (parcelId: string) => void;
  completeDelivery: (parcelId: string, otp: string) => boolean;

  // Snacks
  snacks: Snack[];
  addSnack: (snack: Omit<Snack, 'id' | 'dateAdded'>) => void;
  buySnack: (snackId: string) => boolean;

  // Canteen — items & canteens
  canteens: CampusCanteen[];
  selectedCanteenId: string;
  setSelectedCanteenId: (id: string) => void;
  canteenItems: CanteenItem[];
  isScanningMenu: boolean;
  scanMenuFromImage: (imageName: string) => Promise<void>;

  // Canteen — Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: CanteenItem, canteenId: string, canteenName: string) => void;
  updateCartQty: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;

  // Canteen — Food Requests (P2P)
  foodRequests: FoodRequest[];
  myFoodRequests: FoodRequest[];        // requests I posted
  openFoodRequests: FoodRequest[];      // open requests I can deliver
  myAcceptedDeliveries: FoodRequest[];  // requests I'm delivering
  postFoodRequest: (deliveryAddress: string, instructions: string, deliveryFee: number) => boolean;
  cancelFoodRequest: (requestId: string) => void;
  acceptDeliveryJob: (requestId: string) => void;
  markPickedUp: (requestId: string) => void;
  markDelivered: (requestId: string) => void;

  // Legacy compat
  foodDeliveryJobs: FoodDeliveryJob[];

  // Chat
  chatMessages: ChatMessage[];
  activeChannel: 'general-discussion' | 'mess-updates' | 'announcements';
  setActiveChannel: (channel: 'general-discussion' | 'mess-updates' | 'announcements') => void;
  postChatMessage: (content: string) => void;

  // Carpooling
  carpoolRides: CarpoolRide[];
  carpoolBookings: CarpoolBooking[];
  publishRide: (ride: Omit<CarpoolRide, 'id' | 'driverName' | 'driverRole' | 'status' | 'isOfferedByMe'>) => void;
  requestSeat: (rideId: string) => void;
  cancelBooking: (bookingId: string) => void;
  cancelOfferedRide: (rideId: string) => void;

  // Services
  campusServices: CampusService[];
  serviceRequests: ServiceRequest[];
  publishService: (service: Omit<CampusService, 'id' | 'providerName' | 'providerHostel' | 'rating' | 'reviewsCount'>) => void;
  bookService: (serviceId: string, notes: string, date: string) => void;

  // Marketplace
  marketplaceItems: MarketplaceItem[];
  publishMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'sellerName' | 'sellerRating' | 'sellerReviewsCount' | 'status' | 'createdAt'>) => void;
  buyMarketplaceItem: (itemId: string) => boolean;
  changeMarketplaceItemStatus: (itemId: string, newStatus: 'Available' | 'Reserved' | 'Sold') => void;
  deleteMarketplaceItem: (itemId: string) => void;

  // Lost & Found
  lostReports: LostItemReport[];
  foundReports: FoundItemReport[];
  potentialMatches: PotentialMatch[];
  claims: LostFoundClaim[];
  custodyRecords: SecurityCustodyRecord[];
  reportLostItem: (data: Omit<LostItemReport, 'id' | 'reporterName' | 'reporterEmail' | 'securityLevel' | 'status' | 'createdAt'>) => LostItemReport;
  reportFoundItem: (data: Omit<FoundItemReport, 'id' | 'finderName' | 'finderEmail' | 'securityLevel' | 'status' | 'createdAt'>) => FoundItemReport;
  submitClaim: (foundItemId: string, answers: { question: string; answer: string }[], evidencePhotoUrl?: string, notes?: string) => boolean;
  reviewClaim: (claimId: string, status: 'Approved' | 'Rejected' | 'Additional Evidence Requested' | 'Disputed', reviewerName: string) => void;
  confirmSecurityIntake: (foundItemId: string, storageLocker: string, conditionNotes: string, staffName: string, secondaryStaffName?: string) => void;
  verifyAndCollectHandover: (foundItemId: string, claimId: string, otpInput: string, staffName: string) => boolean;
  closeLostReport: (reportId: string) => void;
  closeFoundReport: (reportId: string) => void;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const initialCampusServices: CampusService[] = [
  {
    id: 'SRV-1',
    title: 'Data Structures & Algorithms 1-on-1 Tutoring',
    category: 'Academic Tutoring',
    description: 'Personalized DSA mentoring, exam prep, and LeetCode problem solving for B.Tech CSE students.',
    providerName: 'Rahul Sharma (Student A)',
    providerHostel: 'Hostel 2 (Vasishta)',
    price: 150,
    pricingModel: 'Hourly',
    rating: 5.0,
    reviewsCount: 1,
    availability: 'Mon, Wed, Fri (5:00 PM - ...)',
  },
  {
    id: 'SRV-2',
    title: 'Acoustic Guitar Lessons for Beginners',
    category: 'Extracurricular & Skill Tutoring',
    description: 'Learn basic chords, fingerpicking, strumming patterns, and popular song chords in 4 weeks.',
    providerName: 'Rahul Sharma (Student A)',
    providerHostel: 'Hostel 2 (Vasishta)',
    price: 200,
    pricingModel: 'Hourly',
    rating: 5.0,
    reviewsCount: 1,
    availability: 'Tue, Thu, Sat (6:00 PM - ...)',
  },
  {
    id: 'SRV-3',
    title: 'Laptop OS Formatting & Software Installation',
    category: 'Technical Assistance',
    description: 'Clean OS installation (Windows/Ubuntu), driver configuration, MATLAB/VSCode setup, and anti-virus cleanup.',
    providerName: 'Sneha Patel (Student B)',
    providerHostel: 'Hostel 4 (Gargi)',
    price: 250,
    pricingModel: 'Fixed',
    rating: 4.8,
    reviewsCount: 9,
    availability: 'Everyday 5:00 PM - 8:3...',
  },
  {
    id: 'SRV-4',
    title: 'Hostel Desk Lamp & Small Appliance Repair',
    category: 'Electrical Repair',
    description: 'Fixing loose wires, replacing plug heads, and lamp switch repairs. Note: High-voltage or mains electrical issues must be escalated to the Warden/Campus Maintenance Office.',
    providerName: 'Sneha Patel (Student B)',
    providerHostel: 'Hostel 4 (Gargi)',
    price: 100,
    pricingModel: 'Fixed',
    rating: 4.8,
    reviewsCount: 9,
    availability: '',
  },
  {
    id: 'SRV-5',
    title: 'Hostel Room Switch & Socket Maintenance Helper',
    category: 'Maintenance',
    description: 'Assistance with basic non-hazardous hostel room fixture checks. Note: Major room repairs require official Warden maintenance request.',
    providerName: 'Sneha Patel (Student B)',
    providerHostel: 'Hostel 4 (Gargi)',
    price: 80,
    pricingModel: 'Fixed',
    rating: 4.8,
    reviewsCount: 9,
    availability: '',
  },
  {
    id: 'SRV-6',
    title: 'Custom Department T-Shirts & Campus Merch Printing',
    category: 'Student Businesses',
    description: 'Bulk or custom individual t-shirt printing, hoodies, and batch stickers for club events or fests.',
    providerName: 'Anish Kumar',
    providerHostel: 'Hostel 1 (Agastya)',
    price: 350,
    pricingModel: 'Negotiable',
    rating: 5.0,
    reviewsCount: 6,
    availability: '',
  }
];

const initialServiceRequests: ServiceRequest[] = [
  {
    id: 'SRV-REQ-31920',
    requestNumber: 'SRV-REQ-31920',
    serviceTitle: 'DSA Mentoring Test',
    providerName: 'Rahul Sharma (Student A)',
    providerHostel: 'Hostel 2 (Vasishta)',
    providerPhone: '+91 98765 43210',
    appointmentDate: '2026-10-18 at 16:00',
    customerNotes: '"Need help with graph algorithms"',
    price: 150,
    pricingModel: 'Hourly',
    status: 'Completed',
    reviewedScore: 5,
    requestedAt: '10/10/2026'
  }
];

const initialMarketplaceItems: MarketplaceItem[] = [
  {
    id: 'MKT-1',
    title: 'Casio fx-991EX Classwiz Scientific Calculator',
    category: 'Electronics & Gadgets',
    condition: 'Like New',
    sellingPrice: 800,
    originalPrice: 1200,
    pickupLocation: 'Hostel Block 2, Room 314',
    description: 'Used for 2 semesters, perfect condition, no scratches.',
    sellerName: 'Rahul Verma (4th Yr ECE)',
    sellerRating: 4.8,
    sellerReviewsCount: 22,
    status: 'Available',
    createdAt: '2026-10-10'
  },
  {
    id: 'MKT-2',
    title: 'Logitech MK270 Wireless Keyboard & Mouse Combo',
    category: 'Electronics & Gadgets',
    condition: 'Brand New',
    sellingPrice: 750,
    pickupLocation: 'South Campus Student Centre',
    description: 'Unopened box.',
    sellerName: 'Sneha Nair (2nd Yr CSE)',
    sellerRating: 4.7,
    sellerReviewsCount: 9,
    status: 'Available',
    createdAt: '2026-10-09'
  },
  {
    id: 'MKT-3',
    title: 'Advanced Engineering Mathematics (10th Ed)',
    category: 'Books & Study',
    condition: 'Like New',
    sellingPrice: 450,
    originalPrice: 850,
    pickupLocation: 'Central Library Portico',
    description: 'No markings or folded pages.',
    sellerName: 'Rahul Verma (4th Yr ECE)',
    sellerRating: 4.8,
    sellerReviewsCount: 22,
    status: 'Available',
    createdAt: '2026-10-08'
  },
  {
    id: 'item-101',
    title: 'Lays Classic Salted Potato Chips (50g)',
    category: 'Hostel Essentials',
    condition: 'Brand New',
    sellingPrice: 45,
    pickupLocation: 'Gargi Hostel (Block A), Room A-201',
    description: 'Extra packets',
    sellerName: 'Sneha Patel (Student B)',
    sellerRating: 4.9,
    sellerReviewsCount: 16,
    status: 'Available',
    createdAt: '2026-10-09'
  },
  {
    id: 'item-102',
    title: 'Doritos Cheese Supreme Tortilla Chips',
    category: 'Hostel Essentials',
    condition: 'Brand New',
    sellingPrice: 35,
    pickupLocation: 'Gargi Hostel (Block A), Room A-201',
    description: 'Extra packets',
    sellerName: 'Sneha Patel (Student B)',
    sellerRating: 4.9,
    sellerReviewsCount: 16,
    status: 'Available',
    createdAt: '2026-10-10'
  },
  {
    id: 'item-106',
    title: 'Digital Multimeter + Breadboard Kit + Jumper Wires',
    category: 'Lab Kits & Tools',
    condition: 'Fair',
    sellingPrice: 550,
    pickupLocation: 'ECE Dept Quadrangle',
    description: 'Working fine',
    sellerName: 'Sneha Patel (Student B)',
    sellerRating: 4.9,
    sellerReviewsCount: 16,
    status: 'Sold',
    createdAt: '2026-10-01'
  }
];

const initialCanteens: CampusCanteen[] = [
  { id: 'cant-1', name: 'Main Canteen', location: 'Main Academic Block', icon: '🍱', lastUploaded: 'Today at 09:15 AM', uploadedBy: 'Ananya R.' },
  { id: 'cant-2', name: 'IT Block Canteen', location: 'IT & Engineering Block', icon: '🥪', lastUploaded: 'Yesterday at 04:30 PM', uploadedBy: 'Pooja K.' },
  { id: 'cant-3', name: 'MBA Canteen', location: 'MBA Block', icon: '☕', lastUploaded: '10 October 2026 at 10:06 PM', uploadedBy: 'Rahul Sharma (Student A)' },
];

const initialCanteenItems: CanteenItem[] = [
  // Beverages
  { id: 'NC-1', title: 'Special Cold Brew', category: 'Beverages', price: 70, prepTime: '5 mins', isAvailable: true, aiVerifiedScore: 98.5, categoryBadge: 'Beverages', canteenId: 'cant-3' },
  { id: 'NC-4', title: 'Iced Caramel Cold Coffee', category: 'Beverages', price: 45, prepTime: '5 mins', isAvailable: true, aiVerifiedScore: 97.8, categoryBadge: 'Beverages', canteenId: 'cant-3' },
  { id: 'NC-5', title: 'Masala Chai', category: 'Beverages', price: 15, prepTime: '3 mins', isAvailable: true, aiVerifiedScore: 99.9, categoryBadge: 'Beverages', canteenId: 'cant-2' },
  { id: 'NC-12', title: 'Mango Lassi', category: 'Beverages', price: 40, prepTime: '4 mins', isAvailable: true, aiVerifiedScore: 98.8, categoryBadge: 'Beverages', canteenId: 'cant-1' },
  { id: 'NC-13', title: 'Filter Coffee', category: 'Beverages', price: 20, prepTime: '3 mins', isAvailable: true, aiVerifiedScore: 99.1, categoryBadge: 'Beverages', canteenId: 'cant-1' },
  { id: 'NC-14', title: 'Fresh Lime Soda', category: 'Beverages', price: 30, prepTime: '4 mins', isAvailable: true, aiVerifiedScore: 96.5, categoryBadge: 'Beverages', canteenId: 'cant-2' },
  
  // Snacks
  { id: 'NC-2', title: 'Paneer Cheese Butter Roll', category: 'Snacks', price: 75, prepTime: '10 mins', isAvailable: true, aiVerifiedScore: 98.5, categoryBadge: 'Snacks', canteenId: 'cant-1' },
  { id: 'NC-3', title: 'Double Egg Cheese Maggi', category: 'Snacks', price: 50, prepTime: '8 mins', isAvailable: true, aiVerifiedScore: 99.1, categoryBadge: 'Snacks', canteenId: 'cant-1' },
  { id: 'NC-11', title: 'Crispy Veg Spring Rolls', category: 'Snacks', price: 55, prepTime: '8 mins', isAvailable: true, aiVerifiedScore: 97.5, categoryBadge: 'Snacks', canteenId: 'cant-2' },
  { id: 'NC-15', title: 'Chicken Tikka Wrap', category: 'Snacks', price: 85, prepTime: '12 mins', isAvailable: true, aiVerifiedScore: 98.2, categoryBadge: 'Snacks', canteenId: 'cant-3' },
  { id: 'NC-16', title: 'Peri Peri French Fries', category: 'Snacks', price: 60, prepTime: '6 mins', isAvailable: true, aiVerifiedScore: 97.9, categoryBadge: 'Snacks', canteenId: 'cant-1' },
  { id: 'NC-17', title: 'Samosa Chaat', category: 'Snacks', price: 40, prepTime: '5 mins', isAvailable: true, aiVerifiedScore: 99.0, categoryBadge: 'Snacks', canteenId: 'cant-2' },
  
  // Breakfast
  { id: 'NC-6', title: 'Veg Sandwich', category: 'Breakfast', price: 35, prepTime: '6 mins', isAvailable: true, aiVerifiedScore: 97.2, categoryBadge: 'Breakfast', canteenId: 'cant-2' },
  { id: 'NC-7', title: 'Aloo Paratha', category: 'Breakfast', price: 40, prepTime: '12 mins', isAvailable: true, aiVerifiedScore: 98.0, categoryBadge: 'Breakfast', canteenId: 'cant-1' },
  { id: 'NC-18', title: 'Masala Dosa', category: 'Breakfast', price: 55, prepTime: '8 mins', isAvailable: true, aiVerifiedScore: 98.7, categoryBadge: 'Breakfast', canteenId: 'cant-1' },
  { id: 'NC-19', title: 'Idli Vada Combo', category: 'Breakfast', price: 45, prepTime: '4 mins', isAvailable: true, aiVerifiedScore: 99.4, categoryBadge: 'Breakfast', canteenId: 'cant-2' },
  { id: 'NC-20', title: 'Poha with Sev', category: 'Breakfast', price: 30, prepTime: '3 mins', isAvailable: true, aiVerifiedScore: 97.1, categoryBadge: 'Breakfast', canteenId: 'cant-3' },
  
  // Lunch / Meals
  { id: 'NC-8', title: 'Veg Fried Rice', category: 'Lunch', price: 60, prepTime: '10 mins', isAvailable: true, aiVerifiedScore: 96.5, categoryBadge: 'Lunch', canteenId: 'cant-1' },
  { id: 'NC-9', title: 'Paneer Butter Masala', category: 'Lunch', price: 90, prepTime: '15 mins', isAvailable: true, aiVerifiedScore: 97.0, categoryBadge: 'Lunch', canteenId: 'cant-2' },
  { id: 'NC-21', title: 'Chicken Biryani', category: 'Lunch', price: 120, prepTime: '20 mins', isAvailable: true, aiVerifiedScore: 98.5, categoryBadge: 'Lunch', canteenId: 'cant-1' },
  { id: 'NC-22', title: 'Veg Thali (Mini)', category: 'Lunch', price: 70, prepTime: '5 mins', isAvailable: true, aiVerifiedScore: 99.2, categoryBadge: 'Lunch', canteenId: 'cant-2' },
  { id: 'NC-23', title: 'Chole Bhature', category: 'Lunch', price: 65, prepTime: '10 mins', isAvailable: true, aiVerifiedScore: 97.8, categoryBadge: 'Lunch', canteenId: 'cant-3' },
  
  // Desserts
  { id: 'NC-10', title: 'Chocolate Ice Cream', category: 'Desserts', price: 30, prepTime: '2 mins', isAvailable: true, aiVerifiedScore: 99.5, categoryBadge: 'Desserts', canteenId: 'cant-3' },
  { id: 'NC-24', title: 'Gulab Jamun (2 pcs)', category: 'Desserts', price: 40, prepTime: '2 mins', isAvailable: true, aiVerifiedScore: 99.8, categoryBadge: 'Desserts', canteenId: 'cant-1' },
  { id: 'NC-25', title: 'Warm Chocolate Brownie', category: 'Desserts', price: 55, prepTime: '3 mins', isAvailable: true, aiVerifiedScore: 98.4, categoryBadge: 'Desserts', canteenId: 'cant-2' },
];

// Seed open requests from "another student" so Deliver page isn't empty
const initialFoodRequests: FoodRequest[] = [
  {
    id: 'FR-SEED-1',
    requestNumber: '#REQ-P2P-5821',
    requesterName: 'Rahul Sharma (Student A)',
    requesterRoom: 'Hostel 3, Room 201',
    canteenId: 'cant-3',
    canteenName: 'MBA Canteen',
    canteenLocation: 'MBA Block',
    items: [{ title: 'Special Cold Brew', price: 70, quantity: 1 }, { title: 'Iced Caramel Cold Coffee', price: 45, quantity: 2 }],
    deliveryAddress: 'Hostel 3, Room 201',
    instructions: 'Please knock twice. Keep the drinks cold.',
    foodSubtotal: 160,
    deliveryFee: 25,
    totalAmount: 185,
    status: 'Open',
    postedAt: 'Today at 12:45 PM',
  },
  {
    id: 'FR-SEED-2',
    requestNumber: '#REQ-P2P-4903',
    requesterName: 'Ananya R.',
    requesterRoom: 'Gargi A-201',
    canteenId: 'cant-1',
    canteenName: 'Main Canteen',
    canteenLocation: 'Main Academic Block',
    items: [{ title: 'Paneer Cheese Butter Roll', price: 75, quantity: 1 }],
    deliveryAddress: 'Gargi Block A, Room 201',
    instructions: '',
    foodSubtotal: 75,
    deliveryFee: 15,
    totalAmount: 90,
    status: 'Open',
    postedAt: 'Today at 01:10 PM',
  },
];

const initialParcels: Parcel[] = [
  { id: 'P-101', trackingNumber: 'AMZ-8849-IN', courier: 'Amazon Logistics', arrivalGate: 'Main Gate Central Vault', destinationHostel: 'Gargi Hostel (Block A)', destinationRoom: 'A-204', recipientName: 'Hamshitha R.', status: 'Awaiting Delivery', reward: 20, otp: '4829', dateAdded: 'Today, 10:15 AM' },
  { id: 'P-102', trackingNumber: 'FLP-9032-IN', courier: 'Flipkart Express', arrivalGate: 'South Gate Counter', destinationHostel: 'Gargi Hostel (Block A)', destinationRoom: 'A-108', recipientName: 'Hamshitha R.', status: 'Awaiting Delivery', reward: 25, otp: '7193', dateAdded: 'Today, 11:30 AM' },
];

const initialSnacks: Snack[] = [
  { id: 'S-1', title: 'Homemade Chocolate Walnut Brownies', category: 'Homemade Treats', price: 45, seller: 'Ananya R.', pickupLocation: 'Gargi Hostel (Block A), Room A-201', availableQty: 4, iconType: 'brownie', dateAdded: 'Today' },
  { id: 'S-2', title: 'Korean Spicy Cheese Buldak Noodles', category: 'Instant Noodles', price: 60, seller: 'Sneha M.', pickupLocation: 'Gargi Hostel (Block B), Room B-305', availableQty: 3, iconType: 'noodles', dateAdded: 'Today' },
];

const initialChatMessages: ChatMessage[] = [
  { id: 'MSG-1', author: 'Warden Office (Gargi)', roleInfo: 'Main Office', badgeText: 'OFFICIAL NOTICE', badgeType: 'official', timestamp: 'Today, 09:30 AM', channel: 'general-discussion', content: 'Important Notice: Mess maintenance scheduled tomorrow 3-4 PM. Hot water supply will resume normally at 5 PM.', isNotice: true },
  { id: 'MSG-2', author: 'Ananya R.', roleInfo: 'A-201', timestamp: 'Today, 11:15 AM', channel: 'general-discussion', content: 'Anyone has an extra Type-C charger in Gargi Block A right now? Need urgently for study prep!' },
];

const initialCarpoolRides: CarpoolRide[] = [
  { id: 'RIDE-1', origin: 'Campus Main Gate', destination: 'Railway Station', driverName: 'Rahul Sharma (Student A)', driverRole: 'Student A', vehicleType: 'Own Car', date: '2026-10-15', time: '10:00', availableSeats: 2, totalSeats: 3, pricePerSeat: 150, status: 'AVAILABLE' },
  { id: 'RIDE-2', origin: 'Airport', destination: 'Campus Hostel 3', driverName: 'Sneha Patel (Student B)', driverRole: 'Student B', vehicleType: 'Taxi', date: '2026-10-16', time: '18:30', availableSeats: 2, totalSeats: 2, pricePerSeat: 300, status: 'AVAILABLE', isOfferedByMe: true },
];

const initialCarpoolBookings: CarpoolBooking[] = [
  { id: 'BOOK-1', rideId: 'RIDE-1', rideTitle: 'Campus Main Gate → Railway Station', driverName: 'Rahul Sharma (Student A)', schedule: '2026-10-15 @ 10:00', vehicleType: 'Own Car', price: 150, status: 'ACCEPTED' },
];

// ─── Context ─────────────────────────────────────────────────────────────────

const PlexusContext = createContext<PlexusContextType | null>(null);

export function PlexusProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState('Alex Rivera');
  const [userRollNumber, setUserRollNumber] = useState('CB.EN.U4CSE23101');
  const [userBranchYear, setUserBranchYear] = useState('3rd Yr CSE');
  const [userEmail, setUserEmail] = useState('alex.rivera@amrita.edu');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [userHostel, setUserHostel] = useState('Gargi Hostel (Block A)');
  const [userRoom, setUserRoom] = useState('Room A-201');
  const [userEmergencyContact, setUserEmergencyContact] = useState('+91 98765 12345');
  
  // Profile Ratings & Reputation Space
  const [userRating] = useState(4.9);
  const [userRatingCount] = useState(38);
  const [parcelDeliveryScore] = useState(98); // 98% Positive Deliveries
  const [foodDeliveryScore] = useState(100); // 100% On-time Food Deliveries
  const [servicesRating] = useState(5.0); // 5.0 Star Tutor/Repair Rating
  const [marketplaceRating] = useState(4.9); // 4.9 Star Seller Rating

  const [walletBalance, setWalletBalance] = useState(2450);

  const updateUserProfile = (data: Partial<{
    userName: string;
    userRollNumber: string;
    userBranchYear: string;
    userEmail: string;
    userPhone: string;
    userHostel: string;
    userRoom: string;
    userEmergencyContact: string;
  }>) => {
    if (data.userName) setUserName(data.userName);
    if (data.userRollNumber) setUserRollNumber(data.userRollNumber);
    if (data.userBranchYear) setUserBranchYear(data.userBranchYear);
    if (data.userEmail) setUserEmail(data.userEmail);
    if (data.userPhone) setUserPhone(data.userPhone);
    if (data.userHostel) setUserHostel(data.userHostel);
    if (data.userRoom) setUserRoom(data.userRoom);
    if (data.userEmergencyContact) setUserEmergencyContact(data.userEmergencyContact);
    toast.success('Profile details updated successfully!');
  };

  const [parcels, setParcels] = useState<Parcel[]>(initialParcels);
  const [snacks, setSnacks] = useState<Snack[]>(initialSnacks);

  const [canteens] = useState<CampusCanteen[]>(initialCanteens);
  const [selectedCanteenId, setSelectedCanteenId] = useState('cant-3');
  const [canteenItems, setCanteenItems] = useState<CanteenItem[]>(initialCanteenItems);
  const [isScanningMenu, setIsScanningMenu] = useState(false);

  // Real cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Food requests state
  const [foodRequests, setFoodRequests] = useState<FoodRequest[]>(initialFoodRequests);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [activeChannel, setActiveChannel] = useState<'general-discussion' | 'mess-updates' | 'announcements'>('general-discussion');

  const [carpoolRides, setCarpoolRides] = useState<CarpoolRide[]>(initialCarpoolRides);
  const [carpoolBookings, setCarpoolBookings] = useState<CarpoolBooking[]>(initialCarpoolBookings);

  const [campusServices, setCampusServices] = useState<CampusService[]>(initialCampusServices);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(initialServiceRequests);

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(initialMarketplaceItems);

  // ── Derived values ──────────────────────────────────────────────────────────

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Requests I posted
  const myFoodRequests = foodRequests.filter(r => r.requesterName === userName);

  // Open requests from others I can deliver
  const openFoodRequests = foodRequests.filter(
    r => r.status === 'Open' && r.requesterName !== userName
  );

  // Requests I'm actively delivering
  const myAcceptedDeliveries = foodRequests.filter(
    r => r.delivererName === userName && r.status !== 'Delivered' && r.status !== 'Cancelled'
  );

  // Legacy compat
  const foodDeliveryJobs: FoodDeliveryJob[] = foodRequests
    .filter(r => r.delivererName === userName)
    .map(r => ({
      id: r.id,
      orderNumber: r.requestNumber,
      deliveryLocation: r.deliveryAddress,
      customerName: r.requesterName,
      feeEarned: r.deliveryFee,
      status: r.status === 'Delivered' ? 'Completed' : 'In Progress',
    }));

  // ── Wallet ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const saved = localStorage.getItem('plexus_wallet_balance');
    if (saved) setWalletBalance(parseFloat(saved));
  }, []);

  const saveWallet = (bal: number) => {
    setWalletBalance(bal);
    localStorage.setItem('plexus_wallet_balance', bal.toString());
  };

  const addWalletFunds = (amount: number) => {
    saveWallet(walletBalance + amount);
    toast.success(`₹${amount} added to your E-Wallet!`);
  };

  const deductWalletFunds = (amount: number, reason: string): boolean => {
    if (walletBalance < amount) {
      toast.error(`Insufficient balance! You have ₹${walletBalance}, need ₹${amount}.`);
      return false;
    }
    saveWallet(walletBalance - amount);
    toast.success(`Paid ₹${amount} for ${reason} via E-Wallet.`);
    return true;
  };

  // ── Cart ────────────────────────────────────────────────────────────────────

  const addToCart = (item: CanteenItem, canteenId: string, canteenName: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        toast.success(`${item.title} quantity updated in cart!`);
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      toast.success(`Added ${item.title} (₹${item.price}) to cart!`);
      return [...prev, { id: item.id, title: item.title, price: item.price, quantity: 1, canteenId, canteenName }];
    });
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(c => c.id === itemId ? { ...c, quantity: c.quantity + delta } : c)
        .filter(c => c.quantity > 0)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.id !== itemId));
    toast.info('Item removed from cart.');
  };

  const clearCart = () => setCart([]);

  // ── Food Requests ───────────────────────────────────────────────────────────

  const postFoodRequest = (deliveryAddress: string, instructions: string, deliveryFee: number): boolean => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return false;
    }
    const total = cartTotal + deliveryFee;
    const success = deductWalletFunds(total, 'P2P Food Delivery Request');
    if (!success) return false;

    const activeCanteen = canteens.find(c => c.id === cart[0].canteenId) || canteens[0];
    const reqNum = `#REQ-P2P-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: FoodRequest = {
      id: `FR-${Date.now()}`,
      requestNumber: reqNum,
      requesterName: userName,
      requesterRoom: userRoom,
      canteenId: activeCanteen.id,
      canteenName: activeCanteen.name,
      canteenLocation: activeCanteen.location,
      items: cart.map(c => ({ title: c.title, price: c.price, quantity: c.quantity })),
      deliveryAddress,
      instructions,
      foodSubtotal: cartTotal,
      deliveryFee,
      totalAmount: total,
      status: 'Open',
      postedAt: 'Just now',
    };

    setFoodRequests(prev => [newRequest, ...prev]);
    clearCart();
    toast.success(`🍕 Request ${reqNum} posted! Waiting for a peer deliverer.`);
    return true;
  };

  const cancelFoodRequest = (requestId: string) => {
    setFoodRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      // Refund
      addWalletFunds(r.totalAmount);
      return { ...r, status: 'Cancelled' };
    }));
    toast.info('Food request cancelled. Refund added to wallet.');
  };

  const acceptDeliveryJob = (requestId: string) => {
    setFoodRequests(prev => prev.map(r =>
      r.id === requestId
        ? { ...r, status: 'Accepted', delivererName: userName, acceptedAt: 'Just now' }
        : r
    ));
    toast.success('🏃 Delivery accepted! Head to the canteen to pick up the order.');
  };

  const markPickedUp = (requestId: string) => {
    setFoodRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status: 'Picked Up' } : r
    ));
    toast.success('✅ Marked as picked up! Now deliver to the address.');
  };

  const markDelivered = (requestId: string) => {
    const req = foodRequests.find(r => r.id === requestId);
    if (!req) return;
    setFoodRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status: 'Delivered', deliveredAt: 'Just now' } : r
    ));
    addWalletFunds(req.deliveryFee);
    toast.success(`🎉 Delivered! ₹${req.deliveryFee} delivery fee credited to your wallet!`);
  };

  // ── AI Menu Scan ────────────────────────────────────────────────────────────

  const scanMenuFromImage = async (imageName: string) => {
    setIsScanningMenu(true);
    toast.info('🤖 AI Vision OCR scanning canteen blackboard menu...');

    await new Promise(res => setTimeout(res, 2000));

    const extracted: CanteenItem[] = [
      {
        id: `NC-EX-${Date.now()}-1`,
        title: 'Crispy Veg Schezwan Noodles',
        category: 'Snacks',
        price: 55,
        prepTime: '12 mins',
        isAvailable: true,
        aiVerifiedScore: 99.4,
        categoryBadge: 'Snacks',
        canteenId: selectedCanteenId,
      },
      {
        id: `NC-EX-${Date.now()}-2`,
        title: 'Butter Garlic Bread Toast',
        category: 'Breakfast',
        price: 30,
        prepTime: '5 mins',
        isAvailable: true,
        aiVerifiedScore: 98.1,
        categoryBadge: 'Breakfast',
        canteenId: selectedCanteenId,
      },
    ];

    const activeCanteen = canteens.find(c => c.id === selectedCanteenId);
    setCanteenItems(prev => [...extracted, ...prev]);

    // Update canteen's lastUploaded (would be done via API in prod)
    setIsScanningMenu(false);
    toast.success(`✨ OCR Model v2.4 extracted ${extracted.length} new dishes for ${activeCanteen?.name}!`);
  };

  // ── Parcels ─────────────────────────────────────────────────────────────────

  const addParcel = (newP: Omit<Parcel, 'id' | 'dateAdded' | 'status'>) => {
    const created: Parcel = {
      ...newP,
      id: `P-${Date.now().toString().slice(-3)}`,
      status: 'Awaiting Delivery',
      dateAdded: 'Just now',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
    };
    setParcels(prev => [created, ...prev]);
    toast.success(`Parcel ${created.trackingNumber} registered & delivery requested!`);
  };

  const acceptDelivery = (parcelId: string) => {
    setParcels(prev =>
      prev.map(p => p.id === parcelId ? { ...p, status: 'In Transit', delivererName: userName } : p)
    );
    toast.success('Accepted parcel delivery task!');
  };

  const completeDelivery = (parcelId: string, otp: string): boolean => {
    const target = parcels.find(p => p.id === parcelId);
    if (!target) return false;
    if (target.otp && target.otp !== otp.trim()) {
      toast.error('Invalid OTP! Please check with recipient.');
      return false;
    }
    setParcels(prev => prev.map(p => p.id === parcelId ? { ...p, status: 'Delivered' } : p));
    addWalletFunds(target.reward);
    toast.success(`Delivery completed! ₹${target.reward} reward credited.`);
    return true;
  };

  // ── Snacks ──────────────────────────────────────────────────────────────────

  const addSnack = (newS: Omit<Snack, 'id' | 'dateAdded'>) => {
    const created: Snack = { ...newS, id: `S-${Date.now().toString().slice(-3)}`, dateAdded: 'Just now' };
    setSnacks(prev => [created, ...prev]);
    toast.success(`Listed "${created.title}" in Student Snacks Pantry!`);
  };

  const buySnack = (snackId: string): boolean => {
    const snack = snacks.find(s => s.id === snackId);
    if (!snack || snack.availableQty <= 0) { toast.error('Item out of stock!'); return false; }
    const success = deductWalletFunds(snack.price, snack.title);
    if (!success) return false;
    setSnacks(prev => prev.map(s => s.id === snackId ? { ...s, availableQty: s.availableQty - 1 } : s));
    return true;
  };

  // ── Chat ────────────────────────────────────────────────────────────────────

  const postChatMessage = (content: string) => {
    if (!content.trim()) return;
    const msg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      author: userName,
      roleInfo: userRoom,
      timestamp: 'Just now',
      channel: activeChannel,
      content: content.trim(),
    };
    setChatMessages(prev => [...prev, msg]);
    toast.success('Posted message to #' + activeChannel);
  };

  // ── Carpooling ──────────────────────────────────────────────────────────────

  const publishRide = (newRide: Omit<CarpoolRide, 'id' | 'driverName' | 'driverRole' | 'status' | 'isOfferedByMe'>) => {
    const ride: CarpoolRide = {
      ...newRide,
      id: `RIDE-${Date.now().toString().slice(-4)}`,
      driverName: userName,
      driverRole: 'Student B',
      status: 'AVAILABLE',
      isOfferedByMe: true,
    };
    setCarpoolRides(prev => [ride, ...prev]);
    toast.success(`Published carpool ride: ${ride.origin} → ${ride.destination}`);
  };

  const requestSeat = (rideId: string) => {
    const ride = carpoolRides.find(r => r.id === rideId);
    if (!ride || ride.availableSeats <= 0) return;
    setCarpoolRides(prev => prev.map(r => r.id === rideId ? { ...r, availableSeats: r.availableSeats - 1 } : r));
    const booking: CarpoolBooking = {
      id: `BOOK-${Date.now().toString().slice(-4)}`,
      rideId,
      rideTitle: `${ride.origin} → ${ride.destination}`,
      driverName: ride.driverName,
      schedule: `${ride.date} @ ${ride.time}`,
      vehicleType: ride.vehicleType,
      price: ride.pricePerSeat,
      status: 'ACCEPTED',
    };
    setCarpoolBookings(prev => [booking, ...prev]);
    toast.success(`Requested seat for ${ride.origin} → ${ride.destination}!`);
  };

  const cancelBooking = (bookingId: string) => {
    const booking = carpoolBookings.find(b => b.id === bookingId);
    if (booking) {
      setCarpoolRides(prev => prev.map(r => r.id === booking.rideId ? { ...r, availableSeats: r.availableSeats + 1 } : r));
    }
    setCarpoolBookings(prev => prev.filter(b => b.id !== bookingId));
    toast.info('Cancelled booking.');
  };

  const cancelOfferedRide = (rideId: string) => {
    setCarpoolRides(prev => prev.filter(r => r.id !== rideId));
    toast.info('Cancelled offered ride.');
  };

  // ── Services ────────────────────────────────────────────────────────────────

  const publishService = (service: Omit<CampusService, 'id' | 'providerName' | 'providerHostel' | 'rating' | 'reviewsCount'>) => {
    const newService: CampusService = {
      ...service,
      id: `SRV-${Date.now()}`,
      providerName: userName,
      providerHostel: userHostel,
      rating: 0,
      reviewsCount: 0,
    };
    setCampusServices(prev => [newService, ...prev]);
    toast.success(`Published your service listing: "${service.title}"`);
  };

  const bookService = (serviceId: string, notes: string, date: string) => {
    const service = campusServices.find(s => s.id === serviceId);
    if (!service) return;

    const newReq: ServiceRequest = {
      id: `REQ-${Date.now()}`,
      requestNumber: `SRV-REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      serviceTitle: service.title,
      providerName: service.providerName,
      providerHostel: service.providerHostel,
      providerPhone: '+91 90000 00000', // Mock
      appointmentDate: date,
      customerNotes: notes,
      price: service.price,
      pricingModel: service.pricingModel,
      status: 'Pending',
      requestedAt: new Date().toLocaleDateString('en-GB'),
    };
    setServiceRequests(prev => [newReq, ...prev]);
    toast.success(`Service request sent to ${service.providerName}!`);
  };

  // ── Marketplace ─────────────────────────────────────────────────────────────
  
  const publishMarketplaceItem = (item: Omit<MarketplaceItem, 'id' | 'sellerName' | 'sellerRating' | 'sellerReviewsCount' | 'status' | 'createdAt'>) => {
    const newItem: MarketplaceItem = {
      ...item,
      id: `MKT-${Date.now()}`,
      sellerName: userName,
      sellerRating: 5.0,
      sellerReviewsCount: 0,
      status: 'Available',
      createdAt: new Date().toLocaleDateString('en-GB'),
    };
    setMarketplaceItems(prev => [newItem, ...prev]);
    toast.success(`Item "${item.title}" posted for sale!`);
  };

  const buyMarketplaceItem = (itemId: string): boolean => {
    const item = marketplaceItems.find(i => i.id === itemId);
    if (!item || item.status !== 'Available') return false;

    const success = deductWalletFunds(item.sellingPrice, `Purchase: ${item.title}`);
    if (!success) return false;

    setMarketplaceItems(prev => prev.map(i => i.id === itemId ? { ...i, status: 'Sold' } : i));
    toast.success(`Successfully bought ${item.title}!`);
    return true;
  };

  const changeMarketplaceItemStatus = (itemId: string, newStatus: 'Available' | 'Reserved' | 'Sold') => {
    setMarketplaceItems(prev => prev.map(i => i.id === itemId ? { ...i, status: newStatus } : i));
    toast.success(`Item status updated to ${newStatus}.`);
  };

  const deleteMarketplaceItem = (itemId: string) => {
    setMarketplaceItems(prev => prev.filter(i => i.id !== itemId));
    toast.info('Item listing deleted.');
  };

  // ── Lost & Found Seed Data & Logic ──────────────────────────────────────────

  const initialLostReports: LostItemReport[] = [
    {
      id: 'LOST-101',
      reporterName: 'Hamshitha',
      reporterEmail: 'hamshitha@amrita.edu',
      category: 'Everyday Belongings',
      itemName: 'Milton Steel Water Bottle (750ml, Blue Cap)',
      description: 'Blue Milton stainless steel water bottle lost near Central Library lawn.',
      lastSeenLocation: 'Central Library Lawn',
      dateLost: '10/10/2026',
      timeLost: '04:30 PM',
      privateFeatures: 'Small scratch on bottom base, red sticker near cap.',
      securityLevel: 1,
      status: 'Reported',
      createdAt: '10/10/2026',
    },
    {
      id: 'LOST-102',
      reporterName: 'Hamshitha',
      reporterEmail: 'hamshitha@amrita.edu',
      category: 'Personal Belongings',
      itemName: 'Casio fx-991EX Scientific Calculator',
      description: 'Casio Classwiz calculator lost in Academic Block 2, Room AB-204.',
      lastSeenLocation: 'Academic Block 2 (Room AB-204)',
      dateLost: '09/10/2026',
      timeLost: '11:15 AM',
      privateFeatures: 'Roll number written in black marker on the back battery door.',
      securityLevel: 2,
      status: 'Potential Match',
      createdAt: '09/10/2026',
    }
  ];

  const initialFoundReports: FoundItemReport[] = [
    {
      id: 'FND-201',
      finderName: 'Vignesh R',
      finderEmail: 'vignesh@amrita.edu',
      category: 'Personal Belongings',
      itemName: 'Casio fx-991EX Classwiz Scientific Calculator',
      description: 'Black Casio scientific calculator left behind on desk in AB-204.',
      foundLocation: 'Academic Block 2, Room AB-204',
      dateFound: '09/10/2026',
      timeFound: '01:00 PM',
      privateCharacteristics: 'Has black marker writing on the back side.',
      custodyLocation: 'With Finder (Vasishta Hostel)',
      securityLevel: 2,
      status: 'Potential Match',
      createdAt: '09/10/2026',
    },
    {
      id: 'FND-202',
      finderName: 'Suresh Kumar',
      finderEmail: 'suresh@amrita.edu',
      category: 'Valuable Electronics',
      itemName: 'Apple iPhone 14 Pro (Space Black)',
      description: 'Valuable smartphone found near Student Canteen outdoor seating area.',
      foundLocation: 'Student Canteen Quadrangle',
      dateFound: '10/10/2026',
      timeFound: '06:45 PM',
      privateCharacteristics: 'Lock screen wallpaper is space shuttle, IMEI ends in 8842.',
      custodyLocation: 'Security Desk (Main Gate)',
      securityLevel: 3,
      status: 'In Custody',
      createdAt: '10/10/2026',
    },
    {
      id: 'FND-203',
      finderName: 'Priya N',
      finderEmail: 'priya@amrita.edu',
      category: 'High-Value & Jewellery',
      itemName: 'Gold Ring with Floral Carving',
      description: 'High value gold ring found near Gargi Hostel quadrangle.',
      foundLocation: 'Gargi Hostel Quadrangle',
      dateFound: '08/10/2026',
      timeFound: '05:20 PM',
      privateCharacteristics: 'Engraved with initials "A.S." inside the band.',
      custodyLocation: 'Security Vault (Admin Office)',
      securityLevel: 5,
      status: 'In Custody',
      createdAt: '08/10/2026',
    },
    {
      id: 'FND-204',
      finderName: 'Security Desk',
      finderEmail: 'security@amrita.edu',
      category: 'Sensitive Items',
      itemName: 'Student Identity Card (College ID)',
      description: 'Amrita Vishwa Vidyapeetham Student ID card found near Library Portico.',
      foundLocation: 'Central Library Portico',
      dateFound: '10/10/2026',
      timeFound: '02:00 PM',
      privateCharacteristics: 'Roll No: CB.EN.U4CSE21045, Department CSE.',
      custodyLocation: 'Security Desk (Main Gate)',
      securityLevel: 4,
      status: 'In Custody',
      createdAt: '10/10/2026',
    }
  ];

  const initialPotentialMatches: PotentialMatch[] = [
    {
      id: 'MTCH-501',
      lostReportId: 'LOST-102',
      foundReportId: 'FND-201',
      matchScore: 94,
      matchReason: 'Category (Personal Belongings), Item Name (Casio fx-991EX), and Location (AB-204) matched.',
      status: 'Pending Verification',
      detectedAt: '09/10/2026',
    }
  ];

  const initialClaims: LostFoundClaim[] = [
    {
      id: 'CLM-301',
      foundItemId: 'FND-201',
      claimantName: 'Hamshitha',
      claimantEmail: 'hamshitha@amrita.edu',
      answers: [
        { question: 'What is the model number of the calculator?', answer: 'Casio fx-991EX Classwiz' },
        { question: 'Describe any identifying marks on the back or cover.', answer: 'My roll number is written in black permanent marker on the back.' },
      ],
      advisoryMatchScore: 94,
      status: 'Under Review',
      submittedAt: '10/10/2026',
    }
  ];

  const initialCustodyRecords: SecurityCustodyRecord[] = [
    {
      id: 'CST-401',
      foundItemId: 'FND-202',
      storageLocker: 'Vault Locker B-04',
      receivingStaffId: 'SEC-88',
      receivingStaffName: 'Officer R. Pillai',
      conditionNotes: 'Good condition, phone power is on, minor edge scratch.',
      intakeTimestamp: '10/10/2026 07:15 PM',
    },
    {
      id: 'CST-402',
      foundItemId: 'FND-203',
      storageLocker: 'Admin Safe Vault-1',
      receivingStaffId: 'SEC-12',
      receivingStaffName: 'Chief Officer M. Sundaram',
      secondaryStaffName: 'Officer R. Pillai',
      conditionNotes: 'Dual authorization intake confirmed. High-value gold ring.',
      intakeTimestamp: '08/10/2026 06:00 PM',
    }
  ];

  const [lostReports, setLostReports] = useState<LostItemReport[]>(initialLostReports);
  const [foundReports, setFoundReports] = useState<FoundItemReport[]>(initialFoundReports);
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>(initialPotentialMatches);
  const [claims, setClaims] = useState<LostFoundClaim[]>(initialClaims);
  const [custodyRecords, setCustodyRecords] = useState<SecurityCustodyRecord[]>(initialCustodyRecords);
  const [userClaimCount24h, setUserClaimCount24h] = useState(1);

  // Auto classification helper
  const determineSecurityLevel = (category: string, itemName: string): SecurityLevel => {
    const combined = (category + ' ' + itemName).toLowerCase();
    if (combined.includes('jewel') || combined.includes('gold') || combined.includes('diamond') || combined.includes('heirloom') || combined.includes('ring')) return 5;
    if (combined.includes('id card') || combined.includes('wallet') || combined.includes('passport') || combined.includes('bank') || combined.includes('key')) return 4;
    if (combined.includes('phone') || combined.includes('laptop') || combined.includes('tablet') || combined.includes('camera') || combined.includes('electronic')) return 3;
    if (combined.includes('headphone') || combined.includes('calculator') || combined.includes('backpack') || combined.includes('watch') || combined.includes('book')) return 2;
    return 1;
  };

  const reportLostItem = (data: Omit<LostItemReport, 'id' | 'reporterName' | 'reporterEmail' | 'securityLevel' | 'status' | 'createdAt'>): LostItemReport => {
    const secLevel = determineSecurityLevel(data.category, data.itemName);
    const newReport: LostItemReport = {
      ...data,
      id: `LOST-${Math.floor(100 + Math.random() * 900)}`,
      reporterName: userName,
      reporterEmail: 'hamshitha@amrita.edu',
      securityLevel: secLevel,
      status: 'Reported',
      createdAt: new Date().toLocaleDateString('en-GB'),
    };

    setLostReports(prev => [newReport, ...prev]);

    // Matching engine check
    foundReports.forEach(f => {
      let score = 0;
      if (f.category.toLowerCase() === data.category.toLowerCase()) score += 40;
      if (f.itemName.toLowerCase().includes(data.itemName.toLowerCase()) || data.itemName.toLowerCase().includes(f.itemName.toLowerCase())) score += 35;
      if (f.foundLocation.toLowerCase().includes(data.lastSeenLocation.toLowerCase()) || data.lastSeenLocation.toLowerCase().includes(f.foundLocation.toLowerCase())) score += 20;

      if (score >= 60) {
        const matchEntry: PotentialMatch = {
          id: `MTCH-${Math.floor(500 + Math.random() * 400)}`,
          lostReportId: newReport.id,
          foundReportId: f.id,
          matchScore: score,
          matchReason: `High category (${data.category}) & description match detected!`,
          status: 'Pending Verification',
          detectedAt: new Date().toLocaleDateString('en-GB'),
        };
        setPotentialMatches(prev => [matchEntry, ...prev]);
        toast.info(`🔍 Potential Match detected (${score}% score) with Found Item #${f.id}!`);
      }
    });

    toast.success(`Lost Item Report #${newReport.id} submitted! Security Level: L${secLevel}`);
    return newReport;
  };

  const reportFoundItem = (data: Omit<FoundItemReport, 'id' | 'finderName' | 'finderEmail' | 'securityLevel' | 'status' | 'createdAt'>): FoundItemReport => {
    const secLevel = determineSecurityLevel(data.category, data.itemName);
    const initialStatus = secLevel >= 3 ? 'Awaiting Secure Deposit' : 'Reported';
    
    const newReport: FoundItemReport = {
      ...data,
      id: `FND-${Math.floor(200 + Math.random() * 800)}`,
      finderName: userName,
      finderEmail: 'hamshitha@amrita.edu',
      securityLevel: secLevel,
      status: initialStatus,
      createdAt: new Date().toLocaleDateString('en-GB'),
    };

    setFoundReports(prev => [newReport, ...prev]);

    // Run matching engine against lost reports
    lostReports.forEach(l => {
      let score = 0;
      if (l.category.toLowerCase() === data.category.toLowerCase()) score += 40;
      if (l.itemName.toLowerCase().includes(data.itemName.toLowerCase()) || data.itemName.toLowerCase().includes(l.itemName.toLowerCase())) score += 35;
      if (l.lastSeenLocation.toLowerCase().includes(data.foundLocation.toLowerCase()) || data.foundLocation.toLowerCase().includes(l.lastSeenLocation.toLowerCase())) score += 20;

      if (score >= 60) {
        const matchEntry: PotentialMatch = {
          id: `MTCH-${Math.floor(500 + Math.random() * 400)}`,
          lostReportId: l.id,
          foundReportId: newReport.id,
          matchScore: score,
          matchReason: `Matching category (${data.category}) and location proximity!`,
          status: 'Pending Verification',
          detectedAt: new Date().toLocaleDateString('en-GB'),
        };
        setPotentialMatches(prev => [matchEntry, ...prev]);
      }
    });

    toast.success(`Found Item Report #${newReport.id} created! Security Level: L${secLevel}`);
    return newReport;
  };

  const submitClaim = (foundItemId: string, answers: { question: string; answer: string }[], evidencePhotoUrl?: string, notes?: string): boolean => {
    if (userClaimCount24h >= 3) {
      toast.error('⚠️ Claim Limit Exceeded: You have reached the maximum limit of 3 claims per 24 hours to prevent fraud.');
      return false;
    }

    const foundItem = foundReports.find(f => f.id === foundItemId);
    if (!foundItem) return false;

    // Check if item already has existing claims (Dispute check)
    const existingClaims = claims.filter(c => c.foundItemId === foundItemId && c.status !== 'Rejected' && c.status !== 'Withdrawn');
    const isDisputed = existingClaims.length >= 1;

    if (isDisputed) {
      setFoundReports(prev => prev.map(f => f.id === foundItemId ? { ...f, status: 'Disputed' } : f));
      toast.warning('⚠️ Multiple claims detected for this item. Item marked as DISPUTED for security desk review.');
    } else {
      setFoundReports(prev => prev.map(f => f.id === foundItemId ? { ...f, status: 'Verification In Progress' } : f));
    }

    const newClaim: LostFoundClaim = {
      id: `CLM-${Math.floor(300 + Math.random() * 700)}`,
      foundItemId,
      claimantName: userName,
      claimantEmail: 'hamshitha@amrita.edu',
      answers,
      evidencePhotoUrl,
      additionalNotes: notes,
      advisoryMatchScore: isDisputed ? 50 : 88,
      status: isDisputed ? 'Disputed' : 'Under Review',
      submittedAt: new Date().toLocaleDateString('en-GB'),
    };

    setClaims(prev => [newClaim, ...prev]);
    setUserClaimCount24h(prev => prev + 1);

    toast.success(`Ownership Claim #${newClaim.id} submitted successfully!`);
    return true;
  };

  const reviewClaim = (claimId: string, status: 'Approved' | 'Rejected' | 'Additional Evidence Requested' | 'Disputed', reviewerName: string) => {
    const targetClaim = claims.find(c => c.id === claimId);
    if (!targetClaim) return;

    let otp: string | undefined = undefined;
    if (status === 'Approved') {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
    }

    setClaims(prev => prev.map(c => c.id === claimId ? {
      ...c,
      status,
      reviewedBy: reviewerName,
      reviewedAt: new Date().toLocaleDateString('en-GB'),
      handoverOTP: otp || c.handoverOTP,
    } : c));

    if (status === 'Approved') {
      setFoundReports(prev => prev.map(f => f.id === targetClaim.foundItemId ? { ...f, status: 'Approved for Handover' } : f));
      toast.success(`Claim #${claimId} APPROVED! Handover OTP generated: ${otp}`);
    } else {
      toast.info(`Claim #${claimId} updated to: ${status}`);
    }
  };

  const confirmSecurityIntake = (foundItemId: string, storageLocker: string, conditionNotes: string, staffName: string, secondaryStaffName?: string) => {
    const item = foundReports.find(f => f.id === foundItemId);
    if (!item) return;

    const newRecord: SecurityCustodyRecord = {
      id: `CST-${Math.floor(400 + Math.random() * 600)}`,
      foundItemId,
      storageLocker,
      receivingStaffId: 'SEC-STAFF-1',
      receivingStaffName: staffName,
      secondaryStaffName,
      conditionNotes,
      intakeTimestamp: new Date().toLocaleString('en-GB'),
    };

    setCustodyRecords(prev => [newRecord, ...prev]);
    setFoundReports(prev => prev.map(f => f.id === foundItemId ? { ...f, status: 'In Custody', custodyLocation: `Security Desk (${storageLocker})` } : f));
    toast.success(`Security Deposit Confirmed for Item #${foundItemId} at ${storageLocker}`);
  };

  const verifyAndCollectHandover = (foundItemId: string, claimId: string, otpInput: string, staffName: string): boolean => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim || claim.handoverOTP !== otpInput) {
      toast.error('❌ Invalid Handover OTP/QR Code. Verification failed.');
      return false;
    }

    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'Collected' } : c));
    setFoundReports(prev => prev.map(f => f.id === foundItemId ? { ...f, status: 'Collected' } : f));
    setCustodyRecords(prev => prev.map(c => c.foundItemId === foundItemId ? { ...c, handoverCompletedAt: new Date().toLocaleString('en-GB') } : c));

    toast.success(`🎉 Handover Completed! Item #${foundItemId} marked as COLLECTED.`);
    return true;
  };

  const closeLostReport = (reportId: string) => {
    setLostReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'Closed' } : r));
    toast.info(`Lost Report #${reportId} closed.`);
  };

  const closeFoundReport = (reportId: string) => {
    setFoundReports(prev => prev.map(f => f.id === reportId ? { ...f, status: 'Closed' } : f));
    toast.info(`Found Report #${reportId} closed.`);
  };

  // ── Provider ────────────────────────────────────────────────────────────────

  return (
    <PlexusContext.Provider
      value={{
        userName, userRollNumber, userBranchYear, userEmail, userPhone, userHostel, userRoom, userEmergencyContact,
        userRating, userRatingCount, parcelDeliveryScore, foodDeliveryScore, servicesRating, marketplaceRating,
        walletBalance, addWalletFunds, deductWalletFunds, updateUserProfile,
        parcels, addParcel, acceptDelivery, completeDelivery,
        snacks, addSnack, buySnack,
        canteens, selectedCanteenId, setSelectedCanteenId, canteenItems, isScanningMenu, scanMenuFromImage,
        cart, cartCount, cartTotal, addToCart, updateCartQty, removeFromCart, clearCart,
        foodRequests, myFoodRequests, openFoodRequests, myAcceptedDeliveries,
        postFoodRequest, cancelFoodRequest, acceptDeliveryJob, markPickedUp, markDelivered,
        foodDeliveryJobs,
        chatMessages, activeChannel, setActiveChannel, postChatMessage,
        carpoolRides, carpoolBookings, publishRide, requestSeat, cancelBooking, cancelOfferedRide,
        campusServices, serviceRequests, publishService, bookService,
        marketplaceItems, publishMarketplaceItem, buyMarketplaceItem, changeMarketplaceItemStatus, deleteMarketplaceItem,
        lostReports, foundReports, potentialMatches, claims, custodyRecords,
        reportLostItem, reportFoundItem, submitClaim, reviewClaim, confirmSecurityIntake, verifyAndCollectHandover, closeLostReport, closeFoundReport,
      }}
    >
      {children}
    </PlexusContext.Provider>
  );
}

export function usePlexus() {
  const ctx = useContext(PlexusContext);
  if (!ctx) throw new Error('usePlexus must be used within PlexusProvider');
  return ctx;
}
