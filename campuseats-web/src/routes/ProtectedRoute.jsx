import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// ── Slide 38: ROUTE GUARD ────────────────────────────────────────
// If nobody is logged in, redirect to /login and remember where the
// user was going (state.from) so login can send them back.
// IMPORTANT teaching point: this is UX only – the REAL security is
// the backend rejecting requests without a valid JWT (Lecture 04).
export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
