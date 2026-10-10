"use client";

import { useState } from "react";

// Types
type HostelScope = "MY_HOSTEL" | "OTHER_HOSTELS" | "ALL_HOSTELS";
type PaymentMethod = "razorpay" | "upi" | "card" | "netbanking";
type MainModule = "Amazon Parcel Management" | "Hostel Services" | "Lost and Found";
type HostelSubSection =
  | "Student Snacks"
  | "Night Canteen"
  | "Mess Food Menu"
  | "Hostel General Chat";
type LostFoundSubSection =
  | "Lost Products"
  | "Found Products"
  | "Private Item Chat";

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

interface HostelCommunityPost {
  id: string;
  authorName: string;
  authorRoom: string;
  channel: "#general-discussion" | "#mess-updates" | "#night-canteen" | "#announcements";
  text: string;
  timestamp: string;
  likes: number;
  isWarden?: boolean;
}

// 6.5 Lost & Found Item Model
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
  photoUrl?: string;
  emoji: string;
}

// Private Lost & Found Direct Chat Thread
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
    name: "Electronics (Wireless Earbuds)",
    courier: "Amazon Logistics",
    location: "Central Gate Security Locker",
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
    name: "Books & Study Stationery",
    courier: "Amazon Transportation",
    location: "Main Reception Counter",
    hostel: "Gargi Hostel (Block A)",
    room: "A-304",
    status: "In Transit",
    deliveryFee: 30,
    deliveryPin: "8102",
    delivererName: "Ananya R. (Gargi B-102)",
    delivererPhone: "+91 98765 43210",
    arrivedAt: "Today, 11:30 AM",
    color: "bg-blue-100 text-blue-700 border-blue-200",
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
    text: "📢 Important Notice: Mess maintenance scheduled tomorrow 3-4 PM.",
    timestamp: "Today, 09:30 AM",
    likes: 24,
    isWarden: true,
  },
];

// Initial Lost and Found Items
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
  {
    id: "LF-ITEM-104",
    type: "FOUND",
    title: "Casio Scientific Calculator FX-991EX",
    category: "Books & Study",
    location: "Auditorium Hall B, Row 8",
    date: "09 Oct 2026",
    description: "Found after Engineering Math exam. Has name initial engraved on inner cover.",
    reporterName: "Sneha M.",
    reporterContactMasked: "Sneh••••@amrita.edu",
    handoverLocation: "Gargi Hostel Reception Counter",
    verificationQuestion: "What initial is engraved inside the slide cover?",
    status: "Active",
    emoji: "🔢",
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

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "TXN-901",
    title: "Earned from Delivery #DEL-488",
    category: "EARNING",
    amount: 35,
    date: "10 Oct 2026, 03:15 PM",
    reference: "Delivered to Gargi B-105",
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
        text: "Hi Hamshitha! I picked up your Amazon parcel.",
        timestamp: "11:32 AM",
      },
    ],
  },
];

export default function AmritaPlexusApp() {
  // Navigation State
  const [activeMainModule, setActiveMainModule] = useState<MainModule>("Lost and Found");
  const [isAmazonSectionExpanded, setIsAmazonSectionExpanded] = useState(true);
  const [isHostelServicesExpanded, setIsHostelServicesExpanded] = useState(true);
  const [isLostFoundExpanded, setIsLostFoundExpanded] = useState(true);

  // Subsections
  const [activeAmazonSubSection, setActiveAmazonSubSection] = useState<
    "Dashboard" | "My Parcels" | "Find Deliveries" | "My Deliveries" | "E-Wallet" | "Messages"
  >("Dashboard");

  const [activeHostelSubSection, setActiveHostelSubSection] =
    useState<HostelSubSection>("Student Snacks");

  const [activeLostFoundSubSection, setActiveLostFoundSubSection] =
    useState<LostFoundSubSection>("Found Products");

  // User Profile State
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

  // Core Data Stores
  const [parcels, setParcels] = useState<Parcel[]>(INITIAL_PARCELS);
  const [deliveryJobs, setDeliveryJobs] = useState<DeliveryJob[]>(INITIAL_DELIVERY_JOBS);
  const [walletBalance, setWalletBalance] = useState<number>(250);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(INITIAL_CHATS);

  // Hostel Data Stores
  const [studentSnacks, setStudentSnacks] = useState<StudentSnack[]>(INITIAL_STUDENT_SNACKS);
  const [nightCanteenItems, setNightCanteenItems] = useState<NightCanteenItem[]>(INITIAL_NIGHT_CANTEEN);
  const [selectedMessDay, setSelectedMessDay] = useState<"Today" | "Sunday" | "Monday">("Today");
  const [communityPosts, setCommunityPosts] = useState<HostelCommunityPost[]>(INITIAL_HOSTEL_POSTS);
  const [activeChannelFilter, setActiveChannelFilter] = useState<string>("#general-discussion");

  // 6.5 Lost & Found Data Stores
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(INITIAL_LOST_FOUND_ITEMS);
  const [lfChats, setLfChats] = useState<LostFoundChatThread[]>(INITIAL_LF_CHATS);
  const [activeLfChatId, setActiveLfChatId] = useState<string>("LF-CHAT-01");
  const [lfChatInput, setLfChatInput] = useState("");
  const [lfSearchQuery, setLfSearchQuery] = useState("");
  const [lfCategoryFilter, setLfCategoryFilter] = useState<string>("ALL");

  // Modals
  const [showReportLostModal, setShowReportLostModal] = useState(false);
  const [showReportFoundModal, setShowReportFoundModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState<LostFoundItem | null>(null);
  const [claimAnswerInput, setClaimAnswerInput] = useState("");

  // Report Lost Form State (LF-01, LF-03)
  const [lostTitleInput, setLostTitleInput] = useState("");
  const [lostCategoryInput, setLostCategoryInput] = useState<LostFoundItem["category"]>("Electronics");
  const [lostLocationInput, setLostLocationInput] = useState("");
  const [lostDateInput, setLostDateInput] = useState("10 Oct 2026");
  const [lostDescInput, setLostDescInput] = useState("");

  // Report Found Form State (LF-02, LF-03)
  const [foundTitleInput, setFoundTitleInput] = useState("");
  const [foundCategoryInput, setFoundCategoryInput] = useState<LostFoundItem["category"]>("Electronics");
  const [foundLocationInput, setFoundLocationInput] = useState("");
  const [foundHandoverInput, setFoundHandoverInput] = useState("Central Gate Security Desk");
  const [foundDescInput, setFoundDescInput] = useState("");
  const [foundQuestionInput, setFoundQuestionInput] = useState("");

  // Helper filters for Lost and Found
  const filteredLostItems = lostFoundItems.filter((i) => {
    if (i.type !== "LOST") return false;
    const matchesSearch =
      i.title.toLowerCase().includes(lfSearchQuery.toLowerCase()) ||
      i.location.toLowerCase().includes(lfSearchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(lfSearchQuery.toLowerCase());
    const matchesCat = lfCategoryFilter === "ALL" || i.category === lfCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredFoundItems = lostFoundItems.filter((i) => {
    if (i.type !== "FOUND") return false;
    const matchesSearch =
      i.title.toLowerCase().includes(lfSearchQuery.toLowerCase()) ||
      i.location.toLowerCase().includes(lfSearchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(lfSearchQuery.toLowerCase());
    const matchesCat = lfCategoryFilter === "ALL" || i.category === lfCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Handlers for Lost & Found
  const handleReportLostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostTitleInput.trim() || !lostLocationInput.trim()) {
      alert("Please fill item title and location!");
      return;
    }

    const emojiMap: Record<string, string> = {
      Electronics: "💻",
      "Keys & ID Cards": "🔑",
      "Books & Study": "📚",
      "Personal Accessories": "🎒",
      Clothing: "🧥",
      Other: "📦",
    };

    const newItem: LostFoundItem = {
      id: `LF-LOST-${Date.now().toString().slice(-4)}`,
      type: "LOST",
      title: lostTitleInput,
      category: lostCategoryInput,
      location: lostLocationInput,
      date: lostDateInput,
      description: lostDescInput || "Reported lost on campus.",
      reporterName: userProfile.name,
      reporterContactMasked: `${userProfile.name.slice(0, 4)}••••@amrita.edu`,
      status: "Active",
      emoji: emojiMap[lostCategoryInput] || "🔍",
    };

    setLostFoundItems((prev) => [newItem, ...prev]);
    setShowReportLostModal(false);
    setLostTitleInput("");
    setLostLocationInput("");
    setLostDescInput("");
    alert(`🔍 Lost report for "${newItem.title}" published!`);
  };

  const handleReportFoundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundTitleInput.trim() || !foundLocationInput.trim()) {
      alert("Please fill item title and found location!");
      return;
    }

    const emojiMap: Record<string, string> = {
      Electronics: "⌚",
      "Keys & ID Cards": "🪪",
      "Books & Study": "🔢",
      "Personal Accessories": "👓",
      Clothing: "🧢",
      Other: "📦",
    };

    const newItem: LostFoundItem = {
      id: `LF-FOUND-${Date.now().toString().slice(-4)}`,
      type: "FOUND",
      title: foundTitleInput,
      category: foundCategoryInput,
      location: foundLocationInput,
      date: "Today, 10 Oct 2026",
      description: foundDescInput || "Found item deposited safely.",
      reporterName: userProfile.name,
      reporterContactMasked: `${userProfile.name.slice(0, 4)}••••@amrita.edu`,
      handoverLocation: foundHandoverInput,
      verificationQuestion: foundQuestionInput || "Describe any distinct marks or color details.",
      status: "Active",
      emoji: emojiMap[foundCategoryInput] || "📦",
    };

    setLostFoundItems((prev) => [newItem, ...prev]);
    setShowReportFoundModal(false);
    setFoundTitleInput("");
    setFoundLocationInput("");
    setFoundDescInput("");
    alert(`📦 Found report for "${newItem.title}" published!`);
  };

  // Start Private 1-on-1 Chat with Reporter/Finder (LF-05, LF-06)
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

    setActiveLostFoundSubSection("Private Item Chat");
  };

  const handleSendLfChatMessage = () => {
    if (!lfChatInput.trim()) return;

    const currentThread = lfChats.find((c) => c.id === activeLfChatId);
    if (!currentThread) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: lfChatInput,
      timestamp: "Just now",
    };

    setLfChats((prev) =>
      prev.map((c) =>
        c.id === activeLfChatId ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    );

    const userText = lfChatInput;
    setLfChatInput("");

    // Simulated Instant Reply
    setTimeout(() => {
      const replyText =
        userText.toLowerCase().includes("verify") || userText.toLowerCase().includes("answer")
          ? `Thanks for sharing the verification details! That matches the item. You can collect it from the designated counter.`
          : `Thanks for messaging! Please let me know your available time to meet or check at the security desk.`;

      const autoReply: ChatMessage = {
        id: `m-${Date.now() + 100}`,
        sender: "them",
        text: replyText,
        timestamp: "Just now",
      };

      setLfChats((prev) =>
        prev.map((c) =>
          c.id === activeLfChatId ? { ...c, messages: [...c.messages, autoReply] } : c
        )
      );
    }, 1200);
  };

  // Mark Item as Returned / Resolved (LF-07)
  const handleMarkItemResolved = (itemId: string) => {
    setLostFoundItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: "Resolved" } : item))
    );

    setLfChats((prev) =>
      prev.map((thread) =>
        thread.itemId === itemId
          ? {
              ...thread,
              messages: [
                ...thread.messages,
                {
                  id: `sys-${Date.now()}`,
                  sender: "system",
                  text: `✅ This item has been verified and marked as RETURNED / RESOLVED. Report closed.`,
                  timestamp: "Just now",
                },
              ],
            }
          : thread
      )
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
            {/* MODULE 1: Amazon Parcel Management */}
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
                    { id: "My Parcels", label: "My Parcels", icon: "▣" },
                    { id: "Find Deliveries", label: "Find Deliveries", icon: "⇄" },
                    { id: "My Deliveries", label: "My Deliveries", icon: "🚚" },
                    { id: "E-Wallet", label: "E-Wallet", icon: "💳" },
                    { id: "Messages", label: "Messages", icon: "💬" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveMainModule("Amazon Parcel Management");
                        setActiveAmazonSubSection(sub.id as any);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                        activeMainModule === "Amazon Parcel Management" &&
                        activeAmazonSubSection === sub.id
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-indigo-700"
                      }`}
                    >
                      <span className="text-sm">{sub.icon}</span>
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>

            {/* MODULE 2: Hostel Services */}
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
                    { id: "Student Snacks", label: "P2P Student Snacks", icon: "🍿" },
                    { id: "Night Canteen", label: "Night Canteen (AI Menu)", icon: "🌙" },
                    { id: "Mess Food Menu", label: "Mess Food Menu", icon: "🍱" },
                    { id: "Hostel General Chat", label: "Hostel General Chat", icon: "💬" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveMainModule("Hostel Services");
                        setActiveHostelSubSection(sub.id as HostelSubSection);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                        activeMainModule === "Hostel Services" &&
                        activeHostelSubSection === sub.id
                          ? "bg-teal-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-teal-700"
                      }`}
                    >
                      <span className="text-sm">{sub.icon}</span>
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>

            {/* MODULE 3: 6.5 LOST AND FOUND PORTAL (ACTIVE MODULE) */}
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
                    {
                      id: "Lost Products",
                      label: "Lost Products Section",
                      icon: "🔍",
                      badge: lostFoundItems.filter((i) => i.type === "LOST" && i.status !== "Resolved").length,
                    },
                    {
                      id: "Found Products",
                      label: "Found Products Section",
                      icon: "📦",
                      badge: lostFoundItems.filter((i) => i.type === "FOUND" && i.status !== "Resolved").length,
                    },
                    {
                      id: "Private Item Chat",
                      label: "Private Item Chat",
                      icon: "💬",
                      badge: lfChats.length,
                    },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveMainModule("Lost and Found");
                        setActiveLostFoundSubSection(sub.id as LostFoundSubSection);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                        activeMainModule === "Lost and Found" &&
                        activeLostFoundSubSection === sub.id
                          ? "bg-rose-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-rose-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{sub.icon}</span>
                        <span>{sub.label}</span>
                      </div>

                      {sub.badge !== undefined && sub.badge > 0 && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            activeLostFoundSubSection === sub.id
                              ? "bg-white text-rose-700"
                              : "bg-rose-100 text-rose-700"
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
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="min-w-0 flex-1 flex flex-col">
          {/* Top Header */}
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span>Student Portal</span>
                <span>/</span>
                <span className="text-indigo-600 font-semibold">{activeMainModule}</span>
                <span>/</span>
                <span className="text-slate-800 font-bold">
                  {activeMainModule === "Lost and Found" && activeLostFoundSubSection}
                  {activeMainModule === "Hostel Services" && activeHostelSubSection}
                  {activeMainModule === "Amazon Parcel Management" && activeAmazonSubSection}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {activeMainModule === "Lost and Found" && activeLostFoundSubSection}
                {activeMainModule === "Hostel Services" && activeHostelSubSection}
                {activeMainModule === "Amazon Parcel Management" && activeAmazonSubSection}
              </h2>
            </div>

            <div className="flex items-center gap-4">
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
            {/* MODULE 3: 6.5 LOST AND FOUND SUBSECTIONS                        */}
            {/* =============================================================== */}
            {activeMainModule === "Lost and Found" && (
              <div className="space-y-6">
                {/* SUBSECTION 1: LOST PRODUCTS SECTION */}
                {activeLostFoundSubSection === "Lost Products" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                          LF-01 · MISSING CAMPUS BELONGINGS
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                          🔍 Lost Products Section
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Browse items lost by fellow students or report an item you recently misplaced on campus.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowReportLostModal(true)}
                        className="rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold text-white hover:bg-rose-700 shadow-md shadow-rose-200 transition"
                      >
                        + Report Lost Product
                      </button>
                    </div>

                    {/* Search & Filter Bar (LF-04) */}
                    <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <input
                        type="text"
                        placeholder="Search lost items by name, library, classroom, or hostel..."
                        value={lfSearchQuery}
                        onChange={(e) => setLfSearchQuery(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs focus:border-rose-600 focus:outline-none"
                      />

                      <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {["ALL", "Electronics", "Keys & ID Cards", "Books & Study", "Personal Accessories"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setLfCategoryFilter(cat)}
                            className={`rounded-xl px-3 py-2 text-[11px] font-bold whitespace-nowrap transition ${
                              lfCategoryFilter === cat
                                ? "bg-rose-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Lost Items Grid */}
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {filteredLostItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-rose-300 transition"
                        >
                          <div>
                            <div className="flex items-start justify-between">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl border border-rose-100">
                                {item.emoji}
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                                  item.status === "Resolved"
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-rose-100 text-rose-700"
                                }`}
                              >
                                {item.status === "Resolved" ? "✓ Returned" : "Lost Reported"}
                              </span>
                            </div>

                            <div className="mt-3">
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                {item.category}
                              </span>
                              <h4 className="text-base font-bold text-slate-900 mt-1">{item.title}</h4>
                              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                            </div>

                            <div className="mt-4 space-y-1 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <p className="text-slate-600">
                                <span className="font-bold text-slate-800">Lost At:</span> 📍 {item.location}
                              </p>
                              <p className="text-slate-600">
                                <span className="font-bold text-slate-800">Date Lost:</span> 🗓️ {item.date}
                              </p>
                              <p className="text-slate-500 text-[11px]">
                                Reported by: <span className="font-bold text-slate-700">{item.reporterName}</span> ({item.reporterContactMasked})
                              </p>
                            </div>
                          </div>

                          <div className="pt-2">
                            {item.status !== "Resolved" ? (
                              <button
                                onClick={() => handleInitiateItemChat(item)}
                                className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <span>💬</span>
                                I Found This! Contact Owner
                              </button>
                            ) : (
                              <span className="block text-center text-xs font-bold text-emerald-700 bg-emerald-50 py-2 rounded-xl">
                                ✓ Resolved & Returned
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBSECTION 2: FOUND PRODUCTS SECTION */}
                {activeLostFoundSubSection === "Found Products" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                          LF-02 · RECOVERED CAMPUS BELONGINGS
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                          📦 Found Products Section
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Found something on campus? Post it here so the rightful owner can verify and claim it.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowReportFoundModal(true)}
                        className="rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 transition"
                      >
                        + Report Found Product
                      </button>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <input
                        type="text"
                        placeholder="Search found items by keyword, brand, or deposit point..."
                        value={lfSearchQuery}
                        onChange={(e) => setLfSearchQuery(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                      />

                      <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {["ALL", "Electronics", "Keys & ID Cards", "Books & Study", "Personal Accessories"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setLfCategoryFilter(cat)}
                            className={`rounded-xl px-3 py-2 text-[11px] font-bold whitespace-nowrap transition ${
                              lfCategoryFilter === cat
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Found Items Grid */}
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {filteredFoundItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-300 transition"
                        >
                          <div>
                            <div className="flex items-start justify-between">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl border border-emerald-100">
                                {item.emoji}
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                                  item.status === "Resolved"
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {item.status === "Resolved" ? "✓ Returned" : "Found on Campus"}
                              </span>
                            </div>

                            <div className="mt-3">
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                {item.category}
                              </span>
                              <h4 className="text-base font-bold text-slate-900 mt-1">{item.title}</h4>
                              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                            </div>

                            <div className="mt-4 space-y-1 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <p className="text-slate-600">
                                <span className="font-bold text-slate-800">Found At:</span> 📍 {item.location}
                              </p>
                              {item.handoverLocation && (
                                <p className="text-emerald-800 font-semibold">
                                  <span>Safe Deposit:</span> 🏛️ {item.handoverLocation}
                                </p>
                              )}
                              <p className="text-slate-500 text-[11px]">
                                Finder: <span className="font-bold text-slate-700">{item.reporterName}</span> ({item.reporterContactMasked})
                              </p>
                            </div>

                            {item.verificationQuestion && (
                              <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900">
                                <span className="font-bold">🔐 Security Question:</span> {item.verificationQuestion}
                              </div>
                            )}
                          </div>

                          <div className="pt-2">
                            {item.status !== "Resolved" ? (
                              <button
                                onClick={() => {
                                  setShowClaimModal(item);
                                  setClaimAnswerInput("");
                                }}
                                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <span>🙋</span>
                                This is Mine! Claim &amp; Contact Finder
                              </button>
                            ) : (
                              <span className="block text-center text-xs font-bold text-emerald-700 bg-emerald-50 py-2 rounded-xl">
                                ✓ Claimed &amp; Returned
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBSECTION 3: PRIVATE ITEM CHAT (LF-05, LF-06, LF-07) */}
                {activeLostFoundSubSection === "Private Item Chat" && (
                  <div className="h-[650px] rounded-2xl border border-slate-200 bg-white shadow-sm flex overflow-hidden">
                    {/* Chat Threads Sidebar */}
                    <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                      <div className="p-4 border-b border-slate-200 bg-white">
                        <h3 className="text-sm font-bold text-slate-900">Protected Item Chats</h3>
                        <p className="text-[11px] text-slate-400">Direct 1-on-1 chats for claimed/lost items</p>
                      </div>

                      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {lfChats.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-xs">
                            No active item chats yet. Click "Contact Finder" or "Contact Owner" on any product card!
                          </div>
                        ) : (
                          lfChats.map((thread) => (
                            <button
                              key={thread.id}
                              onClick={() => setActiveLfChatId(thread.id)}
                              className={`w-full p-4 text-left flex items-start justify-between transition ${
                                activeLfChatId === thread.id
                                  ? "bg-white border-l-4 border-rose-600 shadow-sm"
                                  : "hover:bg-slate-100/70"
                              }`}
                            >
                              <div>
                                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                                  {thread.itemType} · #{thread.itemId.slice(-4)}
                                </span>
                                <p className="text-xs font-bold text-slate-900 leading-tight mt-1">
                                  {thread.itemTitle}
                                </p>
                                <p className="text-[11px] text-slate-500">{thread.contactName}</p>
                                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                                  {thread.messages[thread.messages.length - 1]?.text}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Active Chat Window */}
                    <div className="flex-1 flex flex-col bg-white">
                      {(() => {
                        const activeThread = lfChats.find((c) => c.id === activeLfChatId);
                        if (!activeThread) {
                          return (
                            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                              Select a conversation from the sidebar to chat with the finder/owner.
                            </div>
                          );
                        }

                        const targetItem = lostFoundItems.find((i) => i.id === activeThread.itemId);

                        return (
                          <>
                            {/* Chat Header with Item Preview & Resolve Action */}
                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                                    Re: {activeThread.itemTitle}
                                  </span>
                                  <span className="text-xs text-slate-500">with {activeThread.contactName}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  🔒 End-to-end masked contact (No phone numbers shared)
                                </p>
                              </div>

                              {targetItem?.status !== "Resolved" ? (
                                <button
                                  onClick={() => handleMarkItemResolved(activeThread.itemId)}
                                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
                                >
                                  <span>✓</span>
                                  Mark as Returned &amp; Resolve
                                </button>
                              ) : (
                                <span className="rounded-xl bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                                  ✓ Item Resolved &amp; Returned
                                </span>
                              )}
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
                              {activeThread.messages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex flex-col ${
                                    msg.sender === "me"
                                      ? "items-end"
                                      : msg.sender === "them"
                                      ? "items-start"
                                      : "items-center"
                                  }`}
                                >
                                  {msg.sender === "system" ? (
                                    <div className="my-2 rounded-full bg-slate-200 px-4 py-1 text-[11px] font-semibold text-slate-600">
                                      {msg.text}
                                    </div>
                                  ) : (
                                    <div
                                      className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                                        msg.sender === "me"
                                          ? "bg-rose-600 text-white rounded-br-none"
                                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                                      }`}
                                    >
                                      <p>{msg.text}</p>
                                      <span
                                        className={`mt-1 block text-[9px] text-right font-medium ${
                                          msg.sender === "me" ? "text-rose-200" : "text-slate-400"
                                        }`}
                                      >
                                        {msg.timestamp}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Chat Input */}
                            <div className="border-t border-slate-200 p-4 bg-white flex items-center gap-3">
                              <input
                                type="text"
                                placeholder={`Message ${activeThread.contactName} to verify & coordinate handover...`}
                                value={lfChatInput}
                                onChange={(e) => setLfChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendLfChatMessage()}
                                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs focus:border-rose-600 focus:outline-none"
                              />

                              <button
                                onClick={handleSendLfChatMessage}
                                className="rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold text-white hover:bg-rose-700 shadow-md"
                              >
                                Send
                              </button>
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
            {/* MODULE 1: AMAZON PARCEL MANAGEMENT (WHEN SELECTED)              */}
            {/* =============================================================== */}
            {activeMainModule === "Amazon Parcel Management" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Amazon Parcel Management Module</h3>
                <p className="text-xs text-slate-500">
                  Select sub-sections from the sidebar to track incoming packages, browse peer delivery jobs, and manage your E-Wallet.
                </p>
                <button
                  onClick={() => setActiveAmazonSubSection("Dashboard")}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Open Parcel Dashboard
                </button>
              </div>
            )}

            {/* =============================================================== */}
            {/* MODULE 2: HOSTEL SERVICES (WHEN SELECTED)                      */}
            {/* =============================================================== */}
            {activeMainModule === "Hostel Services" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Hostel Services Module</h3>
                <p className="text-xs text-slate-500">
                  Select Student Snacks, Night Canteen AI Menu, or Mess Food Menu from the sidebar navigation.
                </p>
                <button
                  onClick={() => setActiveHostelSubSection("Student Snacks")}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Open Hostel Snacks & Canteen
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =============================================================== */}
      {/* MODAL: REPORT LOST PRODUCT (LF-01, LF-03)                       */}
      {/* =============================================================== */}
      {showReportLostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">🔍 Report a Lost Product</h3>
                <p className="text-xs text-slate-400">Post details of your lost campus belonging</p>
              </div>
              <button onClick={() => setShowReportLostModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleReportLostSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Item Name / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AirPods Pro Case (White)"
                  value={lostTitleInput}
                  onChange={(e) => setLostTitleInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={lostCategoryInput}
                    onChange={(e) => setLostCategoryInput(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-rose-600"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Keys & ID Cards">Keys &amp; ID Cards</option>
                    <option value="Books & Study">Books &amp; Study</option>
                    <option value="Personal Accessories">Personal Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Approx. Date Lost</label>
                  <input
                    type="text"
                    value={lostDateInput}
                    onChange={(e) => setLostDateInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Last Seen Location on Campus</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Library 2nd Floor Reading Room"
                  value={lostLocationInput}
                  onChange={(e) => setLostLocationInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Identifying Description / Distinct Marks</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Has a small scratch near hinge, blue sticker, serial number..."
                  value={lostDescInput}
                  onChange={(e) => setLostDescInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-500">
                🔒 <span className="font-bold">Privacy Note:</span> Your phone number and email will remain masked. Other students will contact you via the secure in-app chat.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportLostModal(false)}
                  className="w-1/2 rounded-xl border py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-md"
                >
                  Publish Lost Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* MODAL: REPORT FOUND PRODUCT (LF-02, LF-03)                      */}
      {/* =============================================================== */}
      {showReportFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">📦 Report a Found Product</h3>
                <p className="text-xs text-slate-400">Post details of an item you picked up on campus</p>
              </div>
              <button onClick={() => setShowReportFoundModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleReportFoundSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Found Item Name / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple Watch Series 8 (Midnight)"
                  value={foundTitleInput}
                  onChange={(e) => setFoundTitleInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={foundCategoryInput}
                    onChange={(e) => setFoundCategoryInput(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Keys & ID Cards">Keys &amp; ID Cards</option>
                    <option value="Books & Study">Books &amp; Study</option>
                    <option value="Personal Accessories">Personal Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Location Found</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Central Canteen Benches"
                    value={foundLocationInput}
                    onChange={(e) => setFoundLocationInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Current Safe Handover Location</label>
                <input
                  type="text"
                  placeholder="e.g. Deposited with Central Gate Security Desk #04"
                  value={foundHandoverInput}
                  onChange={(e) => setFoundHandoverInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Secret Ownership Question</label>
                <input
                  type="text"
                  placeholder="e.g. What wallpaper or initials are on the item?"
                  value={foundQuestionInput}
                  onChange={(e) => setFoundQuestionInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Claimants will answer this question to verify ownership.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportFoundModal(false)}
                  className="w-1/2 rounded-xl border py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md"
                >
                  Publish Found Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* MODAL: CLAIM OWNERSHIP & VERIFICATION (LF-06)                   */}
      {/* =============================================================== */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Claim Item Ownership</h3>
                <p className="text-xs text-slate-400">Re: {showClaimModal.title}</p>
              </div>
              <button onClick={() => setShowClaimModal(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-slate-500">
                  <span className="font-bold text-slate-800">Found Location:</span> {showClaimModal.location}
                </p>
                <p className="text-slate-500 mt-1">
                  <span className="font-bold text-slate-800">Safe Deposit:</span> {showClaimModal.handoverLocation || "With Finder"}
                </p>
              </div>

              {showClaimModal.verificationQuestion && (
                <div className="space-y-1">
                  <label className="font-bold text-amber-900">
                    Security Question by {showClaimModal.reporterName}:
                  </label>
                  <p className="text-slate-600 italic bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    "{showClaimModal.verificationQuestion}"
                  </p>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700">Your Answer / Proof of Ownership</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide answer to question or unique details proving this belongs to you..."
                  value={claimAnswerInput}
                  onChange={(e) => setClaimAnswerInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-[11px] text-emerald-800">
                💬 This answer will start a private 1-on-1 chat with {showClaimModal.reporterName} so you can verify ownership and collect your item!
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(null)}
                  className="w-1/2 rounded-xl border py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item = showClaimModal;
                    setShowClaimModal(null);
                    handleInitiateItemChat(
                      item,
                      `Hello ${item.reporterName}! I am claiming ownership for "${item.title}".\n\nMy verification proof: ${claimAnswerInput || "I have matching photos and details."}`
                    );
                  }}
                  className="w-1/2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md"
                >
                  Start Private Chat →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Student Profile Details</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={editNameInput}
                  onChange={(e) => setEditNameInput(e.target.value)}
                  className="mt-1 w-full border p-3 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Hostel</label>
                <input
                  type="text"
                  value={editHostelInput}
                  onChange={(e) => setEditHostelInput(e.target.value)}
                  className="mt-1 w-full border p-3 rounded-xl"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowProfileModal(false)} className="w-1/2 border py-2 rounded-xl">Cancel</button>
              <button
                onClick={() => {
                  setUserProfile({ ...userProfile, name: editNameInput, hostel: editHostelInput });
                  setShowProfileModal(false);
                }}
                className="w-1/2 bg-indigo-600 text-white py-2 rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}