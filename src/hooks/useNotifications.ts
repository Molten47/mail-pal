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
    const base  = process.env.NEXT_PUBLIC_API_URL!;
    const wsUrl = base.replace("https://", "wss://").replace("http://", "ws://");
    // No token needed in the URL — the browser sends the HttpOnly cookie
    // automatically with the WS handshake request.
    const ws = new WebSocket(`${wsUrl}/notifications/ws`);

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