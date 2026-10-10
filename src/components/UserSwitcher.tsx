"use client";

import { useCarpool } from "@/context/CarpoolContext";
import { useState } from "react";

export default function UserSwitcher() {
  const { currentUser, availableUsers, switchUser, notifications, unreadNotificationsCount, markNotificationsRead } = useCarpool();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* Notifications Icon */}
      <div className="relative">
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            if (!showNotifications && unreadNotificationsCount > 0) {
              markNotificationsRead();
            }
          }}
          className="relative p-2 text-gray-200 hover:text-white transition-colors"
          title="Notifications"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 text-gray-800">
            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <button onClick={() => setShowNotifications(false)} className="text-xs text-gray-500 hover:underline">Close</button>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <p className="text-xs text-gray-500 p-4 text-center">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-xs ${n.read_status === 0 ? "bg-blue-50 font-medium" : "text-gray-600"}`}>
                    <p>{n.message}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Selection */}
      <div className="flex items-center gap-2 bg-blue-700/80 px-3 py-1.5 rounded-lg text-xs">
        <span className="text-blue-200 hidden md:inline">Logged as:</span>
        <select
          value={currentUser?.id || "user_rahul"}
          onChange={(e) => switchUser(e.target.value)}
          className="bg-transparent text-white font-semibold outline-none cursor-pointer"
        >
          {availableUsers.map((u) => (
            <option key={u.id} value={u.id} className="text-gray-900">
              {u.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
