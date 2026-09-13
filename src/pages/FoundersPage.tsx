import { useEffect } from 'react'
import { ArrowLeft, BadgeCheck, Building2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { applySeo } from '../lib/seo'

export function FoundersPage(){
  useEffect(()=>applySeo({title:'Programa Fundadores para inmobiliarias | PropTrust',description:'Acceso de lanzamiento para las primeras inmobiliarias de PropTrust: publicaciones, CRM y captaciones con 0% de comisión de plataforma durante 90 días.',canonicalPath:'/fundadores'}),[])
  return <div className="page-shell">
    <div className="page-topbar"><Link to="/" className="text-link"><ArrowLeft size={16}/>Inicio</Link><span className="eyebrow">LANZAMIENTO</span></div>
    <section className="panel dashboard-section"><div><span className="pill"><Sparkles size={15}/> Cupos iniciales</span><h1>Programa Fundadores PropTrust</h1><p>Una propuesta de lanzamiento para las primeras 50 inmobiliarias y corredores que quieran probar el marketplace antes de la monetización completa.</p><div className="trust-row"><span><CheckCircle2 size={17}/>0% comisión de plataforma durante 90 días</span><span><CheckCircle2 size={17}/>Sin permanencia</span><span><CheckCircle2 size={17}/>Acceso a captaciones y CRM</span></div><Link className="primary" to="/registro">Solicitar acceso fundador</Link></div><Building2 size={54}/></section>
    <div className="dashboard-grid">
      <article className="panel dashboard-card"><Building2/><div><strong>50</strong><span>Cupos iniciales</span></div><span className="muted-text">Escasez real del programa</span></article>
      <article className="panel dashboard-card"><BadgeCheck/><div><strong>90</strong><span>Días de lanzamiento</span></div><span className="muted-text">Sin comisión de plataforma</span></article>
      <article className="panel dashboard-card"><ShieldCheck/><div><strong>0</strong><span>Ventajas ocultas</span></div><span className="muted-text">Mismas reglas de ranking para todos</span></article>
    </div>
    <section className="panel dashboard-section"><div><span className="eyebrow">QUÉ RECIBEN</span><h2>Más que otro portal de avisos</h2><p>Publicación de cartera, perfil profesional, CRM, solicitudes de visita, reputación verificable y acceso al marketplace inverso donde propietarios pueden recibir propuestas de representación.</p></div></section>
    <section className="panel dashboard-section"><div><span className="eyebrow">DESPUÉS DEL PERÍODO FUNDADOR</span><h2>La monetización se activa de forma transparente</h2><p>Antes de terminar los 90 días se informará el esquema comercial definitivo. El programa fundador no autoriza a PropTrust a cobrar honorarios inmobiliarios ni modifica los honorarios profesionales pactados entre las partes.</p></div></section>
  </div>
}
