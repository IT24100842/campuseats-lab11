import { memo, useCallback, useMemo, useRef, useState } from "react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

// ── Slides 42–43, live and measurable ────────────────────────────
// A parent with a counter, plus two children: one plain, one memo'd.
// Click "Re-render parent" and watch the render counts diverge.

function useRenderCount() {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}

// Deliberately slow function to make useMemo's effect visible.
function slowlyComputeTotal(prices) {
  const start = performance.now();
  while (performance.now() - start < 150) {
    /* burn 150 ms to simulate an expensive calculation */
  }
  return prices.reduce((a, b) => a + b, 0);
}

function PlainChild({ onOrder }) {
  const renders = useRenderCount();
  return (
    <Card>
      <h3>Plain child</h3>
      <p className="muted">No React.memo — re-renders with the parent every time.</p>
      <p className="price">Renders: {renders}</p>
      <Button variant="secondary" onClick={onOrder}>Order</Button>
    </Card>
  );
}

const MemoChild = memo(function MemoChild({ onOrder }) {
  const renders = useRenderCount();
  return (
    <Card>
      <h3>memo() child</h3>
      <p className="muted">
        Wrapped in React.memo AND receives a useCallback handler — skips
        re-renders when props are unchanged.
      </p>
      <p className="price">Renders: {renders}</p>
      <Button variant="secondary" onClick={onOrder}>Order</Button>
    </Card>
  );
});

export default function PerfDemoPage() {
  useDocumentTitle("Performance");
  const [tick, setTick] = useState(0);
  const [useMemoOn, setUseMemoOn] = useState(true);

  const prices = [650, 400, 120, 300, 800]; // stable demo data

  // Toggle the checkbox to feel the difference: with useMemo the
  // expensive total is computed ONCE and cached; without it, every
  // parent re-render burns 150 ms and the button feels laggy.
  // (Hooks must be called unconditionally — so we always call
  // useMemo, and simply ignore its cached value when the toggle is off.)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoisedTotal = useMemo(() => slowlyComputeTotal(prices), []);
  const total = useMemoOn ? memoisedTotal : slowlyComputeTotal(prices);

  // Stable function identity → MemoChild's props never change.
  const handleOrder = useCallback(() => {
    console.log("order placed");
  }, []);

  return (
    <>
      <h2>Performance Playground</h2>
      <p className="muted">
        Parent has re-rendered <b>{tick}</b> times. Total of 5 dish prices
        (expensive calc): <b>Rs. {total}</b>
      </p>
      <div className="toolbar">
        <Button onClick={() => setTick((t) => t + 1)}>
          Re-render parent
        </Button>
        <label className="muted" style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={useMemoOn}
            onChange={(e) => setUseMemoOn(e.target.checked)}
          />
          useMemo the expensive calculation (untick, then click the button —
          feel the 150&nbsp;ms lag)
        </label>
      </div>
      <div className="grid">
        <PlainChild onOrder={handleOrder} />
        <MemoChild onOrder={handleOrder} />
      </div>
      <p className="muted" style={{ marginTop: 18 }}>
        Also open React DevTools → Profiler, record a click, and show which
        components rendered and why (Slide 42).
      </p>
    </>
  );
}
