import { useEffect } from "react";

// ── Slide 22: an "app concern" hook ──────────────────────────────
// Encapsulates a side effect every page needs. One line per page
// instead of a copy-pasted useEffect everywhere.
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} | CampusEats`;
  }, [title]);
}
