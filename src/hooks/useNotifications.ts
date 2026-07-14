import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setNotifications, addNotification, clearUnread } from "@/store/notificationSlice";
import api from "@/lib/api";
import { useEffect } from "react";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const { items, unread } = useSelector((s: RootState) => s.notifications);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      dispatch(setNotifications(res.data));
    } catch {
      console.error("Failed to fetch notifications");
    }
  };

    const connectWebSocket = () => {
  
    if (typeof window === "undefined") return;
    const base = window.location.origin;
    const wsBase = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsBase) return; // skip if not configured
    const ws = new WebSocket(`${wsBase}/notifications/ws`);
    // ... rest of handler

      ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          dispatch(addNotification(notification));
        } catch { /* ignore malformed frames */ }
      };

      ws.onerror = () => console.error("WebSocket error");

      return () => ws.close();
    };

  useEffect(() => {
    fetchNotifications();
    const cleanup = connectWebSocket();
    return cleanup;
  }, []);

  return { items, unread, clearUnread: () => dispatch(clearUnread()) };
};