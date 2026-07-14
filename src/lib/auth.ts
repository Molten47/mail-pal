// No localStorage — tokens live in HttpOnly cookies set by the backend
// Only user_id is readable (non-HttpOnly cookie for display purposes)

export const getUserId = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)user_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const isAuthenticated = (): boolean => !!getUserId();

export const clearAuth = async (): Promise<void> => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};