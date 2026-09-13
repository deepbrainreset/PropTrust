import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { AdminVerificationPage } from './pages/AdminVerificationPage'
import { CrmPage } from './pages/CrmPage'
import { DashboardPage } from './pages/DashboardPage'
import { FoundersPage } from './pages/FoundersPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { OpportunitiesPage } from './pages/OpportunitiesPage'
import { OwnerProposalsPage } from './pages/OwnerProposalsPage'
import { ProfessionalsPage } from './pages/ProfessionalsPage'
import { ProfessionalProfilePage } from './pages/ProfessionalProfilePage'
import { PropertiesPage } from './pages/PropertiesPage'
import { PropertyDetailPage } from './pages/PropertyDetailPage'
import { PublishPropertyPage } from './pages/PublishPropertyPage'
import { RegisterPage } from './pages/RegisterPage'
import { SuperAdminPage } from './pages/SuperAdminPage'

export function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/propiedades" element={<PropertiesPage />} />
      <Route path="/propiedad/:id" element={<PropertyDetailPage />} />
      <Route path="/profesionales" element={<ProfessionalsPage />} />
      <Route path="/fundadores" element={<FoundersPage />} />
      <Route path="/ingresar" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/panel" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/publicar" element={<ProtectedRoute><PublishPropertyPage /></ProtectedRoute>} />
      <Route path="/oportunidades" element={<ProtectedRoute><OpportunitiesPage /></ProtectedRoute>} />
      <Route path="/propuestas" element={<ProtectedRoute><OwnerProposalsPage /></ProtectedRoute>} />
      <Route path="/crm" element={<ProtectedRoute><CrmPage /></ProtectedRoute>} />
      <Route path="/perfil-profesional" element={<ProtectedRoute><ProfessionalProfilePage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><SuperAdminPage /></ProtectedRoute>} />
      <Route path="/admin/verificaciones" element={<ProtectedRoute><AdminVerificationPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
}
