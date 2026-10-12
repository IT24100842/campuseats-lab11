import { useQuery } from "@tanstack/react-query";
import { fetchAllOrders } from "../features/orders/api.js";
import Spinner from "../components/ui/Spinner.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

// ── Slides 37–38: lazy-loaded, role-guarded page ─────────────────
// Students never download this JS chunk – only admins navigate here.
export default function AdminPage() {
  useDocumentTitle("Admin");

  const { data: orders, isPending, isError } = useQuery({
    queryKey: ["orders", "all"],
    queryFn: fetchAllOrders,
  });

  if (isPending) return <Spinner label="Loading all orders…" />;
  if (isError) return <div className="alert error">Could not load orders. Check the API URL and that you are logged in.</div>;

  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <h2>Canteen Admin Dashboard</h2>
      <p className="muted">
        Visible only to the <b>admin</b> role. This page is also a lazy route –
        check the Network tab: its JS chunk loaded only when you navigated here.
      </p>
      <div className="grid" style={{ marginBottom: 20 }}>
        <div className="card"><h3>{orders.length}</h3><p className="muted">Total orders</p></div>
        <div className="card"><h3>{orders.filter((o) => o.status === "Pending").length}</h3><p className="muted">Pending</p></div>
        <div className="card"><h3>Rs. {revenue.toLocaleString()}</h3><p className="muted">Revenue (non-cancelled)</p></div>
      </div>
      <table className="orders">
        <thead>
          <tr><th>ID</th><th>Student</th><th>Items</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.studentName}</td>
              <td>{o.items}</td>
              <td>Rs. {o.total}</td>
              <td><span className={`status ${o.status}`}>{o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
