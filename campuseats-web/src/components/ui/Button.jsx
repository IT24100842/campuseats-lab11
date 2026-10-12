// ── Slides 13 & 16: a reusable UI-library component ──────────────
// Presentational only: no data fetching, no business logic.
// COMPOSITION: variant + children decide what it looks like;
// the parent decides what it does (onClick).
export default function Button({ variant = "primary", children, ...rest }) {
  return (
    <button className={`btn btn-${variant}`} {...rest}>
      {children}
    </button>
  );
}
