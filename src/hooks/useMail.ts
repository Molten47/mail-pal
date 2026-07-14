import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setLoading, setMail, setError } from "@/store/mailSlice";
import api from "@/lib/api";

export const useMail = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s: RootState) => s.mail);

  const fetchMail = async () => {
    dispatch(setLoading());
    try {
      const res = await api.get("/priority-mail");
      dispatch(setMail(res.data));
    } catch {
      dispatch(setError("Failed to load priority mail"));
    }
  };

  return { items, loading, error, fetchMail };
};