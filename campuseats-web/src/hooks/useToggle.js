import { useCallback, useState } from "react";

// ── Slide 20: the SIMPLEST possible custom hook ──────────────────
// A custom hook is just a function that starts with "use" and calls
// other hooks. This one wraps a boolean – used for the Modal demo.
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle, setOn];
}
