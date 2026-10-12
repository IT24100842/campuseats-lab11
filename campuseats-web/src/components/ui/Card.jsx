// ── Slide 16: Composition over configuration ─────────────────────
// BAD  (configuration): <Card title=".." subtitle=".." footerText=".."
//                             showBadge badgeColor=".." ... />
// GOOD (composition):   <Card> ...any children... </Card>
// The card doesn't know or care what goes inside it.
export default function Card({ children, ...rest }) {
  return (
    <div className="card" {...rest}>
      {children}
    </div>
  );
}
