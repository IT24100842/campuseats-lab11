import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMenuItems, toggleFavourite } from "./api.js";

// ── Slides 20 + 34: a FEATURE hook built on TanStack Query ───────
// The page component stays clean: it calls useMenu(filters) and gets
// data + states back. All server-state logic lives here.

export function useMenu(filters) {
  return useQuery({
    // The queryKey includes every filter → each combination is cached
    // separately, and changing a filter automatically refetches.
    queryKey: ["menuItems", filters],
    queryFn: () => fetchMenuItems(filters),
    // Keep the previous page on screen while the next page loads –
    // no jarring blank flash between pages (Slide 36).
    placeholderData: (previous) => previous,
  });
}

// ── Slide 36: OPTIMISTIC UPDATE with rollback ────────────────────
export function useToggleFavourite(filters) {
  const queryClient = useQueryClient();
  const queryKey = ["menuItems", filters];

  return useMutation({
    mutationFn: toggleFavourite,
    // 1. BEFORE the request: update the cache instantly (UI feels immediate)
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) =>
        old && {
          ...old,
          items: old.items.map((m) =>
            m.id === item.id ? { ...m, isFavourite: !m.isFavourite } : m
          ),
        }
      );
      return { previous }; // saved for rollback
    },
    // 2. If the server fails: ROLL BACK to the snapshot.
    //    Demo: stop the API, click a heart – it flips, then flips back.
    onError: (_err, _item, context) => {
      queryClient.setQueryData(queryKey, context.previous);
      alert("Could not save favourite – change rolled back.");
    },
    // 3. Always re-sync with the server afterwards.
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}
