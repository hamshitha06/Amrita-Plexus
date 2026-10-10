"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: number;
};

export type Ride = {
  id: string;
  driver_id: string;
  driver_name: string;
  driver_email?: string;
  driver_verified?: number;
  source: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  available_seats: number;
  price: number;
  ride_type: string;
  status: string; // Available, Full, Cancelled, Completed
  created_at: string;
};

export type Booking = {
  id: string;
  ride_id: string;
  passenger_id: string;
  passenger_name?: string;
  passenger_email?: string;
  seats_requested: number;
  status: string; // Pending, Accepted, Rejected, Cancelled
  created_at: string;
  source?: string;
  destination?: string;
  date?: string;
  time?: string;
  price?: number;
  ride_type?: string;
  driver_name?: string;
  driver_email?: string;
  available_seats?: number;
  total_seats?: number;
};

export type NotificationItem = {
  id: string;
  recipient_id: string;
  ride_id?: string;
  message: string;
  read_status: number;
  created_at: string;
};

interface CarpoolContextType {
  currentUser: User | null;
  availableUsers: User[];
  switchUser: (userId: string) => Promise<void>;
  rides: Ride[];
  passengerBookings: Booking[];
  driverRequests: Booking[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  loading: boolean;
  error: string | null;
  fetchRides: (filters?: { source?: string; destination?: string; date?: string; status?: string }) => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  addRide: (rideData: { source: string; destination: string; date: string; time: string; seats: number; price: number; rideType: string }) => Promise<{ success: boolean; error?: string }>;
  cancelRide: (rideId: string) => Promise<{ success: boolean; error?: string }>;
  bookRide: (rideId: string) => Promise<{ success: boolean; error?: string }>;
  respondToBooking: (bookingId: string, action: "accept" | "reject") => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>;
}

const CarpoolContext = createContext<CarpoolContextType | undefined>(undefined);

export const CarpoolProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [passengerBookings, setPassengerBookings] = useState<Booking[]>([]);
  const [driverRequests, setDriverRequests] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Session User
  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.currentUser);
        setAvailableUsers(data.availableUsers || []);
      }
    } catch (err) {
      console.error("Failed to load user session", err);
    }
  }, []);

  // Fetch Rides
  const fetchRides = useCallback(async (filters?: { source?: string; destination?: string; date?: string; status?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.source) params.append("source", filters.source);
      if (filters?.destination) params.append("destination", filters.destination);
      if (filters?.date) params.append("date", filters.date);
      if (filters?.status) params.append("status", filters.status);

      const res = await fetch(`/api/rides?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRides(data.rides || []);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to fetch rides.");
      }
    } catch (err: any) {
      setError("Network error fetching rides.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Bookings
  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setPassengerBookings(data.passengerBookings || []);
        setDriverRequests(data.driverIncomingRequests || []);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  }, []);

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadNotificationsCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, []);

  const markNotificationsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setUnreadNotificationsCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read_status: 1 })));
    } catch (err) {
      console.error("Failed to mark notifications read", err);
    }
  };

  const switchUser = async (userId: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        await fetchSession();
        await fetchRides();
        await fetchBookings();
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to switch user", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchSession();
      await fetchRides();
      await fetchBookings();
      await fetchNotifications();
    };
    init();
  }, [fetchSession, fetchRides, fetchBookings, fetchNotifications]);

  const addRide = async (rideData: { source: string; destination: string; date: string; time: string; seats: number; price: number; rideType: string }) => {
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rideData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchRides();
        await fetchBookings();
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to create ride." };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const cancelRide = async (rideId: string) => {
    try {
      const res = await fetch(`/api/rides/${rideId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchRides();
        await fetchBookings();
        await fetchNotifications();
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to cancel ride." };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const bookRide = async (rideId: string) => {
    try {
      const res = await fetch(`/api/rides/${rideId}/book`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchRides();
        await fetchBookings();
        await fetchNotifications();
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to request seat." };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const respondToBooking = async (bookingId: string, action: "accept" | "reject") => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchRides();
        await fetchBookings();
        await fetchNotifications();
        return { success: true };
      }
      return { success: false, error: data.error || `Failed to ${action} booking.` };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchRides();
        await fetchBookings();
        await fetchNotifications();
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to cancel booking." };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return (
    <CarpoolContext.Provider
      value={{
        currentUser,
        availableUsers,
        switchUser,
        rides,
        passengerBookings,
        driverRequests,
        notifications,
        unreadNotificationsCount,
        loading,
        error,
        fetchRides,
        fetchBookings,
        fetchNotifications,
        markNotificationsRead,
        addRide,
        cancelRide,
        bookRide,
        respondToBooking,
        cancelBooking,
      }}
    >
      {children}
    </CarpoolContext.Provider>
  );
};

export const useCarpool = () => {
  const context = useContext(CarpoolContext);
  if (context === undefined) {
    throw new Error("useCarpool must be used within a CarpoolProvider");
  }
  return context;
};
