"use client";
import { useState } from "react";
import { useKeywords } from "@/hooks/useKeywords";

const CATEGORIES = ["Professional", "Academic", "Logistics", "Personal"];

export default function KeywordManager() {
  const { keywords, loading, addKeyword } = useKeywords();
  const [content,       setContent]       = useState("");
  const [senderPattern, setSenderPattern] = useState("");
  const [category,      setCategory]      = useState("Professional");
  const [open,          setOpen]          = useState(false);
  const [formError,     setFormError]     = useState<string | null>(null);

  const handleAdd = async () => {
    const hasContent = content.trim() !== "";
    const hasSender  = senderPattern.trim() !== "";

    if (!hasContent && !hasSender) {
      setFormError("Add a keyword, a sender, or both.");
      return;
    }
    setFormError(null);

    await addKeyword(category, hasContent ? content : null, hasSender ? senderPattern : null);
    setContent("");
    setSenderPattern("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Keywords</h3>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          {open ? "Hide" : "Manage"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {keywords.map((kw) => (
          <span
            key={kw.id}
            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full flex items-center gap-1"
          >
            {kw.content && <span>{kw.content}</span>}
            {kw.content && kw.sender_pattern && <span className="text-gray-400">·</span>}
            {kw.sender_pattern && <span className="italic">{kw.sender_pattern}</span>}
          </span>
        ))}
        {loading && <span className="text-xs text-gray-400">Loading...</span>}
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Keyword (optional if sender set)..."
              className="flex-1 text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <input
              value={senderPattern}
              onChange={(e) => setSenderPattern(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Sender or domain, e.g. boss@company.com or company.com"
              className="flex-1 text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
            />
            <button
              onClick={handleAdd}
              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shrink-0"
            >
              Add
            </button>
          </div>

          {formError && <p className="text-xs text-red-500 mt-1.5">{formError}</p>}
        </div>
      )}
    </div>
  );
}