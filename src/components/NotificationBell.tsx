"use client";
import { useNotifications } from "@/hooks/useNotifications";
import { useState } from "react";

export default function NotificationBell() {
  const { items, unread, clearUnread } = useNotifications();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
    if (!open) clearUnread();
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">Notifications</p>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 px-4 py-6 text-center">No notifications yet</p>
          ) : (
            items.map((n) => (
              <div key={n.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <p className="text-sm font-medium text-gray-800">{n.sender_name ?? "Unknown"}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.summary}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}