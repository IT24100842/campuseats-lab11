# CampusEats Frontend Demo — SE3090 Lecture 02 Teaching Project

**Module:** SE3090 – Software Engineering Frameworks (Year 3, Semester 1)
**Lecture:** 02 – Advanced React Frontend Development
**Purpose:** A single runnable React app in which **every major slide of Lecture 02 maps to real code you can open, run and break live in class.**

This is the frontend of **CampusEats** — the campus food-delivery case study used across the whole module. Today the data comes from a mock API (json-server). In Lectures 03–04 the same frontend patterns connect to the real ASP.NET Core + PostgreSQL backend.

---

## 1. Setup (before class)

Requirements: Node.js 18+.

```bash
npm install
```

Run **two terminals**:

```bash
# Terminal 1 – mock REST API on port 5000 (800 ms artificial delay
# so loading spinners are actually visible on the projector)
npm run api

# Terminal 2 – React app
npm run dev
```

Open http://localhost:5173.

> The 800 ms `--delay` in the `api` script is deliberate — it makes
> loading states, background refetching and optimistic updates visible.
> Remove it to show how fast the cached experience is.

---

## 2. Slide → Code Map

| Lecture section (slides) | Concept | Where in this project |
|---|---|---|
| **Part 1** (11) Feature-based structure | Folders by *feature*, not by file type | `src/features/menu`, `src/features/orders`, `src/features/register` — each owns its `api.js`, hook and pages |
| (12) Separation of UI / logic / services / hooks | Layers | UI: `components/ui/` · Services: `features/*/api.js` · Logic: `features/*/use*.js` hooks · Pages compose them |
| (13) Vocabulary of components | Page / feature / UI components | `pages/` vs `features/*/…Page.jsx` vs `components/ui/` |
| **Part 2** (16) Composition over configuration | Children over prop explosions | `components/ui/Card.jsx`, `Button.jsx` (comments show the BAD version) |
| (17) Compound components | Shared implicit state via private context | `components/ui/Modal.jsx` → used in `OrdersPage.jsx` (cancel confirmation) |
| (18) Controlled vs uncontrolled | Both live | Controlled: search box in `MenuPage.jsx` · Uncontrolled: RHF fields in `RegisterPage.jsx` |
| (19) Reusable component library | Small headless-ish kit | `components/ui/` (Button, Card, Modal, TextField, Spinner) |
| (20–23) Custom hooks | Reusable logic | `hooks/useDebounce.js`, `useLocalStorage.js`, `useToggle.js`, `useDocumentTitle.js`; feature hooks `useMenu.js`, `useOrders.js` |
| **Part 3** (26–28) RHF + Zod | Fast forms, schema validation | `features/register/RegisterPage.jsx` + `schema.js` (regex, refine, cross-field password check, SLIIT email rule) |
| (29) Dynamic fields & errors | `useFieldArray` | Dietary preferences list in `RegisterPage.jsx` |
| (30) Full registration form | Putting it together | The whole `/register` page |
| **Part 4** (32) Axios best practices | One instance, interceptors, 3 request states | `api/client.js`; states handled in `MenuPage.jsx` |
| (33) Client vs server state | The key distinction | `MenuPage.jsx` — `useState` for filters vs `useQuery` for data (see comments) |
| (34) TanStack Query | Caching, keys, background refetch | `features/menu/useMenu.js`, `main.jsx` (QueryClient + Devtools) |
| (36) Pagination, filtering, optimistic updates | All three | Pagination + category filter in `MenuPage.jsx`; **optimistic favourite with rollback** in `useMenu.js`; simpler invalidate-pattern in `useOrders.js` |
| (37) Nested, layout & lazy routes | Router architecture | `App.jsx` + `layouts/AppLayout.jsx` (Outlet); lazy: Orders, Admin, Perf pages |
| (38) Protected & role-based routes | Route guards | `routes/ProtectedRoute.jsx`, `routes/RoleRoute.jsx`, fake login in `context/AuthContext.jsx` |
| (39) Error pages | Catch-all 404 | `pages/NotFoundPage.jsx` (Home page has a deliberate broken link) |
| **Part 5** (42–43) Re-renders, memo, useMemo, useCallback | Live measurable playground | `features/performance/PerfDemoPage.jsx` (+ `React.memo` in `MenuItemCard.jsx`) |
| (44) Lazy loading & bundles | Code splitting | Lazy routes in `App.jsx` — show the Network tab |
| (45–46) State management options | Context in action | `AuthContext.jsx`; discuss where Zustand/RTK would replace it |

---

## 3. Suggested 3-hour demo flow

**Part 1 — Architecture (project tour, ~15 min)**
1. Open the folder tree in VS Code. Ask: "Where would you look for anything order-related?" → one folder.
2. Contrast with a `components/ + pages/ + utils/` dump ("type-based") on the whiteboard.
3. Trace one request through the layers: `MenuPage` → `useMenu` → `api.js` → `client.js`.

**Part 2 — Components & hooks (~30 min)**
4. Open `Modal.jsx`, show the compound pattern, then its use in `OrdersPage.jsx`.
5. Open `useDebounce.js`. Type in the menu search with the Network tab open — one request after typing stops. Comment out the debounce to show request-per-keystroke.

**Part 3 — Forms (~25 min)**
6. `/register`: submit empty → all Zod messages appear. Show the regex and `.refine` password rule in `schema.js`.
7. Open the console: `render <RegisterPage>` does **not** log while typing — RHF is uncontrolled.
8. Add/remove dietary preference rows → `useFieldArray`.

**Part 4 — Server state & routing (~40 min)**
9. `/menu` with json-server running: spinner → data. Open **React Query Devtools**, show the cache keys change as you filter/paginate.
10. Navigate away and back within 30 s → instant render from cache, background refetch ("(refreshing…)" label).
11. **Kill json-server**, click a ❤️ → it flips, then **rolls back** with an alert. Restart the API, click again → sticks. This is the money demo for optimistic updates.
12. Logged out, click **My Orders** → bounced to login with return-path. Login as *student*, try `/admin` → bounced home. Login as *admin* → dashboard appears, and point out the new lazy JS chunk in the Network tab.
13. Click the deliberate **Broken Link** on Home → 404 page.

**Part 5 — Performance (~20 min)**
14. `/perf`: click "Re-render parent" 5× — plain child renders 6×, memo child once.
15. Untick the useMemo checkbox and click again — feel the 150 ms lag.
16. Back on `/menu`, watch the console while typing: `MenuItemCard` logs only when its own data changes (memo + useCallback in `MenuPage.jsx`).

**Wrap-up**
17. Ask the LO4 question: "This app uses Context + TanStack Query and **no Redux**. Was that the right call? When would it stop being enough?" → bridges to the state-management decision table and the LankaMart case study slides.

---

## 4. Things to break on purpose (great teaching moments)

- Remove `useCallback` around `handleToggleFavourite` in `MenuPage.jsx` → every card re-renders per keystroke again (memo defeated by unstable props).
- Remove `placeholderData` in `useMenu.js` → pagination flashes blank between pages.
- Change `staleTime` to `0` in `main.jsx` → every navigation refetches.
- Delete the `Authorization` interceptor in `client.js` and ask: "What would the real backend do to these requests in Lecture 04?"

---

## 5. Link to the rest of SE3090

- **Lecture 03:** point `vite.config.js`'s proxy at the ASP.NET Core API; only `features/*/api.js` changes.
- **Lecture 04:** replace the fake `AuthContext` login with a real JWT flow; `ProtectedRoute`/`RoleRoute` stay identical.
- **Main Assignment:** this structure (features, service layer, query hooks, guards) is exactly what the frontend rubric rewards.

> ⚠️ The login here is intentionally fake and the route guards are UX only.
> Repeat to students: **real security lives on the server** — the frontend
> guard just hides the door; the backend must lock it (Lecture 04).
