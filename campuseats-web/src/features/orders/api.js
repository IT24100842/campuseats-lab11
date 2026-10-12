import { apiClient } from "../../api/client.js";

export async function fetchMyOrders(studentId) {
  const res = await apiClient.get("/orders", {
    params: { studentId, _sort: "placedAt", _order: "desc" },
  });
  return res.data;
}

export async function fetchAllOrders() {
  const res = await apiClient.get("/orders", {
    params: { _sort: "placedAt", _order: "desc" },
  });
  return res.data;
}

export async function cancelOrder(orderId) {
  const res = await apiClient.patch(`/orders/${orderId}`, {
    status: "Cancelled",
  });
  return res.data;
}
