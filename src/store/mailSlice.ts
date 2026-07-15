import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PriorityMail {
  id:           string;
  sender_name:  string | null;
  sender_email: string;
  summary:      string;
  url_link:     string;
  category:     string | null;
  message_id:   string | null;   // ← add this
  created_at:   string;
}

interface MailState {
  items:       PriorityMail[];
  nextCursor:  string | null;
  hasMore:     boolean;
  loading:     boolean;
  loadingMore: boolean;
  error:       string | null;
}

const initialState: MailState = {
  items:       [],
  nextCursor:  null,
  hasMore:     true,
  loading:     false,
  loadingMore: false,
  error:       null,
};

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setLoadingMore(state) {
      state.loadingMore = true;
      state.error = null;
    },
    setMailPage(
      state,
      action: PayloadAction<{ items: PriorityMail[]; nextCursor: string | null; hasMore: boolean }>
    ) {
      state.items      = action.payload.items;
      state.nextCursor = action.payload.nextCursor;
      state.hasMore     = action.payload.hasMore;
      state.loading     = false;
    },
    appendMailPage(
      state,
      action: PayloadAction<{ items: PriorityMail[]; nextCursor: string | null; hasMore: boolean }>
    ) {
      state.items       = [...state.items, ...action.payload.items];
      state.nextCursor   = action.payload.nextCursor;
      state.hasMore      = action.payload.hasMore;
      state.loadingMore  = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error       = action.payload;
      state.loading     = false;
      state.loadingMore = false;
    },
  },
});

export const { setLoading, setLoadingMore, setMailPage, appendMailPage, setError } = mailSlice.actions;
export default mailSlice.reducer;