import './App.css';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { Footer } from './components/ui';
import { STAFF_ROLES, homeFor } from './lib/roles';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ReservationsPage from './pages/ReservationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminReservationsPage from './pages/AdminReservationsPage';
import DishListPage from './pages/DishListPage';
import OrderPayPage from './pages/OrderPayPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ProfilePage from './pages/ProfilePage';
import UnpaidNotice from './components/UnpaidNotice';
import { CartToast } from './components/CartFeedback';

interface RequireAuthProps { children: ReactNode }

function RequireAuth({ children }: RequireAuthProps) {
  const auth = useAuth() as { isAuthenticated?: boolean; loading?: boolean };
  if (auth && auth.loading) {
    return null;
  }
  const authed = auth && typeof auth.isAuthenticated === 'boolean' ? auth.isAuthenticated : Boolean(localStorage.getItem('token'));
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

interface RequireRoleProps { roles: readonly string[]; children: ReactNode }

function RequireRole({ roles, children }: RequireRoleProps) {
  const auth = useAuth() as { isAuthenticated?: boolean; loading?: boolean; user?: { role?: string } | null };
  if (auth && auth.loading) {
    return null;
  }
  if (auth == null || auth.isAuthenticated !== true) {
    return <Navigate to="/login" replace />;
  }
  const role = (auth.user && auth.user?.role) || '';
  if (roles.indexOf(role) < 0) {
    return <Navigate to={homeFor(role)} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ErrorBoundary>
          <div className="ds-page">
            <Navbar />
            <main className="ds-page-main">
              <UnpaidNotice />
              <CartToast />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
                <Route path="/orders" element={<RequireAuth><OrderHistoryPage /></RequireAuth>} />
                <Route path="/reservations" element={<RequireAuth><ReservationsPage /></RequireAuth>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/staff/dashboard" element={<RequireRole roles={STAFF_ROLES}><AdminDashboardPage /></RequireRole>} />
                <Route path="/staff/menu" element={<RequireRole roles={STAFF_ROLES}><AdminMenuPage /></RequireRole>} />
                <Route path="/staff/orders" element={<RequireRole roles={STAFF_ROLES}><AdminOrdersPage /></RequireRole>} />
                <Route path="/staff/reservations" element={<RequireRole roles={STAFF_ROLES}><AdminReservationsPage /></RequireRole>} />
                <Route path="/dishes" element={<DishListPage />} />
                <Route path="/order-pay" element={<RequireAuth><OrderPayPage /></RequireAuth>} />
                <Route path="/payment-cancel" element={<PaymentCancelPage />} />
                <Route path="/payment-success" element={<RequireAuth><PaymentSuccessPage /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                <Route path="/dashboard" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer brand="Resto Order App 3483" columns={[{ title: 'Explore', links: [{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Dishes', to: '/dishes' }] }]} />
          </div>
        </ErrorBoundary>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
