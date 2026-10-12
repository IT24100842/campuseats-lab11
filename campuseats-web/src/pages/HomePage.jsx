import { Link } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

export default function HomePage() {
  useDocumentTitle("Home");

  return (
    <>
      <h1>CampusEats – Lecture 02 Demo App</h1>
      <p className="muted">
        SE3090 · Advanced React Frontend Development. Each page of this app
        demonstrates one part of the lecture. Open the file mentioned on each
        card while teaching.
      </p>
      <div className="grid">
        <Card>
          <h3><Link to="/menu">Menu Browser</Link></h3>
          <p className="muted">
            TanStack Query, useDebounce search, filtering, pagination,
            optimistic favourites, React.memo. <br />
            <code>src/features/menu/</code>
          </p>
        </Card>
        <Card>
          <h3><Link to="/register">Registration Form</Link></h3>
          <p className="muted">
            React Hook Form + Zod schema validation + dynamic field array.
            <br /><code>src/features/register/</code>
          </p>
        </Card>
        <Card>
          <h3><Link to="/orders">My Orders (protected)</Link></h3>
          <p className="muted">
            Protected route, mutations, optimistic cancel with rollback.
            <br /><code>src/features/orders/</code>
          </p>
        </Card>
        <Card>
          <h3><Link to="/admin">Admin (role-based)</Link></h3>
          <p className="muted">
            Role guard – login as <b>admin</b> to enter. Lazy-loaded chunk.
            <br /><code>src/pages/AdminPage.jsx</code>
          </p>
        </Card>
        <Card>
          <h3><Link to="/perf">Performance Demo</Link></h3>
          <p className="muted">
            Re-render counters, React.memo, useMemo, useCallback – live.
            <br /><code>src/features/performance/</code>
          </p>
        </Card>
        <Card>
          <h3><Link to="/this-page-does-not-exist">Broken Link</Link></h3>
          <p className="muted">
            Click to demonstrate the catch-all 404 error route.
            <br /><code>src/pages/NotFoundPage.jsx</code>
          </p>
        </Card>
      </div>
    </>
  );
}
