import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// ── Slide 38: ROLE-BASED guard ───────────────────────────────────
// Wraps routes only certain roles may see. A logged-in student who
// visits /admin is bounced to the home page.
export default function RoleRoute({ allow }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
