import { Building2, ClipboardList, Home, LogOut, MessageSquare, Plus, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function DashboardPage() {
  const { profile, user, logout, firebaseConfigured } = useAuth()
  const name = profile?.displayName || user?.displayName || 'Usuario demo'
  const role = profile?.role || (firebaseConfigured ? 'BUYER' : 'DEMO')

  return <div className="page-shell dashboard-page">
    <header className="dashboard-header">
      <Link to="/" className="brand"><div className="brand-mark"><ShieldCheck size={22}/></div><span>PropTrust</span></Link>
      <div className="dashboard-user"><span><b>{name}</b><small>{role}</small></span>{user && <button className="ghost compact" onClick={logout}><LogOut size={16}/>Salir</button>}</div>
    </header>

    <main className="dashboard-main">
      {!firebaseConfigured && <div className="notice warning">Modo demo: la navegación y formularios están activos; persistencia y sesión real se habilitan al cargar las variables de Firebase.</div>}

      <div className="section-head compact-head"><div><span className="eyebrow">PANEL</span><h1>Centro de operaciones</h1><p>Publicaciones, propuestas, leads y reputación en un único lugar.</p></div><Link to="/publicar" className="primary"><Plus size={17}/>Publicar propiedad</Link></div>

      <div className="dashboard-grid">
        <article className="panel dashboard-card"><Home/><div><strong>0</strong><span>Propiedades activas</span></div><Link to="/publicar">Crear primera publicación →</Link></article>
        <article className="panel dashboard-card"><ClipboardList/><div><strong>0</strong><span>Propuestas recibidas</span></div><span className="muted-text">Marketplace inverso</span></article>
        <article className="panel dashboard-card"><MessageSquare/><div><strong>0</strong><span>Leads abiertos</span></div><span className="muted-text">CRM</span></article>
        <article className="panel dashboard-card"><Building2/><div><strong>—</strong><span>Trust Score</span></div><span className="muted-text">Sin datos suficientes</span></article>
      </div>

      <section className="panel dashboard-section">
        <div><span className="eyebrow">SIGUIENTE HITO</span><h2>Publicá la primera propiedad real</h2><p>El circuito implementado guarda publicaciones en Firestore cuando Firebase está configurado. Las fotos, propuestas profesionales y CRM se conectan en los siguientes bloques.</p></div>
        <Link className="primary" to="/publicar">Ir al formulario</Link>
      </section>
    </main>
  </div>
}
