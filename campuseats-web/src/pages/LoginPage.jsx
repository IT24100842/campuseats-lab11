import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

// ── Slide 38 demo helper ─────────────────────────────────────────
// A deliberately fake login: pick a role, no password. The point of
// THIS lecture is what the frontend does with the logged-in user
// (guards, conditional UI, tokens on requests). Real authentication
// arrives with the ASP.NET Core backend in Lectures 03–04.
export default function LoginPage() {
  useDocumentTitle("Login");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If a guard redirected us here, go back there after login.
  const from = location.state?.from?.pathname || "/";

  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (role) => {
    setPending(true);
    setError(null);
    try {
      await login(role);
      navigate(from, { replace: true });
    } catch {
      setError("Login failed – is the API running (or waking up from a cold start)?");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="card form-card">
      <h2>Demo Login</h2>
      <p className="muted">
        No password – pick a demo account. The API returns a real JWT that is
        sent with every request. Try: login as <b>student</b>, then visit
        /admin and watch the role guard redirect you.
      </p>
      {error && <div className="alert error">{error}</div>}
      <div style={{ display: "flex", gap: 10 }}>
        <Button disabled={pending} onClick={() => handleLogin("student")}>
          Login as Student
        </Button>
        <Button variant="secondary" disabled={pending} onClick={() => handleLogin("admin")}>
          Login as Canteen Admin
        </Button>
      </div>
    </Card>
  );
}
