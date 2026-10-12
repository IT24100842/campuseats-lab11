import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";

// ── Slide 37: LAYOUT ROUTE ───────────────────────────────────────
// The navbar is rendered ONCE here; every child page appears in
// <Outlet />. Change the navbar → every page updates.
export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <div className="brand">
          Campus<span>Eats</span>
        </div>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/orders">My Orders</NavLink>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/perf">Perf Demo</NavLink>
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        <div className="spacer" />
        {user ? (
          <>
            <span className="who">
              {user.name} ({user.role})
            </span>
            <Button variant="ghost" onClick={() => { logout(); navigate("/"); }}>
              Logout
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
