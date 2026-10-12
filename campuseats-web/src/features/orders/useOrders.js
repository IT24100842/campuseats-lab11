import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyOrders, cancelOrder } from "./api.js";
import { useAuth } from "../../context/AuthContext.jsx";

// ── Slide 34: server state per-user ──────────────────────────────
export function useMyOrders() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["orders", user.studentId],
    queryFn: () => fetchMyOrders(user.studentId),
    enabled: !!user, // don't fire until we know who is logged in
  });
}

// ── Slide 36: mutation + cache invalidation (the simple pattern) ─
// Compare with useToggleFavourite (optimistic). Here we take the
// easier route: mutate, then invalidate → refetch. Ask students:
// when is each approach the right choice?
export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
