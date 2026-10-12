import { Link } from "react-router-dom";

// ── Slide 39: friendly error page for unknown URLs ───────────────
export default function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", paddingTop: 60 }}>
      <h1 style={{ fontSize: "3rem", margin: 0 }}>404</h1>
      <p className="muted">
        That page is not on the menu. Maybe it sold out?
      </p>
      <Link to="/">← Back to CampusEats home</Link>
    </div>
  );
}
