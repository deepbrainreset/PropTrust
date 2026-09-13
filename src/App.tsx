import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { PropertiesPage } from './pages/PropertiesPage'
import { PublishPropertyPage } from './pages/PublishPropertyPage'

export function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/propiedades" element={<PropertiesPage />} />
      <Route path="/ingresar" element={<LoginPage />} />
      <Route path="/panel" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/publicar" element={<ProtectedRoute><PublishPropertyPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
}
