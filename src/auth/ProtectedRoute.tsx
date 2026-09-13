import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, firebaseConfigured } = useAuth()
  const location = useLocation()

  if (!firebaseConfigured) return <>{children}</>
  if (loading) return <div className="page-shell"><div className="panel">Cargando sesión…</div></div>
  if (!user) return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />

  return <>{children}</>
}
