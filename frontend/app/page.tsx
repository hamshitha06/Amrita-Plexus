"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Types
type HostelScope = "MY_HOSTEL" | "OTHER_HOSTELS" | "ALL_HOSTELS";
type PaymentMethod = "razorpay" | "upi" | "card" | "netbanking";
type MainModule =
  | "Amazon Parcel Management"
  | "Hostel Services"
  | "Lost and Found"
  | "AI Campus Guide"
  | "Complaints & Improvements";

type ComplaintsSubSection =
  | "Submit Anonymous Complaint"
  | "Submit Improvement Suggestion"
  | "Track My Complaint"
  | "Complaint History";

type AmazonSubSection =
  | "Dashboard"
  | "My Parcels"
  | "Find Deliveries"
  | "My Deliveries"
  | "E-Wallet"
  | "Messages";

type HostelSubSection =
  | "Student Snacks"
  | "Night Canteen"
  | "Mess Food Menu"
  | "Hostel General Chat";

type LostFoundSubSection =
  | "Lost Products"
  | "Found Products"
  | "Private Item Chat";

type AiGuideSubSection =
  | "Campus Assistant"
  | "Approved FAQs & Rules"
  | "Live Platform Data APIs";

interface UserProfile {
  name: string;
  hostel: string;
  room: string;
  phone: string;
}

interface Parcel {
  id: string;
  trackingId: string;
  name: string;
  courier: string;
  location: string;
  hostel: string;
  room: string;
  status: "Ready for pickup" | "Delivery Requested" | "In Transit" | "Delivered";
  deliveryFee: number;
  deliveryPin: string;
  delivererName?: string;
  delivererPhone?: string;
  arrivedAt: string;
  color: string;
}

interface DeliveryJob {
  id: string;
  trackingId: string;
  parcelName: string;
  courier: string;
  ownerName: string;
  ownerHostel: string;
  ownerRoom: string;
  pickupLocation: string;
  rewardFee: number;
  distance: string;
  estimatedTime: string;
  status: "Open" | "Accepted" | "Picked Up" | "Delivered";
  pinCode: string;
  acceptedByMe?: boolean;
}

interface WalletTransaction {
  id: string;
  title: string;
  category: "EARNING" | "DELIVERY_FEE" | "TOPUP" | "SNACK_BUY" | "SNACK_EARN";
  amount: number;
  date: string;
  reference: string;
  paymentGateway?: string;
}

interface ChatMessage {
  id: string;
  sender: "me" | "them" | "system";
  text: string;
  timestamp: string;
}

interface ChatThread {
  id: string;
  contactName: string;
  contactHostel: string;
  contactRole: "Deliverer" | "Parcel Owner" | "Receptionist";
  parcelId: string;
  unreadCount: number;
  messages: ChatMessage[];
}

interface StudentSnack {
  id: string;
  title: string;
  sellerName: string;
  sellerHostel: string;
  sellerRoom: string;
  category: "Homemade Treats" | "Instant Noodles" | "Packaged Snacks" | "Beverages";
  price: number;
  quantity: number;
  emoji: string;
  postedAt: string;
}

interface NightCanteenItem {
  id: string;
  name: string;
  category: "Rolls & Wraps" | "Maggi & Noodles" | "Beverages & Shakes" | "Quick Bites";
  price: number;
  isAvailable: boolean;
  detectedByAI?: boolean;
  confidenceScore?: string;
  prepTime: string;
  menuPhotoUrl?: string;
}

interface PostComment {
  id: string;
  authorName: string;
  authorRoom: string;
  text: string;
  timestamp: string;
}

interface HostelCommunityPost {
  id: string;
  authorName: string;
  authorRoom: string;
  channel: "#general-discussion" | "#mess-updates" | "#night-canteen" | "#announcements" | "#lost-found-alerts";
  text: string;
  timestamp: string;
  likes: number;
  likedByMe?: boolean;
  isWarden?: boolean;
  comments?: PostComment[];
}

interface AiNavigationLink {
  label: string;
  icon: string;
  module: MainModule;
  subSection?: string;
  triggerModal?: "REPORT_LOST" | "REPORT_FOUND" | "ADD_PARCEL" | "ADD_FUNDS" | "UPLOAD_MENU";
}

interface AiGuideMessage {
  id: string;
  sender: "user" | "guide";
  text: string;
  timestamp: string;
  sourceBadge?: string;
  liveSnippet?: {
    type: "MESS" | "PARCEL" | "NIGHT_CANTEEN" | "LOST_FOUND" | "WALLET" | "RIDES";
    title: string;
    items: string[];
  };
  navigationLinks?: AiNavigationLink[];
  followUps?: string[];
  feedback?: "helpful" | "unhelpful" | null;
  isFallback?: boolean;
}

interface VerifiedCampusFaq {
  id: string;
  category: "Central Mess & Dining" | "Amazon Logistics" | "Lost & Found" | "Night Canteen" | "Campus Rides & Transit" | "Hostel Regulations" | "Health & Medical";
  question: string;
  answer: string;
  source: string;
  actionLink?: AiNavigationLink;
}

interface LostFoundItem {
  id: string;
  type: "LOST" | "FOUND";
  title: string;
  category: "Electronics" | "Keys & ID Cards" | "Books & Study" | "Personal Accessories" | "Clothing" | "Other";
  location: string;
  date: string;
  description: string;
  reporterName: string;
  reporterContactMasked: string;
  handoverLocation?: string;
  verificationQuestion?: string;
  status: "Active" | "Claim Pending" | "Resolved";
  emoji: string;
}

interface LostFoundChatThread {
  id: string;
  itemId: string;
  itemTitle: string;
  itemType: "LOST" | "FOUND";
  contactName: string;
  contactRole: "Finder" | "Owner";
  messages: ChatMessage[];
}

// Initial Mock Data
const INITIAL_PARCELS: Parcel[] = [
  {
    id: "PKG-1024",
    trackingId: "AMZ-9938210",
    name: "Electronics Package",
    courier: "Amazon Logistics",
    location: "Main Hostel Reception",
    hostel: "Gargi Hostel (Block A)",
    room: "A-304",
    status: "Ready for pickup",
    deliveryFee: 35,
    deliveryPin: "4921",
    arrivedAt: "Today, 10:15 AM",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: "PKG-1025",
    trackingId: "AMZ-4412093",
    name: "Books & Stationery",
    courier: "Amazon Transportation",
    location: "East Hostel Reception",
    hostel: "Gargi Hostel (Block A)",
    room: "A-304",
    status: "In Transit",
    deliveryFee: 30,
    deliveryPin: "8102",
    delivererName: "Ananya R. (Gargi B-102)",
    delivererPhone: "+91 98765 43210",
    arrivedAt: "Arrived today",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "PKG-1026",
    trackingId: "FK-7729104",
    name: "Personal Package",
    courier: "Flipkart Express",
    location: "Main Hostel Reception",
    hostel: "Gargi Hostel (Block A)",
    room: "A-304",
    status: "Delivered",
    deliveryFee: 25,
    deliveryPin: "1928",
    delivererName: "Priya M.",
    arrivedAt: "Yesterday, 04:45 PM",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
];

const INITIAL_DELIVERY_JOBS: DeliveryJob[] = [
  {
    id: "DEL-501",
    trackingId: "AMZ-1120934",
    parcelName: "Computer Mouse & Keypad",
    courier: "Amazon Logistics",
    ownerName: "Kavya Suresh",
    ownerHostel: "Gargi Hostel (Block A)",
    ownerRoom: "A-112",
    pickupLocation: "Central Gate Security Locker",
    rewardFee: 35,
    distance: "250m away",
    estimatedTime: "5 mins walk",
    status: "Open",
    pinCode: "5541",
  },
  {
    id: "DEL-502",
    trackingId: "AMZ-8820194",
    parcelName: "Lab Manuals & Notebooks",
    courier: "Amazon Courier",
    ownerName: "Divya Nair",
    ownerHostel: "Gargi Hostel (Block B)",
    ownerRoom: "B-205",
    pickupLocation: "Main Reception Desk",
    rewardFee: 40,
    distance: "300m away",
    estimatedTime: "7 mins walk",
    status: "Open",
    pinCode: "9923",
  },
  {
    id: "DEL-503",
    trackingId: "AMZ-3391029",
    parcelName: "Winter Jacket & Clothes",
    courier: "Amazon Logistics",
    ownerName: "Sneha Ramakrishnan",
    ownerHostel: "Bhavani Hostel",
    ownerRoom: "BH-402",
    pickupLocation: "Central Gate Locker #14",
    rewardFee: 50,
    distance: "650m away",
    estimatedTime: "12 mins walk",
    status: "Open",
    pinCode: "3184",
  },
  {
    id: "DEL-504",
    trackingId: "BLU-9921832",
    parcelName: "Art Supplies & Paint Set",
    courier: "BlueDart Express",
    ownerName: "Meera Krishnan",
    ownerHostel: "Agasthya Hostel",
    ownerRoom: "AG-210",
    pickupLocation: "North Gate Hub",
    rewardFee: 45,
    distance: "800m away",
    estimatedTime: "15 mins walk",
    status: "Open",
    pinCode: "6712",
  },
];

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "TXN-901",
    title: "Earned from Delivery #DEL-488",
    category: "EARNING",
    amount: 35,
    date: "10 Oct 2026, 03:15 PM",
    reference: "Delivered to Gargi B-105",
  },
  {
    id: "TXN-902",
    title: "Paid for Peer Delivery #PKG-1025",
    category: "DELIVERY_FEE",
    amount: -30,
    date: "10 Oct 2026, 11:30 AM",
    reference: "Escrow held for Ananya R.",
  },
  {
    id: "TXN-903",
    title: "Wallet Top-up via Razorpay",
    category: "TOPUP",
    amount: 200,
    date: "09 Oct 2026, 08:20 PM",
    reference: "Razorpay ID: pay_rzp_99210",
    paymentGateway: "Razorpay / UPI",
  },
];

const INITIAL_CHATS: ChatThread[] = [
  {
    id: "CHAT-101",
    contactName: "Ananya R.",
    contactHostel: "Gargi Hostel (Block B)",
    contactRole: "Deliverer",
    parcelId: "PKG-1025",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "Hi Hamshitha! I picked up your Amazon Books parcel from East Reception.",
        timestamp: "11:32 AM",
      },
      {
        id: "m2",
        sender: "me",
        text: "Awesome, thank you Ananya! Are you heading to Gargi Block A now?",
        timestamp: "11:34 AM",
      },
      {
        id: "m3",
        sender: "them",
        text: "Yes, I'll reach your room A-304 in about 5 minutes. Please have the 4-digit PIN ready!",
        timestamp: "11:35 AM",
      },
    ],
  },
  {
    id: "CHAT-102",
    contactName: "Kavya Suresh",
    contactHostel: "Gargi Hostel (Block A)",
    contactRole: "Parcel Owner",
    parcelId: "DEL-501",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "Hey, are you going to the Central Gate Locker anytime soon?",
        timestamp: "09:45 AM",
      },
      {
        id: "m2",
        sender: "me",
        text: "Yes, I will be going around 12:30 PM after my lecture!",
        timestamp: "09:50 AM",
      },
    ],
  },
];

const INITIAL_STUDENT_SNACKS: StudentSnack[] = [
  {
    id: "SNK-101",
    title: "Homemade Chocolate Walnut Brownies",
    sellerName: "Ananya R.",
    sellerHostel: "Gargi Hostel (Block A)",
    sellerRoom: "A-201",
    category: "Homemade Treats",
    price: 45,
    quantity: 4,
    emoji: "🧁",
    postedAt: "10 mins ago",
  },
  {
    id: "SNK-102",
    title: "Korean Spicy Cheese Buldak Noodles",
    sellerName: "Sneha M.",
    sellerHostel: "Gargi Hostel (Block B)",
    sellerRoom: "B-305",
    category: "Instant Noodles",
    price: 60,
    quantity: 3,
    emoji: "🍜",
    postedAt: "30 mins ago",
  },
];

const INITIAL_NIGHT_CANTEEN: NightCanteenItem[] = [
  {
    id: "NC-201",
    name: "Paneer Cheese Butter Roll",
    category: "Rolls & Wraps",
    price: 75,
    isAvailable: true,
    detectedByAI: true,
    confidenceScore: "98.5%",
    prepTime: "10 mins",
  },
  {
    id: "NC-202",
    name: "Double Egg Cheese Maggi",
    category: "Maggi & Noodles",
    price: 50,
    isAvailable: true,
    detectedByAI: true,
    confidenceScore: "99.1%",
    prepTime: "8 mins",
  },
  {
    id: "NC-203",
    name: "Iced Caramel Cold Coffee",
    category: "Beverages & Shakes",
    price: 45,
    isAvailable: true,
    detectedByAI: true,
    confidenceScore: "97.8%",
    prepTime: "5 mins",
  },
];

const MESS_WEEKLY_MENU = {
  Today: {
    dayName: "Saturday (Today)",
    breakfast: "Masala Dosa, Sambar, Coconut Chutney, Tea/Coffee, Banana",
    lunch: "Paneer Butter Masala, Chapati, Dal Tadka, Jeera Rice, Curd, Salad",
    snacks: "Onion Pakoda, Mint Chutney, Hot Cardamom Tea",
    dinner: "Veg Dum Biryani, Mirchi Salan, Onion Raitha, Gulab Jamun",
  },
  Sunday: {
    dayName: "Sunday",
    breakfast: "Aloo Paratha, Curd, Pickle, Tea/Coffee",
    lunch: "Special South Indian Meals, Avial, Sambar, Payasam, Appalam",
    snacks: "Samosa & Hot Coffee",
    dinner: "Mushroom Masala, Soft Rotis, Peas Pulao, Ice Cream",
  },
  Monday: {
    dayName: "Monday",
    breakfast: "Idli, Vada, Sambar, Tomato Chutney, Tea/Coffee",
    lunch: "Rajma Masala, Steamed Rice, Phulka, Curd, Salad",
    snacks: "Veg Cutlet & Tea",
    dinner: "Kadai Paneer, Chapati, Dal Fry, Jeera Rice, Fruit Salad",
  },
};

const INITIAL_HOSTEL_POSTS: HostelCommunityPost[] = [
  {
    id: "POST-1",
    authorName: "Warden Office (Gargi)",
    authorRoom: "Main Office",
    channel: "#announcements",
    text: "📢 Official Notice: Mess water filtration maintenance scheduled tomorrow 03:00 - 04:00 PM. Evening tea and snacks will be served without interruption at Central Mess Hall 2.",
    timestamp: "Today, 09:30 AM",
    likes: 38,
    isWarden: true,
    comments: [
      {
        id: "c-1",
        authorName: "Sneha Ramakrishnan",
        authorRoom: "BH-402",
        text: "Noted ma'am, thank you for informing us in advance!",
        timestamp: "09:45 AM",
      },
    ],
  },
  {
    id: "POST-2",
    authorName: "Kavya Suresh",
    authorRoom: "A-112",
    channel: "#mess-updates",
    text: "🍛 Update from Mess Hall: Dinner tonight includes fresh hot Gulab Jamun and Veg Dum Biryani! The right counter line is moving quickly.",
    timestamp: "Today, 07:45 PM",
    likes: 21,
    comments: [
      {
        id: "c-2",
        authorName: "Hamshitha",
        authorRoom: "A-304",
        text: "Heading down right now! Thanks for the heads up!",
        timestamp: "07:50 PM",
      },
    ],
  },
  {
    id: "POST-3",
    authorName: "Divya Nair",
    authorRoom: "B-205",
    channel: "#general-discussion",
    text: "🚆 Is anyone traveling to Coimbatore Railway Station tomorrow morning for the 08:30 AM Jan Shatabdi? Looking to share an auto from Gate 1 around 07:15 AM!",
    timestamp: "Today, 04:15 PM",
    likes: 9,
    comments: [
      {
        id: "c-3",
        authorName: "Ananya R.",
        authorRoom: "A-201",
        text: "I am taking the same train! Let's split an auto. DM me on WhatsApp.",
        timestamp: "04:30 PM",
      },
    ],
  },
  {
    id: "POST-4",
    authorName: "Meera Krishnan",
    authorRoom: "AG-210",
    channel: "#night-canteen",
    text: "🌙 Just tried the Paneer Cheese Frankie from Night Canteen. The new AI OCR board shows they also have fresh mango milkshakes tonight! Highly recommended.",
    timestamp: "Yesterday, 11:20 PM",
    likes: 15,
  },
  {
    id: "POST-5",
    authorName: "Priya M.",
    authorRoom: "A-214",
    channel: "#lost-found-alerts",
    text: "⚠️ Lost a blue Parker ballpoint pen with silver clip in Mechanical Seminar Hall. If found, please drop it at Gargi reception desk!",
    timestamp: "Yesterday, 02:10 PM",
    likes: 6,
  },
];

const INITIAL_AI_MESSAGES: AiGuideMessage[] = [
  {
    id: "guide-welcome",
    sender: "guide",
    text: "👋 **Hello Hamshitha! Welcome to the 6.10 AI Campus Guide.**\n\nI answer your questions strictly from **approved university records** and **authorized platform APIs** (Mess menus, Amazon parcel tracking, Night Canteen AI vision menu, Lost & Found, and Station transit). I never invent facts or disclose private student records.\n\n*How may I help you navigate campus today?*",
    timestamp: "10:00 AM",
    sourceBadge: "Verified Campus Knowledge Base · 6.10 AGY",
    followUps: [
      "Where is today’s mess menu?",
      "How do I track my parcel?",
      "How do I report a lost ID card?",
      "Are there rides to the station tomorrow?",
      "What snacks are available in night canteen?",
      "What are the hostel gate timings?",
      "Where is the 24/7 health center?",
    ],
  },
];

const VERIFIED_CAMPUS_FAQS: VerifiedCampusFaq[] = [
  {
    id: "FAQ-1",
    category: "Central Mess & Dining",
    question: "Where is today's mess menu located and what are the meal hours?",
    answer: "The central mess menu is scheduled across 4 daily meals: Breakfast (07:30 - 09:30 AM), Lunch (12:30 - 02:30 PM), Evening Tea & Snacks (04:30 - 05:30 PM), and Dinner (07:30 - 09:30 PM). Central Mess Hall 1 & 2 are located adjacent to the Student Activities Center. Always scan your biometric RFID student card at entry.",
    source: "Campus Dining Services Handbook 2026-27",
    actionLink: { label: "View Live Mess Menu", icon: "🍱", module: "Hostel Services", subSection: "Mess Food Menu" },
  },
  {
    id: "FAQ-2",
    category: "Amazon Logistics",
    question: "How do I track and collect my Amazon parcels using the peer delivery system?",
    answer: "Couriers deposit parcels at Central Gate Security Locker or East Reception. Each parcel is assigned a unique 4-digit PIN in your portal. You can collect it yourself using the PIN or request a peer student courier to deliver it to your room for ₹20-₹40.",
    source: "Peer Logistics Protocol · SOP-AMZ-2026",
    actionLink: { label: "View My Parcels & PINs", icon: "📦", module: "Amazon Parcel Management", subSection: "My Parcels" },
  },
  {
    id: "FAQ-3",
    category: "Lost & Found",
    question: "How do I report a lost student ID card or claim a found item?",
    answer: "Post item details in the 6.5 Lost & Found section. Physical items must be submitted to the Central Security Desk at Admin Block Ground Floor (open 24/7). Contact info is masked for privacy, and owners answer a security question to verify ownership before collection.",
    source: "Campus Security & Asset Registry Regulations",
    actionLink: { label: "Report Lost Item / ID Card", icon: "🔍", module: "Lost and Found", subSection: "Lost Products", triggerModal: "REPORT_LOST" },
  },
  {
    id: "FAQ-4",
    category: "Night Canteen",
    question: "What are the night canteen operating hours and how is the menu updated?",
    answer: "Night Canteen is open daily from 09:00 PM to 02:00 AM on Ground Floor, Block B (Gargi Courtyard). Students can upload photos of the daily menu board, and our AI vision OCR automatically extracts available items and prices in real time.",
    source: "Campus Auxiliary Services Guide",
    actionLink: { label: "View Night Canteen Menu", icon: "🌙", module: "Hostel Services", subSection: "Night Canteen" },
  },
  {
    id: "FAQ-5",
    category: "Campus Rides & Transit",
    question: "Are there rides, shuttles, or carpooling to Coimbatore Railway Station?",
    answer: "University Station Shuttles depart from Main Gate 1 at 06:15 AM, 09:30 AM, and 05:00 PM on Fridays & weekends. Auto-rickshaw carpooling is available at Gate 1 (~₹80-₹100/seat for a 3-passenger pool). You can coordinate ride sharing in the Hostel General Chat #general-discussion.",
    source: "Student Transit & Shuttle Advisory 2026",
    actionLink: { label: "Coordinate Rides in Forum", icon: "💬", module: "Hostel Services", subSection: "Hostel General Chat" },
  },
  {
    id: "FAQ-6",
    category: "Hostel Regulations",
    question: "What are the hostel gate timings, curfew rules, and warden contacts?",
    answer: "Hostel gates close at 08:30 PM for First-Year residents and 09:30 PM for Seniors. Weekend outings require AUMS slips approved by Friday 05:00 PM. Gargi Hostel Warden Office is at Block A Room 101 (Phone Ext: 3102, Email: warden.gargi@amrita.edu). Quiet hours are 10:30 PM to 06:00 AM.",
    source: "Hostel Resident Handbook 2026-27",
    actionLink: { label: "Hostel Forum Announcements", icon: "🏢", module: "Hostel Services", subSection: "Hostel General Chat" },
  },
  {
    id: "FAQ-7",
    category: "Health & Medical",
    question: "Where is the 24/7 campus health clinic and how to contact the emergency ambulance?",
    answer: "Amrita Health Center is situated behind the Sports Complex and operates 24/7. Resident doctors are on duty 08:30 AM - 01:00 PM & 04:30 PM - 08:00 PM. In an emergency, dial extension 108 or direct line +91 422 268 4444. Basic first-aid is available at the warden desk.",
    source: "Campus Medical & Emergency Directory",
  },
];

const INITIAL_LOST_FOUND_ITEMS: LostFoundItem[] = [
  {
    id: "LF-ITEM-101",
    type: "LOST",
    title: "AirPods Pro 2nd Gen (White Case)",
    category: "Electronics",
    location: "Main Library 2nd Floor Reading Hall",
    date: "10 Oct 2026",
    description: "White charging case with a small blue anime cat sticker on back. Left near desk 42.",
    reporterName: "Hamshitha",
    reporterContactMasked: "Hams••••@amrita.edu",
    status: "Active",
    emoji: "🎧",
  },
  {
    id: "LF-ITEM-102",
    type: "FOUND",
    title: "Apple Watch Series 8 (Midnight Aluminum)",
    category: "Electronics",
    location: "Central Canteen Outdoor Benches",
    date: "10 Oct 2026",
    description: "Found on a concrete bench near juice counter. Kept safely with security desk.",
    reporterName: "Rahul Sharma",
    reporterContactMasked: "Rahu••••@amrita.edu",
    handoverLocation: "Central Gate Security Locker #04",
    verificationQuestion: "What watch face wallpaper or strap color is installed?",
    status: "Active",
    emoji: "⌚",
  },
  {
    id: "LF-ITEM-103",
    type: "LOST",
    title: "Hostel Smart Access Keycard & Amrita ID",
    category: "Keys & ID Cards",
    location: "Pathway between Gargi Hostel & Academic Block 3",
    date: "09 Oct 2026",
    description: "Attached to a blue Amrita University lanyard. Student ID starting with CB.EN.U4...",
    reporterName: "Priya V.",
    reporterContactMasked: "Priy••••@amrita.edu",
    status: "Active",
    emoji: "🪪",
  },
];

const INITIAL_LF_CHATS: LostFoundChatThread[] = [
  {
    id: "LF-CHAT-01",
    itemId: "LF-ITEM-102",
    itemTitle: "Apple Watch Series 8",
    itemType: "FOUND",
    contactName: "Rahul Sharma (Finder)",
    contactRole: "Finder",
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "Hi! I deposited the Apple Watch at Central Gate Security Locker #04. Are you the owner?",
        timestamp: "10:15 AM",
      },
      {
        id: "m2",
        sender: "me",
        text: "Yes! It has a midnight sports loop strap and battery was around 30%. Can I verify and collect it?",
        timestamp: "10:20 AM",
      },
      {
        id: "m3",
        sender: "them",
        text: "That matches! You can show this chat to Security Officer Mr. Murugan at Locker #04 to claim it.",
        timestamp: "10:22 AM",
      },
    ],
  },
];

export default function AmritaPlexusApp() {
  const pathname = usePathname();
  // Navigation State - DEFAULT IS AMAZON PARCEL MANAGEMENT
  const [activeMainModule, setActiveMainModule] = useState<MainModule>("Amazon Parcel Management");
  const [isAmazonSectionExpanded, setIsAmazonSectionExpanded] = useState(true);
  const [isHostelServicesExpanded, setIsHostelServicesExpanded] = useState(true);
  const [isLostFoundExpanded, setIsLostFoundExpanded] = useState(true);
  const [isComplaintsExpanded, setIsComplaintsExpanded] = useState(true);

  // Subsections
  const [activeAmazonSubSection, setActiveAmazonSubSection] =
    useState<AmazonSubSection>("Dashboard");

  const [activeHostelSubSection, setActiveHostelSubSection] =
    useState<HostelSubSection>("Student Snacks");

  const [activeLostFoundSubSection, setActiveLostFoundSubSection] =
    useState<LostFoundSubSection>("Found Products");

  const [activeComplaintsSubSection, setActiveComplaintsSubSection] =
    useState<ComplaintsSubSection>("Submit Anonymous Complaint");

  // Complaints module state
  const [cmpType, setCmpType] = useState<"Complaint" | "Improvement">("Complaint");
  const [cmpCategory, setCmpCategory] = useState("Hostel");
  const [cmpSubject, setCmpSubject] = useState("");
  const [cmpDescription, setCmpDescription] = useState("");
  const [cmpEvidenceFile, setCmpEvidenceFile] = useState("");
  const [cmpStatus, setCmpStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [cmpResult, setCmpResult] = useState<{ ticketId: string; trackingSecret: string } | null>(null);
  const [cmpError, setCmpError] = useState("");
  const [cmpSubjectError, setCmpSubjectError] = useState("");
  const [cmpDescError, setCmpDescError] = useState("");
  const [cmpSecretCopied, setCmpSecretCopied] = useState(false);
  const [cmpAcknowledged, setCmpAcknowledged] = useState(false);
  // Track ticket
  const [trackTicketId, setTrackTicketId] = useState("");
  const [trackSecret, setTrackSecret] = useState("");
  const [trackResult, setTrackResult] = useState<null | any>(null);
  const [trackStatus, setTrackStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [trackError, setTrackError] = useState("");
  // Feedback
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "loading" | "success" | "error">("idle");
  // History (session-local ticket log)
  const [cmpHistory, setCmpHistory] = useState<{ ticketId: string; type: string; subject: string; submittedAt: string }[]>([]);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Hamshitha",
    hostel: "Gargi Hostel (Block A)",
    room: "A-304",
    phone: "+91 98765 88990",
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editNameInput, setEditNameInput] = useState(userProfile.name);
  const [editHostelInput, setEditHostelInput] = useState(userProfile.hostel);
  const [editRoomInput, setEditRoomInput] = useState(userProfile.room);
  const [editPhoneInput, setEditPhoneInput] = useState(userProfile.phone);

  // Amazon Parcel Management Stores
  const [parcels, setParcels] = useState<Parcel[]>(INITIAL_PARCELS);
  const [deliveryJobs, setDeliveryJobs] = useState<DeliveryJob[]>(INITIAL_DELIVERY_JOBS);
  const [walletBalance, setWalletBalance] = useState<number>(250);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(INITIAL_CHATS);
  const [hostelScopeFilter, setHostelScopeFilter] = useState<HostelScope>("ALL_HOSTELS");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals for Parcel Management
  const [showAddParcelModal, setShowAddParcelModal] = useState(false);
  const [showPaymentGatewayModal, setShowPaymentGatewayModal] = useState(false);
  const [showPinVerifyModal, setShowPinVerifyModal] = useState<DeliveryJob | null>(null);
  const [newParcelName, setNewParcelName] = useState("");
  const [newTrackingId, setNewTrackingId] = useState("");
  const [newCourier, setNewCourier] = useState("Amazon Logistics");
  const [newPickupLocation, setNewPickupLocation] = useState("Central Gate Security Locker");
  const [newDeliveryFee, setNewDeliveryFee] = useState(35);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [topUpAmount, setTopUpAmount] = useState<number>(200);
  const [upiIdInput, setUpiIdInput] = useState("hamshitha@okaxis");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8912");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("892");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // PIN & Parcel Chat State
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [activeChatId, setActiveChatId] = useState<string>("CHAT-101");
  const [chatInputText, setChatInputText] = useState("");

  // Hostel Services Stores
  const [studentSnacks, setStudentSnacks] = useState<StudentSnack[]>(INITIAL_STUDENT_SNACKS);
  const [nightCanteenItems, setNightCanteenItems] = useState<NightCanteenItem[]>(INITIAL_NIGHT_CANTEEN);
  const [selectedMessDay, setSelectedMessDay] = useState<"Today" | "Sunday" | "Monday">("Today");
  const [communityPosts, setCommunityPosts] = useState<HostelCommunityPost[]>(INITIAL_HOSTEL_POSTS);
  const [activeChannelFilter, setActiveChannelFilter] = useState<string>("#general-discussion");
  const [showAddSnackModal, setShowAddSnackModal] = useState(false);
  const [showUploadMenuModal, setShowUploadMenuModal] = useState(false);
  const [uploadedPhotoPreview, setUploadedPhotoPreview] = useState<string | null>(null);
  const [uploadedPhotoName, setUploadedPhotoName] = useState<string>("");
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [extractedItemsFromPhoto, setExtractedItemsFromPhoto] = useState<NightCanteenItem[]>([]);
  const [customExtractedName, setCustomExtractedName] = useState("Paneer Cheese Butter Frankie");
  const [customExtractedPrice, setCustomExtractedPrice] = useState(70);
  const [customExtractedCategory, setCustomExtractedCategory] = useState<
    "Rolls & Wraps" | "Maggi & Noodles" | "Beverages & Shakes" | "Quick Bites"
  >("Rolls & Wraps");

  const [newSnackTitle, setNewSnackTitle] = useState("");
  const [newSnackCategory, setNewSnackCategory] = useState<
    "Homemade Treats" | "Instant Noodles" | "Packaged Snacks" | "Beverages"
  >("Homemade Treats");
  const [newSnackPrice, setNewSnackPrice] = useState(40);
  const [newSnackQty, setNewSnackQty] = useState(3);
  const [newPostText, setNewPostText] = useState("");

  // Lost & Found Stores
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(INITIAL_LOST_FOUND_ITEMS);
  const [lfChats, setLfChats] = useState<LostFoundChatThread[]>(INITIAL_LF_CHATS);
  const [activeLfChatId, setActiveLfChatId] = useState<string>("LF-CHAT-01");
  const [lfChatInput, setLfChatInput] = useState("");
  const [lfSearchQuery, setLfSearchQuery] = useState("");
  const [lfCategoryFilter, setLfCategoryFilter] = useState<string>("ALL");
  const [showReportLostModal, setShowReportLostModal] = useState(false);
  const [showReportFoundModal, setShowReportFoundModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState<LostFoundItem | null>(null);
  const [claimAnswerInput, setClaimAnswerInput] = useState("");

  const [lostTitleInput, setLostTitleInput] = useState("");
  const [lostCategoryInput, setLostCategoryInput] = useState<LostFoundItem["category"]>("Electronics");
  const [lostLocationInput, setLostLocationInput] = useState("");
  const [lostDateInput, setLostDateInput] = useState("10 Oct 2026");
  const [lostDescInput, setLostDescInput] = useState("");

  const [foundTitleInput, setFoundTitleInput] = useState("");
  const [foundCategoryInput, setFoundCategoryInput] = useState<LostFoundItem["category"]>("Electronics");
  const [foundLocationInput, setFoundLocationInput] = useState("");
  const [foundHandoverInput, setFoundHandoverInput] = useState("Central Gate Security Desk");
  const [foundDescInput, setFoundDescInput] = useState("");
  const [foundQuestionInput, setFoundQuestionInput] = useState("");

  // Stats
  const incomingCount = parcels.filter((p) => p.status !== "Delivered").length;
  const activeDeliveriesCount = deliveryJobs.filter(
    (j) => j.status === "Accepted" || j.status === "Picked Up"
  ).length;

  // Handlers for Parcel Management
  const handleAddNewParcelRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParcelName.trim() || !newTrackingId.trim()) {
      alert("Please enter parcel name and tracking ID!");
      return;
    }
    if (walletBalance < newDeliveryFee) {
      alert("Insufficient wallet balance! Top up via Razorpay / UPI first.");
      return;
    }

    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newId = `PKG-${Date.now().toString().slice(-4)}`;

    const newParcelObj: Parcel = {
      id: newId,
      trackingId: newTrackingId.toUpperCase(),
      name: newParcelName,
      courier: newCourier,
      location: newPickupLocation,
      hostel: userProfile.hostel,
      room: userProfile.room,
      status: "Delivery Requested",
      deliveryFee: newDeliveryFee,
      deliveryPin: generatedPin,
      arrivedAt: "Just now",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    };
    setParcels((prev) => [newParcelObj, ...prev]);

    const newJobObj: DeliveryJob = {
      id: `DEL-${Date.now().toString().slice(-3)}`,
      trackingId: newTrackingId.toUpperCase(),
      parcelName: newParcelName,
      courier: newCourier,
      ownerName: userProfile.name,
      ownerHostel: userProfile.hostel,
      ownerRoom: userProfile.room,
      pickupLocation: newPickupLocation,
      rewardFee: newDeliveryFee,
      distance: "300m away",
      estimatedTime: "6 mins walk",
      status: "Open",
      pinCode: generatedPin,
    };
    setDeliveryJobs((prev) => [newJobObj, ...prev]);

    setWalletBalance((prev) => prev - newDeliveryFee);
    const newTxn: WalletTransaction = {
      id: `TXN-${Date.now().toString().slice(-3)}`,
      title: `Peer Delivery Escrow (${newId})`,
      category: "DELIVERY_FEE",
      amount: -newDeliveryFee,
      date: "Just now",
      reference: `Escrow held for ${newParcelName}`,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    setNewParcelName("");
    setNewTrackingId("");
    setShowAddParcelModal(false);
    alert(`🎉 Parcel Added! Delivery request posted for ₹${newDeliveryFee}. PIN: ${generatedPin}`);
  };

  const handleAcceptDeliveryJob = (job: DeliveryJob) => {
    setDeliveryJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: "Accepted", acceptedByMe: true } : j))
    );
    setActiveMainModule("Amazon Parcel Management");
    setActiveAmazonSubSection("My Deliveries");
  };

  const handleUpdateJobStatus = (jobId: string, newStatus: "Picked Up" | "Delivered") => {
    if (newStatus === "Delivered") {
      const job = deliveryJobs.find((j) => j.id === jobId);
      if (job) {
        setShowPinVerifyModal(job);
        setEnteredPin("");
        setPinError("");
      }
      return;
    }
    setDeliveryJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
  };

  const handleVerifyPinAndComplete = () => {
    if (!showPinVerifyModal) return;
    if (enteredPin !== showPinVerifyModal.pinCode) {
      setPinError("Invalid 4-digit PIN! Check with parcel owner.");
      return;
    }
    const reward = showPinVerifyModal.rewardFee;
    setDeliveryJobs((prev) =>
      prev.map((j) => (j.id === showPinVerifyModal.id ? { ...j, status: "Delivered" } : j))
    );
    setWalletBalance((prev) => prev + reward);
    const rewardTxn: WalletTransaction = {
      id: `TXN-${Date.now().toString().slice(-3)}`,
      title: `Earned from Delivery #${showPinVerifyModal.id}`,
      category: "EARNING",
      amount: reward,
      date: "Just now",
      reference: `Delivered to ${showPinVerifyModal.ownerName} (${showPinVerifyModal.ownerHostel})`,
    };
    setTransactions((prev) => [rewardTxn, ...prev]);
    setShowPinVerifyModal(null);
    alert(`🎉 Delivery Completed! ₹${reward} credited to wallet.`);
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const razorpayId = `pay_rzp_${Math.floor(10000000 + Math.random() * 90000000)}`;
      setWalletBalance((prev) => prev + topUpAmount);

      const gatewayLabel =
        paymentMethod === "razorpay"
          ? "Razorpay Instant Pay"
          : paymentMethod === "upi"
          ? `UPI (${upiIdInput})`
          : paymentMethod === "card"
          ? "Debit / Credit Card"
          : `Netbanking (${selectedBank})`;

      const newTxn: WalletTransaction = {
        id: `TXN-${Date.now().toString().slice(-3)}`,
        title: `Wallet Top-up via ${paymentMethod.toUpperCase()}`,
        category: "TOPUP",
        amount: topUpAmount,
        date: "Just now",
        reference: `Ref: ${razorpayId}`,
        paymentGateway: gatewayLabel,
      };
      setTransactions((prev) => [newTxn, ...prev]);
      setShowPaymentGatewayModal(false);
      alert(`✅ Payment Successful via ${gatewayLabel}!\nID: ${razorpayId}\n₹${topUpAmount} added to wallet.`);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!chatInputText.trim()) return;
    const currentChat = chatThreads.find((c) => c.id === activeChatId);
    if (!currentChat) return;

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: chatInputText,
      timestamp: "Just now",
    };
    setChatThreads((prev) =>
      prev.map((c) =>
        c.id === activeChatId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    );
    const userMsg = chatInputText;
    setChatInputText("");

    setTimeout(() => {
      const autoReplyText =
        userMsg.toLowerCase().includes("pin") || userMsg.toLowerCase().includes("code")
          ? `My 4-digit delivery PIN is ${
              deliveryJobs.find((j) => j.ownerName === currentChat.contactName)?.pinCode || "4921"
            }. Thanks for delivering!`
          : `Thanks ${userProfile.name}! Let me know when you reach ${currentChat.contactHostel}.`;

      const replyMsg: ChatMessage = {
        id: `m-${Date.now() + 100}`,
        sender: "them",
        text: autoReplyText,
        timestamp: "Just now",
      };
      setChatThreads((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, messages: [...c.messages, replyMsg] } : c
        )
      );
    }, 1200);
  };

  const filteredDeliveryJobs = deliveryJobs.filter((job) => {
    const matchesSearch =
      job.parcelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.ownerHostel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (hostelScopeFilter === "MY_HOSTEL") {
      return job.ownerHostel.toLowerCase().includes(userProfile.hostel.split(" ")[0].toLowerCase());
    } else if (hostelScopeFilter === "OTHER_HOSTELS") {
      return !job.ownerHostel.toLowerCase().includes(userProfile.hostel.split(" ")[0].toLowerCase());
    }
    return true;
  });

  // Handlers for Hostel Services
  const handleBuyStudentSnack = (snack: StudentSnack) => {
    if (walletBalance < snack.price) {
      alert("Insufficient wallet balance! Top up using Razorpay.");
      return;
    }
    setWalletBalance((prev) => prev - snack.price);
    setStudentSnacks((prev) =>
      prev
        .map((s) => (s.id === snack.id ? { ...s, quantity: s.quantity - 1 } : s))
        .filter((s) => s.quantity > 0)
    );
    const newTxn: WalletTransaction = {
      id: `TXN-${Date.now().toString().slice(-3)}`,
      title: `Bought Snack: ${snack.title}`,
      category: "SNACK_BUY",
      amount: -snack.price,
      date: "Just now",
      reference: `Seller: ${snack.sellerName} (${snack.sellerRoom})`,
    };
    setTransactions((prev) => [newTxn, ...prev]);
    alert(`🎉 Purchase Successful! ₹${snack.price} paid to ${snack.sellerName} (${snack.sellerRoom}).`);
  };

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result as string;
        setUploadedPhotoPreview(photoUrl);

        const parsedItems: NightCanteenItem[] = [
          {
            id: `NC-PHOTO-1`,
            name: "Paneer Cheese Butter Frankie",
            category: "Rolls & Wraps",
            price: 70,
            isAvailable: true,
            detectedByAI: true,
            confidenceScore: "99.4% Match",
            prepTime: "10 mins",
          },
          {
            id: `NC-PHOTO-2`,
            name: "Special Veg Club Sandwich",
            category: "Quick Bites",
            price: 60,
            isAvailable: true,
            detectedByAI: true,
            confidenceScore: "98.9% Match",
            prepTime: "8 mins",
          },
          {
            id: `NC-PHOTO-3`,
            name: "Oreo Chocolate Milkshake",
            category: "Beverages & Shakes",
            price: 55,
            isAvailable: true,
            detectedByAI: true,
            confidenceScore: "99.1% Match",
            prepTime: "5 mins",
          },
        ];
        setExtractedItemsFromPhoto(parsedItems);
        setCustomExtractedName("Paneer Cheese Butter Frankie");
        setCustomExtractedPrice(70);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiPhotoScanner = () => {
    if (!uploadedPhotoPreview && !uploadedPhotoName) {
      alert("Please select or drop a menu board photo first!");
      return;
    }
    setIsAnalyzingPhoto(true);
    setTimeout(() => {
      setIsAnalyzingPhoto(false);
      const extractedList: NightCanteenItem[] = [
        {
          id: `NC-OCR-${Date.now()}-1`,
          name: customExtractedName || "Paneer Cheese Butter Frankie",
          category: customExtractedCategory,
          price: customExtractedPrice || 70,
          isAvailable: true,
          detectedByAI: true,
          confidenceScore: "99.4% OCR Confidence",
          prepTime: "10 mins",
        },
        {
          id: `NC-OCR-${Date.now()}-2`,
          name: "Special Veg Club Sandwich",
          category: "Quick Bites",
          price: 60,
          isAvailable: true,
          detectedByAI: true,
          confidenceScore: "98.9% OCR Confidence",
          prepTime: "8 mins",
        },
      ];
      setExtractedItemsFromPhoto(extractedList);
    }, 1500);
  };

  const handlePublishExtractedItems = () => {
    if (extractedItemsFromPhoto.length === 0) {
      const newItem: NightCanteenItem = {
        id: `NC-SINGLE-${Date.now()}`,
        name: customExtractedName || "Special Night Canteen Item",
        category: customExtractedCategory,
        price: customExtractedPrice,
        isAvailable: true,
        detectedByAI: true,
        confidenceScore: "99.0% OCR Verified",
        prepTime: "10 mins",
      };
      setNightCanteenItems((prev) => [newItem, ...prev]);
    } else {
      setNightCanteenItems((prev) => [...extractedItemsFromPhoto, ...prev]);
    }
    setShowUploadMenuModal(false);
    setUploadedPhotoPreview(null);
    setUploadedPhotoName("");
    setExtractedItemsFromPhoto([]);
    alert("✨ Success! AI-detected menu dishes published to live Night Canteen!");
  };

  // Lost & Found Handlers
  const handleInitiateItemChat = (item: LostFoundItem, customMsg?: string) => {
    const existingThread = lfChats.find((c) => c.itemId === item.id);
    if (existingThread) {
      setActiveLfChatId(existingThread.id);
    } else {
      const isFindingOwner = item.type === "LOST";
      const newThread: LostFoundChatThread = {
        id: `LF-CHAT-${Date.now().toString().slice(-4)}`,
        itemId: item.id,
        itemTitle: item.title,
        itemType: item.type,
        contactName: `${item.reporterName} (${isFindingOwner ? "Owner" : "Finder"})`,
        contactRole: isFindingOwner ? "Owner" : "Finder",
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: "system",
            text: `🔒 Private Protected Chat created for "${item.title}". Contact details are masked for privacy.`,
            timestamp: "Just now",
          },
          {
            id: `msg-${Date.now() + 1}`,
            sender: "me",
            text:
              customMsg ||
              (item.type === "FOUND"
                ? `Hi ${item.reporterName}! I believe this ${item.title} belongs to me. I would like to verify ownership.`
                : `Hi ${item.reporterName}! I found an item matching your lost report for ${item.title}.`),
            timestamp: "Just now",
          },
        ],
      };
      setLfChats((prev) => [newThread, ...prev]);
      setActiveLfChatId(newThread.id);
    }
    setActiveMainModule("Lost and Found");
    setActiveLostFoundSubSection("Private Item Chat");
  };

  const handleMarkItemResolved = (itemId: string) => {
    setLostFoundItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: "Resolved" } : item))
    );
    alert("🎉 Item successfully marked as RETURNED & RESOLVED!");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-indigo-700">
              Amrita<span className="text-teal-500">Plexus</span>
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-400">
              Campus Life & Logistics Platform
            </p>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {/* MODULE 1: AMAZON PARCEL MANAGEMENT */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3">
              <button
                onClick={() => {
                  setActiveMainModule("Amazon Parcel Management");
                  setIsAmazonSectionExpanded(!isAmazonSectionExpanded);
                }}
                className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2 px-1"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">📦</span>
                  Amazon Parcel Management
                </span>
                <span className="text-xs">{isAmazonSectionExpanded ? "▼" : "▶"}</span>
              </button>

              {isAmazonSectionExpanded && (
                <nav className="space-y-1 mt-1 pl-1">
                  {[
                    { id: "Dashboard", label: "Dashboard", icon: "⌂" },
                    { id: "My Parcels", label: "My Parcels", icon: "▣", badge: incomingCount },
                    { id: "Find Deliveries", label: "Find Deliveries", icon: "⇄", badge: deliveryJobs.filter(j => j.status === 'Open').length },
                    { id: "My Deliveries", label: "My Deliveries", icon: "🚚", badge: activeDeliveriesCount },
                    { id: "E-Wallet", label: "E-Wallet", icon: "💳", subtitle: `₹${walletBalance}` },
                    { id: "Messages", label: "Messages", icon: "💬", badge: 1 },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveMainModule("Amazon Parcel Management");
                        setActiveAmazonSubSection(sub.id as AmazonSubSection);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                        activeMainModule === "Amazon Parcel Management" &&
                        activeAmazonSubSection === sub.id
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-indigo-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{sub.icon}</span>
                        <span>{sub.label}</span>
                      </div>
                      {sub.badge !== undefined && sub.badge > 0 && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            activeAmazonSubSection === sub.id ? "bg-white text-indigo-700" : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {sub.badge}
                        </span>
                      )}
                      {sub.subtitle && (
                        <span
                          className={`text-[11px] font-bold ${
                            activeAmazonSubSection === sub.id ? "text-indigo-100" : "text-emerald-600"
                          }`}
                        >
                          {sub.subtitle}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              )}
            </div>

            {/* MODULE 2: HOSTEL SERVICES */}
            <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-3">
              <button
                onClick={() => {
                  setActiveMainModule("Hostel Services");
                  setIsHostelServicesExpanded(!isHostelServicesExpanded);
                }}
                className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-teal-900 mb-2 px-1"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">🏢</span>
                  Hostel Services
                </span>
                <span className="text-xs">{isHostelServicesExpanded ? "▼" : "▶"}</span>
              </button>

              {isHostelServicesExpanded && (
                <nav className="space-y-1 mt-1 pl-1">
                  {[
                    { id: "Student Snacks", label: "P2P Student Snacks", icon: "🍿", badge: studentSnacks.length },
                    { id: "Night Canteen", label: "Night Canteen (AI Menu)", icon: "🌙", badge: "AI" },
                    { id: "Mess Food Menu", label: "Mess Food Menu", icon: "🍱" },
                    { id: "Hostel General Chat", label: "Hostel General Chat", icon: "💬" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveMainModule("Hostel Services");
                        setActiveHostelSubSection(sub.id as HostelSubSection);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                        activeMainModule === "Hostel Services" &&
                        activeHostelSubSection === sub.id
                          ? "bg-teal-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-teal-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{sub.icon}</span>
                        <span>{sub.label}</span>
                      </div>
                      {sub.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            activeHostelSubSection === sub.id ? "bg-white text-teal-800" : "bg-teal-100 text-teal-800"
                          }`}
                        >
                          {sub.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              )}
            </div>

            {/* MODULE 3: 6.5 LOST AND FOUND */}
            <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-3">
              <button
                onClick={() => {
                  setActiveMainModule("Lost and Found");
                  setIsLostFoundExpanded(!isLostFoundExpanded);
                }}
                className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-rose-900 mb-2 px-1"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">🔍</span>
                  6.5 Lost & Found
                </span>
                <span className="text-xs">{isLostFoundExpanded ? "▼" : "▶"}</span>
              </button>

              {isLostFoundExpanded && (
                <nav className="space-y-1 mt-1 pl-1">
                  {[
                    { id: "Lost Products", label: "Lost Products Section", icon: "🔍" },
                    { id: "Found Products", label: "Found Products Section", icon: "📦" },
                    { id: "Private Item Chat", label: "Private Item Chat", icon: "💬" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveMainModule("Lost and Found");
                        setActiveLostFoundSubSection(sub.id as LostFoundSubSection);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                        activeMainModule === "Lost and Found" &&
                        activeLostFoundSubSection === sub.id
                          ? "bg-rose-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-rose-700"
                      }`}
                    >
                      <span className="text-sm">{sub.icon}</span>
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>

            {/* MODULE 4: AI CAMPUS GUIDE */}
            <div className={`rounded-2xl border p-3 ${pathname === '/ai-guide' ? 'border-violet-300 bg-violet-100/60' : 'border-violet-100 bg-violet-50/40'}`}>
              <Link href="/ai-guide" className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider mb-1 px-1">
                <span className={`flex items-center gap-2 ${pathname === '/ai-guide' ? 'text-violet-900' : 'text-violet-800 hover:text-violet-950'}`}>
                  <span className="text-base">✨</span>
                  AI Campus Guide
                </span>
                <span className="text-xs text-violet-500">▶</span>
              </Link>
            </div>

            {/* MODULE 5: COMPLAINTS & IMPROVEMENTS */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-3">
              <button
                onClick={() => {
                  setActiveMainModule("Complaints & Improvements");
                  setIsComplaintsExpanded(!isComplaintsExpanded);
                }}
                className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 px-1"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">📝</span>
                  Complaints & Improvements
                </span>
                <span className="text-xs">{isComplaintsExpanded ? "▼" : "▶"}</span>
              </button>

              {isComplaintsExpanded && (
                <nav className="space-y-1 mt-1 pl-1">
                  {([
                    { id: "Submit Anonymous Complaint", label: "Submit Complaint", icon: "🚨" },
                    { id: "Submit Improvement Suggestion", label: "Submit Suggestion", icon: "💡" },
                    { id: "Track My Complaint", label: "Track My Ticket", icon: "🔎" },
                    { id: "Complaint History", label: "Session History", icon: "📋" },
                  ] as { id: ComplaintsSubSection; label: string; icon: string }[]).map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveMainModule("Complaints & Improvements");
                        setActiveComplaintsSubSection(sub.id);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${activeMainModule === "Complaints & Improvements" && activeComplaintsSubSection === sub.id ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-amber-700"}`}
                    >
                      <span className="text-sm">{sub.icon}</span>
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="min-w-0 flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span>Student Portal</span>
                <span>/</span>
                <span className="text-indigo-600 font-semibold">{activeMainModule}</span>
                <span>/</span>
                <span className="text-slate-800 font-bold">
                  {activeMainModule === "Amazon Parcel Management" && activeAmazonSubSection}
                  {activeMainModule === "Hostel Services" && activeHostelSubSection}
                  {activeMainModule === "Lost and Found" && activeLostFoundSubSection}
                  {activeMainModule === "Complaints & Improvements" && activeComplaintsSubSection}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {activeMainModule === "Amazon Parcel Management" && activeAmazonSubSection}
                {activeMainModule === "Hostel Services" && activeHostelSubSection}
                {activeMainModule === "Lost and Found" && activeLostFoundSubSection}
                {activeMainModule === "Complaints & Improvements" && activeComplaintsSubSection}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => { setActiveMainModule("Complaints & Improvements"); setIsComplaintsExpanded(true); }}
                className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                title="Complaints & Improvements"
              >
                📝
              </button>
              <Link
                href="/ai-guide"
                className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 transition"
                title="AI Campus Guide"
              >
                ✨
              </Link>

              <button
                onClick={() => {
                  setActiveMainModule("Amazon Parcel Management");
                  setActiveAmazonSubSection("E-Wallet");
                }}
                className="hidden sm:flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 border border-emerald-200 text-xs font-bold text-emerald-800"
              >
                <span>💳 Wallet:</span>
                <span className="text-sm font-extrabold text-emerald-700">₹{walletBalance}</span>
              </button>

              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 border-l border-slate-200 pl-4 text-left p-1.5 rounded-xl hover:bg-slate-50 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white text-sm">
                  {userProfile.name[0]}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-slate-800">{userProfile.name}</p>
                  <p className="text-[10px] text-slate-400">{userProfile.hostel}</p>
                </div>
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl w-full p-5 sm:p-8 flex-1">
            {/* =============================================================== */}
            {/* MODULE 1: AMAZON PARCEL MANAGEMENT (COMPLETE RICH ORIGINAL UI)  */}
            {/* =============================================================== */}
            {activeMainModule === "Amazon Parcel Management" && (
              <>
                {/* 1.1 DASHBOARD VIEW */}
                {activeAmazonSubSection === "Dashboard" && (
                  <div className="space-y-8">
                    {/* Welcome Banner */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                          YOUR CAMPUS, MADE EASIER
                        </p>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                          Welcome back, {userProfile.name}! 👋
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500">
                          Track your parcels and help fellow students with deliveries.
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setShowAddParcelModal(true)}
                          className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-sm"
                        >
                          + Request Peer Delivery
                        </button>
                        <button
                          onClick={() => setActiveAmazonSubSection("Find Deliveries")}
                          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700"
                        >
                          + Find a Delivery
                        </button>
                      </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500">Incoming Parcels</p>
                            <p className="mt-3 text-3xl font-extrabold text-slate-900">
                              {String(incomingCount).padStart(2, "0")}
                            </p>
                          </div>
                          <div className="rounded-xl bg-indigo-50 p-3 text-xl">📦</div>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Awaiting collection</p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500">Active Deliveries</p>
                            <p className="mt-3 text-3xl font-extrabold text-slate-900">
                              {String(activeDeliveriesCount).padStart(2, "0")}
                            </p>
                          </div>
                          <div className="rounded-xl bg-indigo-50 p-3 text-xl">🚚</div>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Currently in progress</p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:col-span-2 xl:col-span-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500">Wallet Balance</p>
                            <p className="mt-3 text-3xl font-extrabold text-emerald-700">₹{walletBalance}</p>
                          </div>
                          <div className="rounded-xl bg-indigo-50 p-3 text-xl">💳</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs text-slate-500">Available balance</p>
                          <button
                            onClick={() => setShowPaymentGatewayModal(true)}
                            className="text-xs font-bold text-indigo-600 hover:underline"
                          >
                            + Top Up Wallet
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Main Grid: Recent Parcels + Campus Delivery Network Hero */}
                    <div className="grid gap-6 xl:grid-cols-3">
                      {/* Recent Parcels */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6">
                        <div className="mb-6 flex items-center justify-between">
                          <div>
                            <h2 className="text-lg font-bold text-slate-900">Recent Parcels</h2>
                            <p className="mt-1 text-sm text-slate-500">Your latest parcel updates</p>
                          </div>
                          <button
                            onClick={() => setActiveAmazonSubSection("My Parcels")}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            View all →
                          </button>
                        </div>

                        <div className="space-y-4">
                          {parcels.map((parcel) => (
                            <div
                              key={parcel.id}
                              className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-indigo-200 hover:bg-slate-50 sm:flex-row sm:items-center"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                                  📦
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-800">{parcel.name}</h3>
                                  <p className="mt-1 text-xs text-slate-500">{parcel.id}</p>
                                  <p className="mt-1 text-xs text-slate-500">📍 {parcel.location}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${parcel.color}`}
                                >
                                  {parcel.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Partner Card */}
                      <div className="rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-900 p-6 text-white shadow-lg flex flex-col justify-between">
                        <div>
                          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">
                            🚀
                          </div>
                          <p className="text-sm font-medium text-indigo-200">CAMPUS DELIVERY NETWORK</p>
                          <h2 className="mt-3 text-2xl font-bold">Earn while you walk.</h2>
                          <p className="mt-3 text-sm leading-6 text-indigo-100">
                            Already heading to the reception? Pick up a fellow student's parcel and earn a reward on your way.
                          </p>

                          <div className="my-6 rounded-xl border border-white/15 bg-white/10 p-4">
                            <p className="text-sm text-indigo-200">How it works</p>
                            <div className="mt-3 space-y-3 text-sm">
                              <p>01. Browse delivery requests</p>
                              <p>02. Accept a delivery</p>
                              <p>03. Deliver and earn rewards</p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveAmazonSubSection("Find Deliveries")}
                          className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-800 transition hover:bg-indigo-50"
                        >
                          Become a Parcel Partner →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1.2 MY PARCELS */}
                {activeAmazonSubSection === "My Parcels" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Incoming Amazon & Courier Parcels</h3>
                        <p className="text-xs text-slate-500">Parcels for {userProfile.name} ({userProfile.room})</p>
                      </div>
                      <button
                        onClick={() => setShowAddParcelModal(true)}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                      >
                        + Request Peer Delivery
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {parcels.map((parcel) => (
                        <div key={parcel.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold uppercase text-indigo-600">{parcel.courier}</span>
                              <h4 className="text-base font-bold text-slate-900 mt-0.5">{parcel.name}</h4>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">Tracking: {parcel.trackingId}</p>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${parcel.color}`}>
                              {parcel.status}
                            </span>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1.5 border border-slate-100">
                            <p><span className="font-bold">Pickup Gate:</span> {parcel.location}</p>
                            <p><span className="font-bold">Destination:</span> {parcel.hostel}, Room {parcel.room}</p>
                            {parcel.delivererName && (
                              <p className="text-indigo-700 font-bold">🛵 Assigned Deliverer: {parcel.delivererName}</p>
                            )}
                          </div>

                          <div className="flex justify-between items-center bg-indigo-50/50 p-3 rounded-xl border border-indigo-200">
                            <div>
                              <p className="text-[10px] font-bold uppercase text-indigo-800">Delivery Security PIN</p>
                              <p className="text-xs text-slate-500">Give this to deliverer upon room drop-off</p>
                            </div>
                            <span className="font-mono font-black text-indigo-700 text-base">{parcel.deliveryPin}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 1.3 FIND DELIVERIES */}
                {activeAmazonSubSection === "Find Deliveries" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">Campus Parcel Delivery Marketplace</h3>
                          <p className="text-xs text-slate-500">Deliver parcels for fellow students and earn rewards in your E-Wallet.</p>
                        </div>
                        <input
                          type="text"
                          placeholder="Search parcel, hostel, or gate..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full md:w-64 rounded-xl border border-slate-200 px-4 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                        <span className="text-xs font-bold text-slate-500 mr-2">Delivery Scope Filter:</span>
                        <button
                          onClick={() => setHostelScopeFilter("MY_HOSTEL")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                            hostelScopeFilter === "MY_HOSTEL" ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 border"
                          }`}
                        >
                          🏠 My Hostel Only ({userProfile.hostel.split(" ")[0]})
                        </button>
                        <button
                          onClick={() => setHostelScopeFilter("OTHER_HOSTELS")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                            hostelScopeFilter === "OTHER_HOSTELS" ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 border"
                          }`}
                        >
                          🏢 Other Hostels
                        </button>
                        <button
                          onClick={() => setHostelScopeFilter("ALL_HOSTELS")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                            hostelScopeFilter === "ALL_HOSTELS" ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 border"
                          }`}
                        >
                          🌐 All Campus Hostels
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      {filteredDeliveryJobs.map((job) => (
                        <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">{job.courier}</span>
                              <h4 className="text-base font-bold text-slate-900 mt-1">{job.parcelName}</h4>
                              <p className="text-xs text-slate-500">Requested by <span className="font-bold">{job.ownerName}</span></p>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-right">
                              <p className="text-[10px] font-bold text-emerald-800 uppercase">Reward Fee</p>
                              <p className="text-lg font-black text-emerald-700">₹{job.rewardFee}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                            <div>
                              <p className="text-slate-400 text-[10px] font-bold">PICKUP</p>
                              <p className="font-semibold text-slate-800">📍 {job.pickupLocation}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-[10px] font-bold">DESTINATION</p>
                              <p className="font-semibold text-slate-800">🏠 {job.ownerHostel}, {job.ownerRoom}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAcceptDeliveryJob(job)}
                            className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md"
                          >
                            Accept & Deliver for ₹{job.rewardFee}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 1.4 MY DELIVERIES */}
                {activeAmazonSubSection === "My Deliveries" && (
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900">My Active Delivery Tasks</h3>
                      <p className="text-xs text-slate-500">Track delivery jobs you accepted and enter owner PINs to claim your rewards.</p>
                    </div>

                    <div className="space-y-4">
                      {deliveryJobs.filter((j) => j.acceptedByMe).length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                          <p className="text-3xl">🚚</p>
                          <h4 className="mt-2 text-sm font-bold text-slate-800">No active delivery tasks</h4>
                          <p className="text-xs text-slate-400 mb-4">Accept requests from the Find Deliveries tab to earn rewards!</p>
                        </div>
                      ) : (
                        deliveryJobs.filter((j) => j.acceptedByMe).map((job) => (
                          <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b pb-3">
                              <div>
                                <h4 className="text-base font-bold text-slate-900">{job.parcelName}</h4>
                                <p className="text-xs text-slate-500">Deliver to {job.ownerName} ({job.ownerHostel}, Room {job.ownerRoom})</p>
                              </div>
                              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Earn ₹{job.rewardFee}</span>
                            </div>

                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                              <p className="text-xs text-slate-600"><span className="font-bold">Pickup:</span> {job.pickupLocation}</p>
                              <div className="flex gap-2">
                                {job.status === "Accepted" && (
                                  <button onClick={() => handleUpdateJobStatus(job.id, "Picked Up")} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white">
                                    Mark Picked Up from Gate
                                  </button>
                                )}
                                {job.status === "Picked Up" && (
                                  <button onClick={() => handleUpdateJobStatus(job.id, "Delivered")} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md">
                                    Verify PIN & Claim ₹{job.rewardFee}
                                  </button>
                                )}
                                {job.status === "Delivered" && (
                                  <span className="text-xs font-bold text-emerald-700">✓ Completed & Credited</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 1.5 E-WALLET */}
                {activeAmazonSubSection === "E-Wallet" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 text-white shadow-lg flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">CAMPUS E-WALLET BALANCE</p>
                        <h3 className="text-4xl font-black mt-2">₹{walletBalance}.00</h3>
                        <p className="text-xs text-teal-100 mt-1">Available balance for peer delivery rewards, food & snacks</p>
                      </div>
                      <button
                        onClick={() => setShowPaymentGatewayModal(true)}
                        className="rounded-xl bg-white px-5 py-3 text-xs font-extrabold text-emerald-900 shadow-md hover:bg-emerald-50"
                      >
                        + Add Funds via Razorpay / UPI
                      </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                      <h3 className="text-base font-bold text-slate-900">Wallet Transactions</h3>
                      <div className="space-y-3">
                        {transactions.map((txn) => (
                          <div key={txn.id} className="flex justify-between items-center p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50">
                            <div>
                              <h4 className="font-bold text-xs text-slate-800">{txn.title}</h4>
                              <p className="text-[11px] text-slate-400">{txn.reference}</p>
                            </div>
                            <span className={`text-sm font-black ${txn.amount > 0 ? "text-emerald-600" : "text-slate-800"}`}>
                              {txn.amount > 0 ? `+₹${txn.amount}` : `-₹${Math.abs(txn.amount)}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1.6 MESSAGES */}
                {activeAmazonSubSection === "Messages" && (
                  <div className="h-[650px] rounded-2xl border border-slate-200 bg-white shadow-sm flex overflow-hidden">
                    <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                      <div className="p-4 border-b bg-white">
                        <h3 className="text-sm font-bold text-slate-900">Peer Delivery Conversations</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {chatThreads.map((thread) => (
                          <button
                            key={thread.id}
                            onClick={() => setActiveChatId(thread.id)}
                            className={`w-full p-4 text-left ${activeChatId === thread.id ? "bg-white border-l-4 border-indigo-600" : "hover:bg-slate-100"}`}
                          >
                            <p className="text-xs font-bold text-slate-900">{thread.contactName}</p>
                            <p className="text-[10px] text-indigo-600">{thread.contactRole}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{thread.messages[thread.messages.length - 1]?.text}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col bg-white">
                      {(() => {
                        const activeThread = chatThreads.find((c) => c.id === activeChatId);
                        if (!activeThread) return null;
                        return (
                          <>
                            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                              <h4 className="text-sm font-bold text-slate-900">{activeThread.contactName}</h4>
                              <button
                                onClick={() => setChatInputText("My 4-digit Delivery PIN is 4921")}
                                className="rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-700"
                              >
                                🔑 Share PIN Shortcut
                              </button>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
                              {activeThread.messages.map((m) => (
                                <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                                  <div className={`p-3 rounded-2xl text-xs max-w-sm ${m.sender === "me" ? "bg-indigo-600 text-white" : "bg-white border"}`}>
                                    {m.text}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="p-4 border-t flex gap-2">
                              <input
                                type="text"
                                placeholder="Type your message..."
                                value={chatInputText}
                                onChange={(e) => setChatInputText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                className="flex-1 border rounded-xl p-3 text-xs focus:outline-none"
                              />
                              <button onClick={handleSendMessage} className="bg-indigo-600 text-white font-bold px-5 py-3 rounded-xl text-xs">
                                Send
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* =============================================================== */}
            {/* MODULE 2: HOSTEL SERVICES                                       */}
            {/* =============================================================== */}
            {activeMainModule === "Hostel Services" && (
              <div className="space-y-6">
                {activeHostelSubSection === "Student Snacks" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-teal-600 uppercase">STUDENT-TO-STUDENT MARKETPLACE</span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">🍿 Student Snacks & Room Pantry</h3>
                        <p className="text-xs text-slate-500">Buy homemade snacks or sell room treats to fellow residents.</p>
                      </div>
                      <button onClick={() => setShowAddSnackModal(true)} className="rounded-xl bg-teal-600 px-5 py-3 text-xs font-bold text-white shadow-md">
                        + Sell a Snack (List Item)
                      </button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {studentSnacks.map((snack) => (
                        <div key={snack.id} className="rounded-2xl border bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-3xl">{snack.emoji}</span>
                              <span className="rounded-full bg-emerald-50 px-3 py-1 font-black text-sm text-emerald-700">₹{snack.price}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 mt-2">{snack.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">Seller: {snack.sellerName} ({snack.sellerRoom})</p>
                          </div>
                          <button onClick={() => handleBuyStudentSnack(snack)} className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white">
                            Buy for ₹{snack.price} (Pay via Wallet)
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeHostelSubSection === "Night Canteen" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b pb-4">
                        <div>
                          <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">🤖 AI Vision OCR Active</span>
                          <h3 className="text-xl font-black text-slate-900 mt-1">🌙 Campus Night Canteen Menu</h3>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedPhotoPreview(null);
                            setUploadedPhotoName("");
                            setExtractedItemsFromPhoto([]);
                            setShowUploadMenuModal(true);
                          }}
                          className="rounded-xl bg-purple-600 px-5 py-3 text-xs font-black text-white"
                        >
                          📸 Upload Menu Photo (AI Detector)
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {nightCanteenItems.map((item) => (
                        <div key={item.id} className="rounded-2xl border bg-white p-5 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">🤖 AI Verified</span>
                            <h4 className="font-bold text-slate-900 mt-1">{item.name}</h4>
                            <p className="text-xs text-slate-400">Prep Time: {item.prepTime}</p>
                          </div>
                          <span className="text-lg font-black text-emerald-700">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeHostelSubSection === "Mess Food Menu" && (
                  <div className="rounded-2xl border bg-white p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-900">🍱 Central Mess Food Menu</h3>
                      <div className="flex gap-2">
                        {(["Today", "Sunday", "Monday"] as const).map((day) => (
                          <button
                            key={day}
                            onClick={() => setSelectedMessDay(day)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${selectedMessDay === day ? "bg-indigo-600 text-white" : "bg-slate-100"}`}
                          >
                            {MESS_WEEKLY_MENU[day].dayName}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="text-xs font-bold text-amber-900">🍳 BREAKFAST (07:30 - 09:30 AM)</span>
                        <p className="text-xs text-slate-800 mt-1">{MESS_WEEKLY_MENU[selectedMessDay].breakfast}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-xs font-bold text-emerald-900">🍛 LUNCH (12:30 - 02:30 PM)</span>
                        <p className="text-xs text-slate-800 mt-1">{MESS_WEEKLY_MENU[selectedMessDay].lunch}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                        <span className="text-xs font-bold text-orange-900">☕ EVENING TEA (04:30 - 05:30 PM)</span>
                        <p className="text-xs text-slate-800 mt-1">{MESS_WEEKLY_MENU[selectedMessDay].snacks}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                        <span className="text-xs font-bold text-indigo-900">🍽️ DINNER (07:30 - 09:30 PM)</span>
                        <p className="text-xs text-slate-800 mt-1">{MESS_WEEKLY_MENU[selectedMessDay].dinner}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeHostelSubSection === "Hostel General Chat" && (
                  <div className="rounded-2xl border bg-white p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">💬 {userProfile.hostel.split(" ")[0]} Resident Forum</h3>
                    <div className="space-y-3">
                      {communityPosts.map((post) => (
                        <div key={post.id} className="p-4 rounded-xl border bg-slate-50">
                          <p className="font-bold text-xs text-slate-900">{post.authorName} ({post.authorRoom})</p>
                          <p className="text-xs text-slate-700 mt-1">{post.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =============================================================== */}
            {/* MODULE 3: 6.5 LOST AND FOUND                                    */}
            {/* =============================================================== */}
            {activeMainModule === "Lost and Found" && (
              <div className="space-y-6">
                {activeLostFoundSubSection === "Lost Products" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-rose-600 uppercase">LF-01 · MISSING CAMPUS BELONGINGS</span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">🔍 Lost Products Section</h3>
                      </div>
                      <button onClick={() => setShowReportLostModal(true)} className="rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold text-white shadow-md">
                        + Report Lost Product
                      </button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {lostFoundItems.filter(i => i.type === "LOST").map((item) => (
                        <div key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
                          <div>
                            <span className="text-3xl">{item.emoji}</span>
                            <h4 className="font-bold text-slate-900 mt-2">{item.title}</h4>
                            <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                            <p className="text-xs text-slate-500 mt-2">📍 Lost At: {item.location}</p>
                          </div>
                          <button onClick={() => handleInitiateItemChat(item)} className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white">
                            I Found This! Contact Owner
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeLostFoundSubSection === "Found Products" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase">LF-02 · RECOVERED CAMPUS BELONGINGS</span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">📦 Found Products Section</h3>
                      </div>
                      <button onClick={() => setShowReportFoundModal(true)} className="rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md">
                        + Report Found Product
                      </button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {lostFoundItems.filter(i => i.type === "FOUND").map((item) => (
                        <div key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
                          <div>
                            <span className="text-3xl">{item.emoji}</span>
                            <h4 className="font-bold text-slate-900 mt-2">{item.title}</h4>
                            <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                            <p className="text-xs text-slate-500 mt-2">📍 Found At: {item.location}</p>
                            {item.handoverLocation && <p className="text-xs text-emerald-700 font-bold mt-1">Safe Deposit: {item.handoverLocation}</p>}
                          </div>
                          <button onClick={() => setShowClaimModal(item)} className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white">
                            This is Mine! Claim & Contact Finder
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeLostFoundSubSection === "Private Item Chat" && (
                  <div className="h-[650px] rounded-2xl border bg-white flex overflow-hidden">
                    <div className="w-80 border-r bg-slate-50 p-4">
                      <h4 className="font-bold text-xs text-slate-900 mb-3">Item Conversations</h4>
                      {lfChats.map(c => (
                        <button key={c.id} onClick={() => setActiveLfChatId(c.id)} className={`w-full text-left p-3 rounded-xl border mb-2 ${activeLfChatId === c.id ? "bg-white border-rose-500" : "bg-white"}`}>
                          <p className="font-bold text-xs text-slate-900">{c.itemTitle}</p>
                          <p className="text-[11px] text-slate-500">{c.contactName}</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 flex flex-col bg-white">
                      {(() => {
                        const current = lfChats.find(c => c.id === activeLfChatId);
                        if (!current) return <div className="p-8 text-xs text-slate-400">Select a chat</div>;
                        return (
                          <>
                            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                              <h4 className="font-bold text-xs text-slate-900">{current.itemTitle} ({current.contactName})</h4>
                              <button onClick={() => handleMarkItemResolved(current.itemId)} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">
                                ✓ Mark Returned & Resolve
                              </button>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-slate-50/50">
                              {current.messages.map(m => (
                                <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                                  <div className={`p-3 rounded-2xl text-xs max-w-sm ${m.sender === "me" ? "bg-rose-600 text-white" : "bg-white border"}`}>
                                    {m.text}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* =============================================================== */}
            {/* MODULE 5: COMPLAINTS & IMPROVEMENTS                             */}
            {/* =============================================================== */}
            {activeMainModule === "Complaints & Improvements" && (
              <div className="space-y-6 max-w-2xl">

                {/* 5.1 SUBMIT ANONYMOUS COMPLAINT */}
                {activeComplaintsSubSection === "Submit Anonymous Complaint" && (
                  <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Submit a Complaint</h2>
                      <p className="text-slate-500 text-sm mb-5">All submissions are fully anonymous. No personal information is collected or stored against your identity.</p>

                      <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 p-4">
                        <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">🔒 Anonymity Notice</p>
                        <p className="text-xs text-amber-800 leading-relaxed">Do <strong>not</strong> include your name, student ID, roll number, email, or any identifying information in the subject or description.</p>
                      </div>

                      {cmpStatus === "success" && cmpResult ? (
                        <div className="space-y-4">
                          <div className="text-center py-4">
                            <div className="h-14 w-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">✅</div>
                            <h3 className="text-xl font-extrabold text-slate-900">Ticket Submitted!</h3>
                            <p className="text-sm text-slate-500 mt-1">Your complaint has been submitted anonymously.</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Public Ticket ID</p>
                            <p className="text-2xl font-extrabold text-indigo-700 mt-1">{cmpResult.ticketId}</p>
                          </div>
                          <div className="rounded-xl bg-amber-50 border-2 border-amber-400 p-4">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">🔐 Tracking Secret — Save This Now!</p>
                              <button onClick={() => { navigator.clipboard.writeText(cmpResult.trackingSecret); setCmpSecretCopied(true); }}
                                className="text-xs font-bold text-amber-700 hover:text-amber-900 border border-amber-300 rounded-lg px-2 py-1 transition">
                                {cmpSecretCopied ? "✓ Copied!" : "Copy"}
                              </button>
                            </div>
                            <p className="text-base font-mono break-all text-amber-900 bg-amber-100 rounded-lg p-2 mt-2">{cmpResult.trackingSecret}</p>
                            <p className="text-xs text-rose-700 font-bold mt-2">⚠️ This is shown only ONCE. Store it safely to track your ticket later.</p>
                          </div>
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={cmpAcknowledged} onChange={e => setCmpAcknowledged(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-amber-600" />
                            <span className="text-sm text-slate-700">I have saved my Ticket ID and Tracking Secret in a safe place.</span>
                          </label>
                          <div className="flex gap-3 pt-1">
                            <button
                              onClick={() => { if (cmpAcknowledged) { setActiveComplaintsSubSection("Track My Complaint"); } }}
                              className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${cmpAcknowledged ? "bg-amber-600 hover:bg-amber-700 text-white shadow-sm" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                              Track This Ticket
                            </button>
                            <button
                              onClick={() => { setCmpStatus("idle"); setCmpResult(null); setCmpSubject(""); setCmpDescription(""); setCmpAcknowledged(false); setCmpSecretCopied(false); }}
                              className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                              Submit Another
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          let valid = true;
                          if (!cmpSubject.trim() || cmpSubject.trim().length < 5) { setCmpSubjectError("Subject must be at least 5 characters."); valid = false; } else { setCmpSubjectError(""); }
                          if (!cmpDescription.trim() || cmpDescription.trim().length < 20) { setCmpDescError("Description must be at least 20 characters."); valid = false; } else { setCmpDescError(""); }
                          if (!valid) return;
                          setCmpStatus("loading"); setCmpError("");
                          try {
                            const body = { type: cmpType, category: cmpCategory, subject: cmpSubject.trim(), description: cmpDescription.trim(), evidenceFiles: cmpEvidenceFile ? [cmpEvidenceFile] : [] };
                            const res = await fetch("/api/complaints", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                            if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Submission failed"); }
                            const data = await res.json();
                            setCmpResult(data);
                            setCmpStatus("success");
                            setCmpHistory(prev => [{ ticketId: data.ticketId, type: cmpType, subject: cmpSubject.trim(), submittedAt: new Date().toLocaleString("en-IN") }, ...prev]);
                          } catch (err: unknown) {
                            setCmpError(err instanceof Error ? err.message : "Something went wrong.");
                            setCmpStatus("error");
                          }
                        }} className="space-y-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Submission Type *</label>
                            <div className="flex gap-2">
                              {(["Complaint", "Improvement"] as const).map(t => (
                                <button key={t} type="button" onClick={() => setCmpType(t)}
                                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition ${cmpType === t ? "bg-amber-600 text-white border-amber-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-amber-400"}`}>
                                  {t === "Complaint" ? "🚨 Complaint" : "💡 Improvement"}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Category *</label>
                            <select value={cmpCategory} onChange={e => setCmpCategory(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400">
                              {["Hostel", "Mess and Food", "Infrastructure", "Academics", "Transport", "Campus Facilities", "Internet and Technology", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Subject *</label>
                            <input type="text" value={cmpSubject} onChange={e => setCmpSubject(e.target.value)} placeholder="Brief summary — avoid personal information"
                              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 ${cmpSubjectError ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white"}`} />
                            {cmpSubjectError && <p className="mt-1 text-xs text-rose-600">{cmpSubjectError}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Description *</label>
                            <textarea rows={5} value={cmpDescription} onChange={e => setCmpDescription(e.target.value)}
                              placeholder="Describe the issue in detail. Do not mention your name or student ID."
                              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none ${cmpDescError ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white"}`} />
                            <div className="flex justify-between mt-1">
                              {cmpDescError ? <p className="text-xs text-rose-600">{cmpDescError}</p> : <span />}
                              <p className="text-xs text-slate-400">{cmpDescription.length} chars</p>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Evidence (Optional)</label>
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                              <input type="file" id="cmp-evidence" accept="image/*,.pdf" className="hidden" onChange={e => setCmpEvidenceFile(e.target.files?.[0]?.name || "")} />
                              <label htmlFor="cmp-evidence" className="cursor-pointer">
                                <p className="text-2xl mb-2">📎</p>
                                <p className="text-sm font-semibold text-slate-600">{cmpEvidenceFile || "Click to attach a file"}</p>
                                <p className="text-xs text-slate-400 mt-1">Images or PDF. Max 5 MB. Ensure no personal info visible.</p>
                              </label>
                              {cmpEvidenceFile && <button type="button" onClick={() => setCmpEvidenceFile("")} className="mt-2 text-xs text-rose-500 hover:text-rose-700">Remove</button>}
                            </div>
                          </div>
                          {cmpStatus === "error" && (
                            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
                              <p className="text-sm font-bold text-rose-700">Submission Failed</p>
                              <p className="text-xs text-rose-600 mt-1">{cmpError}</p>
                            </div>
                          )}
                          <button type="submit" disabled={cmpStatus === "loading"}
                            className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-sm shadow-sm transition">
                            {cmpStatus === "loading" ? "Submitting..." : `Submit ${cmpType} Anonymously`}
                          </button>
                          <p className="text-center text-xs text-slate-400">No personal data is stored. A one-time tracking secret will be shown after submission.</p>
                          <p className="text-center text-xs text-slate-400 italic">⚠️ Demo mode: data is stored in-memory and will be lost on server restart.</p>
                        </form>
                      )}
                    </div>
                  </div>
                )}

                {/* 5.2 SUBMIT IMPROVEMENT SUGGESTION */}
                {activeComplaintsSubSection === "Submit Improvement Suggestion" && (
                  <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Submit an Improvement Suggestion</h2>
                      <p className="text-slate-500 text-sm mb-5">Suggest improvements to campus services, infrastructure, or academic facilities — fully anonymous.</p>

                      <div className="mb-5 rounded-xl bg-blue-50 border border-blue-200 p-4">
                        <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-1">💡 Suggestion Tips</p>
                        <p className="text-xs text-blue-800 leading-relaxed">Be specific about what could be improved and how. Good suggestions include a clear problem statement and a proposed solution.</p>
                      </div>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        let valid = true;
                        if (!cmpSubject.trim() || cmpSubject.trim().length < 5) { setCmpSubjectError("Subject must be at least 5 characters."); valid = false; } else { setCmpSubjectError(""); }
                        if (!cmpDescription.trim() || cmpDescription.trim().length < 20) { setCmpDescError("Description must be at least 20 characters."); valid = false; } else { setCmpDescError(""); }
                        if (!valid) return;
                        setCmpStatus("loading"); setCmpError("");
                        try {
                          const body = { type: "Improvement", category: cmpCategory, subject: cmpSubject.trim(), description: cmpDescription.trim(), evidenceFiles: [] };
                          const res = await fetch("/api/complaints", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                          if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Submission failed"); }
                          const data = await res.json();
                          setCmpResult(data);
                          setCmpStatus("success");
                          setCmpHistory(prev => [{ ticketId: data.ticketId, type: "Improvement", subject: cmpSubject.trim(), submittedAt: new Date().toLocaleString("en-IN") }, ...prev]);
                          alert(`✅ Suggestion submitted! Ticket ID: ${data.ticketId}\nSave your tracking secret: ${data.trackingSecret}`);
                          setCmpSubject(""); setCmpDescription(""); setCmpStatus("idle"); setCmpResult(null);
                        } catch (err: unknown) {
                          setCmpError(err instanceof Error ? err.message : "Something went wrong.");
                          setCmpStatus("error");
                        }
                      }} className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Category *</label>
                          <select value={cmpCategory} onChange={e => setCmpCategory(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400">
                            {["Hostel", "Mess and Food", "Infrastructure", "Academics", "Transport", "Campus Facilities", "Internet and Technology", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Suggestion Title *</label>
                          <input type="text" value={cmpSubject} onChange={e => setCmpSubject(e.target.value)} placeholder="e.g. Improve WiFi coverage in Block B study hall"
                            className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 ${cmpSubjectError ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white"}`} />
                          {cmpSubjectError && <p className="mt-1 text-xs text-rose-600">{cmpSubjectError}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Detailed Suggestion *</label>
                          <textarea rows={6} value={cmpDescription} onChange={e => setCmpDescription(e.target.value)}
                            placeholder="Describe your suggestion in detail. Explain the current problem and your proposed improvement..."
                            className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none ${cmpDescError ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white"}`} />
                          <div className="flex justify-between mt-1">
                            {cmpDescError ? <p className="text-xs text-rose-600">{cmpDescError}</p> : <span />}
                            <p className="text-xs text-slate-400">{cmpDescription.length} chars</p>
                          </div>
                        </div>
                        {cmpStatus === "error" && (
                          <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
                            <p className="text-sm font-bold text-rose-700">Submission Failed</p>
                            <p className="text-xs text-rose-600 mt-1">{cmpError}</p>
                          </div>
                        )}
                        <button type="submit" disabled={cmpStatus === "loading"}
                          className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-sm shadow-sm transition">
                          {cmpStatus === "loading" ? "Submitting..." : "Submit Suggestion Anonymously 💡"}
                        </button>
                        <p className="text-center text-xs text-slate-400 italic">⚠️ Demo mode: data is stored in-memory and will be lost on server restart.</p>
                      </form>
                    </div>
                  </div>
                )}

                {/* 5.3 TRACK MY COMPLAINT */}
                {activeComplaintsSubSection === "Track My Complaint" && (
                  <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Track Your Ticket</h2>
                      <p className="text-slate-500 text-sm mb-6">Enter your Ticket ID and the Tracking Secret you saved at submission.</p>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!trackTicketId.trim() || !trackSecret.trim()) { setTrackError("Both Ticket ID and Tracking Secret are required."); return; }
                        setTrackStatus("loading"); setTrackError(""); setTrackResult(null);
                        try {
                          const params = new URLSearchParams({ ticketId: trackTicketId.trim(), secret: trackSecret.trim() });
                          const res = await fetch(`/api/complaints/track?${params}`);
                          if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Not found"); }
                          const data = await res.json();
                          setTrackResult(data);
                          setFeedbackRating(data.rating || 0);
                          setFeedbackComment(data.feedbackComment || "");
                          setFeedbackState(data.rating ? "success" : "idle");
                          setTrackStatus("success");
                        } catch (err: unknown) {
                          setTrackError(err instanceof Error ? err.message : "Ticket not found. Check your Ticket ID and Tracking Secret.");
                          setTrackStatus("error");
                        }
                      }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Ticket ID *</label>
                          <input type="text" value={trackTicketId} onChange={e => setTrackTicketId(e.target.value)} placeholder="e.g. TKT-3421-AB2C"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Tracking Secret *</label>
                          <input type="password" value={trackSecret} onChange={e => setTrackSecret(e.target.value)} placeholder="Your one-time tracking secret"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        </div>
                        {trackStatus === "error" && (
                          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3">
                            <p className="text-sm text-rose-700 font-semibold">{trackError}</p>
                          </div>
                        )}
                        <button type="submit" disabled={trackStatus === "loading"}
                          className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-sm shadow-sm transition">
                          {trackStatus === "loading" ? "Looking up..." : "Find My Ticket"}
                        </button>
                      </form>

                      {trackStatus === "success" && trackResult && (
                        <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{trackResult.type}</p>
                              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{trackResult.subject}</h3>
                              <p className="text-xs text-slate-500 mt-1">{trackResult.category} · Submitted {new Date(trackResult.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold shrink-0 ml-4 ${trackResult.status === "Resolved" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : trackResult.status === "In Progress" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                              {trackResult.status}
                            </span>
                          </div>
                          <div className="px-6 py-4 border-b border-slate-100">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Description</p>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{trackResult.description}</p>
                          </div>
                          {trackResult.updates && trackResult.updates.length > 0 && (
                            <div className="px-6 py-4">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Status History</p>
                              <ol className="space-y-3">
                                {[...trackResult.updates].reverse().map((u: { id: string; status: string; comment: string; timestamp: string }) => (
                                  <li key={u.id} className="flex gap-3 items-start text-sm">
                                    <span className="mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold shrink-0 bg-slate-100 text-slate-700">{u.status}</span>
                                    <div>
                                      <p className="text-slate-700">{u.comment}</p>
                                      <p className="text-xs text-slate-400 mt-0.5">{new Date(u.timestamp).toLocaleString("en-IN")}</p>
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4">
                        <p className="text-xs text-amber-800"><strong>🔒 Security:</strong> Your Tracking Secret is transmitted securely and never logged. This page does not remember your credentials between sessions.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5.4 COMPLAINT HISTORY */}
                {activeComplaintsSubSection === "Complaint History" && (
                  <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Session History</h2>
                      <p className="text-slate-500 text-sm mb-2">Tickets submitted during this browser session. This list is local only — it is not permanently stored.</p>
                      <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 p-3">
                        <p className="text-xs text-amber-800"><strong>🔒 Privacy:</strong> No ticket content or identity is stored between sessions. This view shows only tickets you submitted while this page was open.</p>
                      </div>

                      {cmpHistory.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                          <p className="text-3xl">📋</p>
                          <h4 className="mt-2 text-sm font-bold text-slate-800">No tickets in this session</h4>
                          <p className="text-xs text-slate-400 mb-4">Submit a complaint or suggestion to see it appear here.</p>
                          <button onClick={() => setActiveComplaintsSubSection("Submit Anonymous Complaint")}
                            className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-700 transition">
                            Submit Your First Complaint
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {cmpHistory.map((h, i) => (
                            <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-start justify-between gap-4">
                              <div>
                                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold mb-1 ${h.type === "Complaint" ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"}`}>
                                  {h.type === "Complaint" ? "🚨 Complaint" : "💡 Improvement"}
                                </span>
                                <p className="font-bold text-sm text-slate-900">{h.subject}</p>
                                <p className="text-xs text-slate-400 mt-1">Submitted: {h.submittedAt}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ticket ID</p>
                                <p className="font-mono font-black text-indigo-700 text-sm">{h.ticketId}</p>
                              </div>
                            </div>
                          ))}
                          <button onClick={() => setActiveComplaintsSubSection("Track My Complaint")}
                            className="w-full py-2.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-700 hover:bg-amber-50 transition mt-2">
                            🔎 Track a Ticket Status →
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
                      <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-2">🔒 Privacy & Anonymity Guarantee</h3>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        Your identity is never linked to your submissions. We do not track your student ID, email, or IP address.
                        <br /><br />
                        <strong>Important:</strong> Please ensure you do not accidentally include identifying information (like your name or roll number) in the ticket description or uploaded evidence.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </section>
      </div>

      {/* ALL MODALS (ADD PARCEL, PAYMENT GATEWAY, PIN VERIFY, EDIT PROFILE, AI MENU, LOST/FOUND) */}
      {showAddParcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Request Amazon Peer Delivery</h3>
              <button onClick={() => setShowAddParcelModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddNewParcelRequest} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Parcel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Package (Electronics)"
                  value={newParcelName}
                  onChange={(e) => setNewParcelName(e.target.value)}
                  className="mt-1 w-full border p-3 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Tracking ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AMZ-9938210"
                  value={newTrackingId}
                  onChange={(e) => setNewTrackingId(e.target.value)}
                  className="mt-1 w-full border p-3 rounded-xl font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Delivery Reward Fee (₹)</label>
                <input
                  type="number"
                  min="20"
                  max="200"
                  value={newDeliveryFee}
                  onChange={(e) => setNewDeliveryFee(Number(e.target.value))}
                  className="mt-1 w-full border p-3 rounded-xl font-bold text-emerald-700"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddParcelModal(false)} className="w-1/2 border py-2 text-xs font-bold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2 text-xs font-bold rounded-xl">Confirm Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentGatewayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Funds via Razorpay / UPI</h3>
              <button onClick={() => setShowPaymentGatewayModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[100, 200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold ${topUpAmount === amt ? "bg-indigo-600 text-white" : "bg-slate-100"}`}
                >
                  +₹{amt}
                </button>
              ))}
            </div>
            <button onClick={handleProcessPayment} className="w-full bg-emerald-600 py-3 rounded-xl text-xs font-black text-white">
              {isProcessingPayment ? "Processing..." : `Pay ₹${topUpAmount} via Razorpay`}
            </button>
          </div>
        </div>
      )}

      {showPinVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Verify Delivery PIN</h3>
            <input
              type="text"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              className="w-full text-center border p-3 font-mono text-xl font-bold rounded-xl"
            />
            {pinError && <p className="text-xs text-rose-600 font-bold">{pinError}</p>}
            <button onClick={handleVerifyPinAndComplete} className="w-full bg-emerald-600 py-3 text-xs font-bold text-white rounded-xl">
              Verify PIN & Claim Reward
            </button>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Edit Profile</h3>
            <input type="text" value={editNameInput} onChange={(e) => setEditNameInput(e.target.value)} className="w-full border p-3 rounded-xl text-xs" />
            <input type="text" value={editHostelInput} onChange={(e) => setEditHostelInput(e.target.value)} className="w-full border p-3 rounded-xl text-xs" />
            <div className="flex gap-2">
              <button onClick={() => setShowProfileModal(false)} className="w-1/2 border py-2 text-xs font-bold">Cancel</button>
              <button onClick={() => { setUserProfile({ ...userProfile, name: editNameInput, hostel: editHostelInput }); setShowProfileModal(false); }} className="w-1/2 bg-indigo-600 text-white py-2 text-xs font-bold rounded-xl">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI MENU MODAL */}
      {showUploadMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Upload Menu Photo for AI Detection</h3>
              <button onClick={() => setShowUploadMenuModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <input type="file" accept="image/*" onChange={handlePhotoSelected} className="w-full border p-3 rounded-xl text-xs" />
            {uploadedPhotoPreview && (
              <img src={uploadedPhotoPreview} alt="Menu Preview" className="max-h-48 mx-auto rounded-xl object-contain border" />
            )}
            <div className="flex gap-2">
              <button onClick={handleRunAiPhotoScanner} className="w-1/2 bg-purple-600 text-white font-bold py-2.5 rounded-xl text-xs">
                {isAnalyzingPhoto ? "Scanning..." : "🤖 Run AI Scanner"}
              </button>
              <button onClick={handlePublishExtractedItems} className="w-1/2 bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs">
                Publish to Menu →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLAIM LOST/FOUND ITEM MODAL */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Claim {showClaimModal.title}</h3>
            <p className="text-xs text-slate-500">Security Question: "{showClaimModal.verificationQuestion}"</p>
            <textarea
              rows={3}
              placeholder="Your answer or proof of ownership..."
              value={claimAnswerInput}
              onChange={(e) => setClaimAnswerInput(e.target.value)}
              className="w-full border p-3 rounded-xl text-xs"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowClaimModal(null)} className="w-1/2 border py-2 text-xs font-bold">Cancel</button>
              <button
                onClick={() => {
                  const itm = showClaimModal;
                  setShowClaimModal(null);
                  handleInitiateItemChat(itm, `Hello ${itm.reporterName}! Claiming ownership for ${itm.title}: ${claimAnswerInput}`);
                }}
                className="w-1/2 bg-emerald-600 text-white py-2 text-xs font-bold rounded-xl"
              >
                Start Private Chat →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}