"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Ride = {
  id: string;
  driver: string;
  source: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  rideType: string;
  isUserDriver?: boolean;
};

interface CarpoolContextType {
  rides: Ride[];
  myRides: Ride[];
  addRide: (ride: Omit<Ride, "id">) => void;
  bookRide: (rideId: string) => void;
}

const initialRides: Ride[] = [
  {
    id: "1",
    driver: "Rahul",
    source: "Campus",
    destination: "Railway Station",
    date: "2026-10-12",
    time: "10:00",
    seats: 3,
    price: 150,
    rideType: "Own Car",
  },
  {
    id: "2",
    driver: "Sneha",
    source: "Airport",
    destination: "Campus",
    date: "2026-10-13",
    time: "18:30",
    seats: 2,
    price: 300,
    rideType: "Taxi",
  },
];

const CarpoolContext = createContext<CarpoolContextType | undefined>(undefined);

export const CarpoolProvider = ({ children }: { children: ReactNode }) => {
  const [rides, setRides] = useState<Ride[]>(initialRides);
  const [myRides, setMyRides] = useState<Ride[]>([]);

  const addRide = (rideData: Omit<Ride, "id">) => {
    const newRide: Ride = {
      ...rideData,
      id: Math.random().toString(36).substring(7),
      isUserDriver: true,
    };
    setRides([newRide, ...rides]);
    setMyRides([newRide, ...myRides]);
  };

  const bookRide = (rideId: string) => {
    const rideToBook = rides.find((r) => r.id === rideId);
    if (rideToBook && rideToBook.seats > 0) {
      setRides(
        rides.map((r) =>
          r.id === rideId ? { ...r, seats: r.seats - 1 } : r
        )
      );
      if (!myRides.find((r) => r.id === rideId)) {
        setMyRides([{ ...rideToBook, seats: rideToBook.seats - 1 }, ...myRides]);
      }
    }
  };

  return (
    <CarpoolContext.Provider value={{ rides, myRides, addRide, bookRide }}>
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
