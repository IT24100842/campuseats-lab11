import { useEffect, useState } from "react";

// ── Slide 21: useDebounce ────────────────────────────────────────
// Returns `value` only after it has stopped changing for `delay` ms.
// Demo: type in the menu search box and watch the Network tab –
// only ONE request fires after you stop typing, not one per keystroke.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cleanup cancels the old timer
  }, [value, delay]);

  return debounced;
}
