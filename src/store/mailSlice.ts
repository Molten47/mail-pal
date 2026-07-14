import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PriorityMail {
  id:           string;
  sender_name:  string | null;
  sender_email: string;
  summary:      string;
  url_link:     string;
  category:     string | null;
  created_at:   string;
}

interface MailState {
  items:   PriorityMail[];
  loading: boolean;
  error:   string | null;
}

const initialState: MailState = { items: [], loading: false, error: null };

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    setLoading(state)                                        { state.loading = true; state.error = null; },
    setMail(state, action: PayloadAction<PriorityMail[]>)   { state.items = action.payload; state.loading = false; },
    setError(state, action: PayloadAction<string>)          { state.error = action.payload; state.loading = false; },
  },
});

export const { setLoading, setMail, setError } = mailSlice.actions;
export default mailSlice.reducer;