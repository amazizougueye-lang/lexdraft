import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Nouveau from './pages/Nouveau'
import DocumentPreview from './pages/DocumentPreview'
import Profil from './pages/Profil'
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite'
import ConditionsUtilisation from './pages/ConditionsUtilisation'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div
      className="flex items-center justify-center min-h-screen text-[14px]"
      style={{ background: '#091413', color: '#8aada4' }}
    >
      Chargement…
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div
      className="flex items-center justify-center min-h-screen text-[14px]"
      style={{ background: '#091413', color: '#8aada4' }}
    >
      Chargement…
    </div>
  )
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
      <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><ProfileProvider><Dashboard /></ProfileProvider></ProtectedRoute>} />
      <Route path="/nouveau" element={<ProtectedRoute><ProfileProvider><Nouveau /></ProfileProvider></ProtectedRoute>} />
      <Route path="/document/:id" element={<ProtectedRoute><ProfileProvider><DocumentPreview /></ProfileProvider></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><ProfileProvider><Profil /></ProfileProvider></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: { background: '#0f1f1d', border: '1px solid #1e3b32', color: '#F0F4F2' },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
