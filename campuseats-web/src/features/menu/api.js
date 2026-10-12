// ── Slide 12: the SERVICE layer of the menu feature ──────────────
// Only this file knows the URL shapes. Components and hooks call
// these functions – the ASP.NET Core API keeps the same URL shapes, so
// nothing outside this file changes.
import { apiClient } from "../../api/client.js";

export async function fetchMenuItems({ search, category, page, pageSize }) {
  const params = {
    _page: page,
    _limit: pageSize,
    _sort: "name",
  };
  if (search) params.q = search;
  if (category !== "All") params.category = category;

  const res = await apiClient.get("/menuItems", { params });
  return {
    items: res.data,
    // the API sends the total row count in a header (exposed via CORS)
    totalCount: Number(res.headers["x-total-count"] ?? res.data.length),
  };
}

export async function toggleFavourite(item) {
  const res = await apiClient.patch(`/menuItems/${item.id}`, {
    isFavourite: !item.isFavourite,
  });
  return res.data;
}
