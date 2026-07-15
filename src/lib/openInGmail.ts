/**
 * Opens Gmail search results scoped to a specific email's subject line.
 * Gmail doesn't support deep-linking to a specific message from an
 * external link on mobile web, so this narrows results as close as
 * possible instead of dumping the user on their full inbox.
 */
export function openInGmail(webUrl: string) {
  window.open(webUrl, "_blank", "noopener,noreferrer");
}