import { BadgeCheck, Building2, CalendarDays, ClipboardList, Home, LogOut, MessageSquare, Plus, Search, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function DashboardPage() {
  const { profile, user, logout, firebaseConfigured } = useAuth()
  const name = profile?.displayName || user?.displayName || 'Usuario demo'
  const role = profile?.role || (firebaseConfigured ? 'BUYER' : 'DEMO')
  const isProfessional = role === 'AGENT' || role === 'AGENCY' || role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'DEMO'
  const canHaveProfessionalProfile = role === 'AGENT' || role === 'AGENCY' || role === 'DEMO'
  const isOwner = role === 'OWNER' || role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'DEMO'
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'DEMO'
  const hasCrm = isProfessional || isOwner

  return <div className="page-shell dashboard-page">
    <header className="dashboard-header">
      <Link to="/" className="brand"><div className="brand-mark"><ShieldCheck size={22}/></div><span>PropTrust</span></Link>
      <div className="dashboard-user"><span><b>{name}</b><small>{role}</small></span>{user && <button className="ghost compact" onClick={logout}><LogOut size={16}/>Salir</button>}</div>
    </header>

    <main className="dashboard-main">
      {!firebaseConfigured && <div className="notice warning">Modo demo: la navegación y formularios están activos; persistencia y sesión real se habilitan al cargar las variables de Firebase.</div>}
      <div className="section-head compact-head"><div><span className="eyebrow">PANEL</span><h1>Centro de operaciones</h1><p>Publicaciones, propuestas, leads, visitas y reputación en un único lugar.</p></div><Link to="/publicar" className="primary"><Plus size={17}/>Publicar propiedad</Link></div>

      <div className="dashboard-grid">
        <article className="panel dashboard-card"><Home/><div><strong>0</strong><span>Propiedades activas</span></div><Link to="/publicar">Crear publicación →</Link></article>
        <article className="panel dashboard-card"><ClipboardList/><div><strong>0</strong><span>{isProfessional?'Captaciones':'Propuestas recibidas'}</span></div>{isProfessional?<Link to="/oportunidades">Ver oportunidades →</Link>:isOwner?<Link to="/propuestas">Comparar propuestas →</Link>:<span className="muted-text">Marketplace inverso</span>}</article>
        <article className="panel dashboard-card"><MessageSquare/><div><strong>0</strong><span>Leads abiertos</span></div>{hasCrm?<Link to="/crm">Abrir CRM →</Link>:<span className="muted-text">Consultas de propiedades</span>}</article>
        <article className="panel dashboard-card"><Building2/><div><strong>—</strong><span>Trust Score</span></div>{canHaveProfessionalProfile?<Link to="/perfil-profesional">Gestionar perfil →</Link>:<span className="muted-text">Sin datos suficientes</span>}</article>
      </div>

      <div className="dashboard-actions-grid">
        <Link className="panel quick-action" to="/propiedades"><Search/><span><b>Explorar propiedades</b><small>Catálogo público y filtros.</small></span></Link>
        {isProfessional&&<Link className="panel quick-action" to="/oportunidades"><ClipboardList/><span><b>Buscar captaciones</b><small>Propietarios que aceptan propuestas.</small></span></Link>}
        {isOwner&&<Link className="panel quick-action" to="/propuestas"><ShieldCheck/><span><b>Comparar propuestas</b><small>Rango, comisión, plazo y estrategia.</small></span></Link>}
        {hasCrm&&<Link className="panel quick-action" to="/crm"><CalendarDays/><span><b>CRM y visitas</b><small>Pipeline comercial y agenda de solicitudes.</small></span></Link>}
        {canHaveProfessionalProfile&&<Link className="panel quick-action" to="/perfil-profesional"><BadgeCheck/><span><b>Perfil y verificación</b><small>Matrícula, datos públicos y Trust Score.</small></span></Link>}
        {isAdmin&&<Link className="panel quick-action" to="/admin"><ShieldCheck/><span><b>Super Admin</b><small>Verificaciones, reputación y control operativo.</small></span></Link>}
      </div>

      <section className="panel dashboard-section"><div><span className="eyebrow">FLUJO ACTIVO</span><h2>De la publicación a la reputación verificable</h2><p>PropTrust conecta captación, consultas, visitas, CRM, verificación profesional y evidencia reputacional.</p></div><Link className="primary" to={isAdmin?'/admin':canHaveProfessionalProfile?'/perfil-profesional':hasCrm?'/crm':'/propiedades'}>{isAdmin?'Abrir Super Admin':canHaveProfessionalProfile?'Gestionar perfil':hasCrm?'Abrir CRM':'Explorar propiedades'}</Link></section>
    </main>
  </div>
}
