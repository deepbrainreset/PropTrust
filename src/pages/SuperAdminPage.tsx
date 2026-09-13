import { Activity, BadgeCheck, Building2, FileCheck2, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function SuperAdminPage(){
  const { profile, firebaseConfigured }=useAuth()
  const role=profile?.role||(firebaseConfigured?'BUYER':'DEMO')
  const allowed=role==='ADMIN'||role==='SUPER_ADMIN'||role==='DEMO'
  if(!allowed)return <div className="page-shell"><div className="panel access-panel"><h1>Acceso restringido</h1><p>Este módulo requiere rol ADMIN o SUPER_ADMIN.</p><Link className="primary" to="/panel">Volver al panel</Link></div></div>

  return <div className="page-shell dashboard-page">
    <div className="page-topbar"><Link className="text-link" to="/panel">← Panel</Link><span className="eyebrow">SUPER ADMIN</span></div>
    {!firebaseConfigured&&<div className="notice warning">Modo demo: los contadores se muestran como estructura operativa; se alimentarán desde Firebase en producción.</div>}
    <div className="section-head compact-head"><div><span className="eyebrow">CONTROL</span><h1>Operaciones y confianza</h1><p>Supervisión de verificaciones, reputación, publicaciones y evidencia.</p></div></div>
    <div className="dashboard-grid">
      <article className="panel dashboard-card"><BadgeCheck/><div><strong>—</strong><span>Verificaciones pendientes</span></div><Link to="/admin/verificaciones">Revisar →</Link></article>
      <article className="panel dashboard-card"><FileCheck2/><div><strong>—</strong><span>Operaciones por verificar</span></div><span className="muted-text">Evidencia transaccional</span></article>
      <article className="panel dashboard-card"><Building2/><div><strong>—</strong><span>Profesionales activos</span></div><Link to="/profesionales">Directorio →</Link></article>
      <article className="panel dashboard-card"><Activity/><div><strong>v1</strong><span>Property Score</span></div><span className="muted-text">Algoritmo auditable</span></article>
    </div>
    <section className="panel dashboard-section"><div><span className="eyebrow">PRINCIPIO</span><h2>La plataforma no auto-certifica evidencia</h2><p>Verificaciones profesionales, operaciones verificadas y señales reputacionales sensibles sólo pueden escalar mediante controles administrativos o procesos confiables. PropTrust Inmobiliaria, cuando se incorpore, se regirá por las mismas reglas.</p></div><ShieldCheck size={36}/></section>
  </div>
}
