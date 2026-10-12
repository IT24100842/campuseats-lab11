import { useState } from "react";

// ── Slide 21: useLocalStorage ────────────────────────────────────
// Same API as useState, but the value survives a page refresh.
// Used by AuthContext to keep the logged-in user.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setAndStore = (next) => {
    setValue(next);
    if (next === null || next === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(next));
    }
  };

  return [value, setAndStore];
}
