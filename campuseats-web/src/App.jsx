import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";
import MenuPage from "./features/menu/MenuPage.jsx";
import RegisterPage from "./features/register/RegisterPage.jsx";
import OrdersPage from "./features/orders/OrdersPage.jsx";
import PerfDemoPage from "./features/performance/PerfDemoPage.jsx";

const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));

export default function App() {
  return (
    <Suspense fallback={<div className="container">Loading admin dashboard…</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="perf" element={<PerfDemoPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="orders" element={<OrdersPage />} />

            <Route element={<RoleRoute allow={["admin"]} />}>
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
