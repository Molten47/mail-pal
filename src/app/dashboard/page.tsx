"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { useMail } from "@/hooks/useMail";
import { useAuth } from "@/hooks/useAuth";
import MailCard from "@/components/MailCard";
import NotificationBell from "@/components/NotificationBell";
import KeywordManager from "@/components/KeywordsManager";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardPage() {
  const router                               = useRouter();
  const { isLoggedIn }                       = useSelector((s: RootState) => s.auth);
  const { items, loading, error, fetchMail } = useMail();
  const { logout, initAuth }                 = useAuth();
  const [hydrated, setHydrated]              = useState(false);

  // Step 1 — restore auth from localStorage before anything else
// Step 1 — restore auth state, then mark hydration complete
  useEffect(() => {
    initAuth();
    setHydrated(true);
  }, []);

  // Step 2 — only redirect after hydration is complete
  useEffect(() => {
    if (hydrated && !isLoggedIn) router.replace("/");
  }, [hydrated, isLoggedIn]);

  // Step 3 — fetch mail once logged in
  useEffect(() => {
    if (isLoggedIn) fetchMail();
  }, [isLoggedIn]);

  if (!hydrated) return null; // prevent flash

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
       <h1 className="text-xl font-bold text-gray-900 dark:text-white">mail-pal</h1>
       <div className="flex items-center gap-3">
          <ThemeToggle />
          <NotificationBell />
          <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-8">
        <KeywordManager />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Priority Inbox {items.length > 0 && <span className="text-gray-400 font-normal">({items.length})</span>}
        </h2>
        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error   && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex flex-col gap-3">
          {items.map((mail) => <MailCard key={mail.id} mail={mail} />)}
          {!loading && items.length === 0 && (
            <p className="text-gray-400 text-sm">No priority emails yet. Check back soon.</p>
          )}
        </div>
      </section>
    </main>
  );
}