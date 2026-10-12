import { useState } from "react";
import { useMyOrders, useCancelOrder } from "./useOrders.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToggle } from "../../hooks/useToggle.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";

// ── Protected page: mutations + the compound Modal in action ─────
export default function OrdersPage() {
  useDocumentTitle("My Orders");
  const { user } = useAuth();
  const { data: orders, isPending, isError } = useMyOrders();
  const cancel = useCancelOrder();

  const [confirmOpen, toggleConfirm] = useToggle(false);
  const [selected, setSelected] = useState(null);

  const askCancel = (order) => {
    setSelected(order);
    toggleConfirm();
  };

  const doCancel = () => {
    cancel.mutate(selected.id, { onSettled: toggleConfirm });
  };

  if (isPending) return <Spinner label="Loading your orders…" />;
  if (isError) return <div className="alert error">Could not load orders.</div>;

  return (
    <>
      <h2>My Orders – {user.name}</h2>
      <p className="muted">
        Try login as the other demo student in <code>AuthContext.jsx</code> to
        see how the query key <code>["orders", studentId]</code> caches each
        student's list separately.
      </p>
      {orders.length === 0 && (
        <div className="alert info">No orders yet – go order a kottu!</div>
      )}
      <table className="orders">
        <thead>
          <tr><th>ID</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.items}</td>
              <td>Rs. {o.total}</td>
              <td><span className={`status ${o.status}`}>{o.status}</span></td>
              <td>
                {o.status === "Pending" && (
                  <Button variant="danger" onClick={() => askCancel(o)}>
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Slide 17: the compound component in real use */}
      <Modal open={confirmOpen} onClose={toggleConfirm}>
        <Modal.Header>Cancel order #{selected?.id}?</Modal.Header>
        <Modal.Body>
          <p>
            {selected?.items} — Rs. {selected?.total}
          </p>
          <p className="muted">The canteen will stop preparing this order.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleConfirm}>
            Keep order
          </Button>
          <Button
            variant="danger"
            onClick={doCancel}
            disabled={cancel.isPending}
          >
            {cancel.isPending ? "Cancelling…" : "Yes, cancel"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
