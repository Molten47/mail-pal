/**
 * Opens a specific Gmail message.
 * - Desktop: opens the web link directly (works fine as-is).
 * - Mobile: attempts the native Gmail app via its custom URL scheme first
 *   (bypasses the mobile web view, which ignores the #all/ hash).
 *   Falls back to the web link if the app doesn't open within ~1.2s
 *   (e.g. app not installed).
 */
export function openInGmail(messageId: string | null, webUrl: string) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isMobile || !messageId) {
    window.open(webUrl, "_blank", "noopener,noreferrer");
    return;
  }

  // Gmail app's documented deep link format for opening a specific message
  const appUrl = `googlegmail://co?viewmessageid=${messageId}`;

  let didHide = false;
  const onVisibilityChange = () => {
    if (document.hidden) didHide = true;
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  // If the app opens, the browser tab backgrounds — skip the web fallback.
  // If nothing happens (app not installed), fall back after a short delay.
  const fallbackTimer = setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (!didHide) {
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }
  }, 1200);

  window.addEventListener(
    "blur",
    () => {
      clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    },
    { once: true }
  );

  window.location.href = appUrl;
}