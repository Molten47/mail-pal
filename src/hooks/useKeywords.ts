import { useState, useEffect } from "react";
import api from "@/lib/api";

export interface Keyword {
  id:             string;
  category:       string | null;
  content:        string | null;
  sender_pattern: string | null;
}

export const useKeywords = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const fetchKeywords = async () => {
    setLoading(true);
    try {
      const res = await api.get("/keywords");
      setKeywords(res.data);
    } catch {
      setError("Failed to load keywords");
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = async (
    category: string,
    content: string | null,
    senderPattern: string | null
  ) => {
    try {
      await api.post("/keywords", {
        category,
        content:        content && content.trim() !== "" ? content.trim() : null,
        sender_pattern: senderPattern && senderPattern.trim() !== "" ? senderPattern.trim() : null,
      });
      await fetchKeywords();
    } catch {
      setError("Failed to add keyword");
    }
  };

  useEffect(() => { fetchKeywords(); }, []);

  return { keywords, loading, error, addKeyword };
};