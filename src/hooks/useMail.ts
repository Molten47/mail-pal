import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setLoading, setLoadingMore, setMailPage, appendMailPage, setError } from "@/store/mailSlice";
import { PriorityMail } from "@/store/mailSlice";
import api from "@/lib/api";

interface CursorPageResponse {
  items:       PriorityMail[];
  next_cursor: string | null;
  has_more:    boolean;
}

export const useMail = () => {
  const dispatch = useDispatch();
  const { items, loading, loadingMore, error, nextCursor, hasMore } =
    useSelector((s: RootState) => s.mail);

  const fetchMail = async () => {
    dispatch(setLoading());
    try {
      const res = await api.get<CursorPageResponse>("/priority-mail", {
        params: { limit: 20 },
      });
      dispatch(setMailPage({
        items:      res.data.items,
        nextCursor: res.data.next_cursor,
        hasMore:    res.data.has_more,
      }));
    } catch {
      dispatch(setError("Failed to load priority mail"));
    }
  };

  const fetchMoreMail = async () => {
    if (!hasMore || loadingMore || !nextCursor) return;
    dispatch(setLoadingMore());
    try {
      const res = await api.get<CursorPageResponse>("/priority-mail", {
        params: { limit: 20, cursor: nextCursor },
      });
      dispatch(appendMailPage({
        items:      res.data.items,
        nextCursor: res.data.next_cursor,
        hasMore:    res.data.has_more,
      }));
    } catch {
      dispatch(setError("Failed to load more mail"));
    }
  };

  return { items, loading, loadingMore, error, hasMore, fetchMail, fetchMoreMail };
};