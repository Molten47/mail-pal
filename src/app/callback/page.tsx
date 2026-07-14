"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function CallbackPage() {
  const router        = useRouter();
  const { initAuth }  = useAuth();

  useEffect(() => {
    // Cookies are already set by the backend redirect
    // Just restore Redux state and navigate
    initAuth();
    router.replace("/dashboard");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">Signing you in...</p>
    </main>
  );
}