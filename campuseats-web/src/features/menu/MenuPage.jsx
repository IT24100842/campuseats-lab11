import { useCallback, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { useMenu, useToggleFavourite } from "./useMenu.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MenuList from "./components/MenuList.jsx";

const PAGE_SIZE = 6;
const CATEGORIES = ["All", "Rice & Kottu", "Short Eats", "Hoppers", "Drinks"];

// ── Slides 32–36 in one page ─────────────────────────────────────
// CLIENT state (useState): search text, category, page – UI concerns.
// SERVER state (TanStack Query): the menu items – cached, refetched,
// shared. This separation is Slide 33's key distinction, live.
export default function MenuPage() {
  useDocumentTitle("Menu");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  // Slide 21: debounce – one request after typing stops, not per key
  const debouncedSearch = useDebounce(search, 400);

  const filters = { search: debouncedSearch, category, page, pageSize: PAGE_SIZE };
  const { data, isPending, isError, isFetching } = useMenu(filters);
  const toggleFav = useToggleFavourite(filters);

  // Slide 43: useCallback keeps this function's identity stable so
  // React.memo on MenuItemCard actually works. Remove useCallback
  // and watch every card re-render on each keystroke again.
  const handleToggleFavourite = useCallback(
    (item) => toggleFav.mutate(item),
    [toggleFav.mutate]
  );

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1;

  return (
    <>
      <h2>Menu {isFetching && !isPending && <span className="muted">(refreshing…)</span>}</h2>

      <div className="toolbar">
        <SearchBar
          placeholder="Search dishes… (debounced)"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Slide 32: ALWAYS handle the three request states */}
      {isPending && <Spinner label="Loading menu…" />}
      {isError && (
        <div className="alert error">
          Failed to load the menu. Check that the API is running and that <code>VITE_API_URL</code> points to it.
        </div>
      )}

      {data && (
        <>
          {data.items.length === 0 && (
            <div className="alert info">No dishes match your search.</div>
          )}
          <MenuList dishes={data.items} onToggleFavourite={handleToggleFavourite} />

          {/* Slide 36: server-side pagination */}
          <div className="pagination">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </Button>
            <span className="muted">Page {page} of {totalPages}</span>
            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </Button>
          </div>
        </>
      )}
    </>
  );
}
