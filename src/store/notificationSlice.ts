import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id:          string;
  sender_name: string | null;
  summary:     string;
  created_at:  string;
}

interface NotificationState {
  items:  Notification[];
  unread: number;
}

const initialState: NotificationState = { items: [], unread: 0 };

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items  = action.payload;
      state.unread = action.payload.length;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
      state.unread += 1;
    },
    clearUnread(state) {
      state.unread = 0;
    },
  },
});

export const { setNotifications, addNotification, clearUnread } = notificationSlice.actions;
export default notificationSlice.reducer;