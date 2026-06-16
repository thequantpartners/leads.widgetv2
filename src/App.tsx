import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Onboarding } from './pages/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { SuperAdmin } from './pages/SuperAdmin'
import { Spinner } from './components/ui/Spinner'

function Protected({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const { user, profile, loading } = useAuth()
  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-base">
        <Spinner />
      </div>
    )
  if (!user) return <Navigate to="/login" replace />
  if (admin && profile?.role !== 'superadmin') return <Navigate to="/app" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/onboarding"
        element={
          <Protected>
            <Onboarding />
          </Protected>
        }
      />
      <Route
        path="/app"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/admin"
        element={
          <Protected admin>
            <SuperAdmin />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
