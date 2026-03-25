import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import BottomNav from './components/BottomNav'
import LoginPage from './pages/LoginPage'
import VerifyOtpPage from './pages/VerifyOtpPage'
import DashboardPage from './pages/DashboardPage'
import QrPage from './pages/QrPage'
import HistoryPage from './pages/HistoryPage'
import PaymentsPage from './pages/PaymentsPage'
import LegalPage from './pages/LegalPage'
import { isAuthenticated } from './utils/auth'

function PrivateLayout({ children }) {
  return (
    <div className="app-shell">
      <main className="page-content">{children}</main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <DashboardPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <QrPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <HistoryPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <PaymentsPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/legal"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <LegalPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
