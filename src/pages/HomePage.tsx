import { ArrowRight, Bath, BedDouble, Building2, CheckCircle2, MapPin, Ruler, Search, ShieldCheck, Sparkles, Star, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

type Property = {
  id: string
  title: string
  location: string
  price: string
  operation: string
  rooms: number
  baths: number
  sqm: number
  score: number
  badge: string
  image: string
}

const demoProperties: Property[] = [
  { id:'p1', title:'Departamento luminoso con balcón', location:'Palermo, CABA', price:'USD 128.000', operation:'Venta', rooms:3, baths:1, sqm:62, score:91, badge:'Demo · Dueño directo', image:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' },
  { id:'p2', title:'PH reciclado con patio', location:'Villa Crespo, CABA', price:'USD 149.000', operation:'Venta', rooms:4, baths:2, sqm:88, score:87, badge:'Demo · Profesional', image:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80' },
  { id:'p3', title:'Monoambiente moderno', location:'Recoleta, CABA', price:'ARS 650.000 / mes', operation:'Alquiler', rooms:1, baths:1, sqm:34, score:84, badge:'Demo · Dueño directo', image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80' }
]

function Logo(){
  return <div className="brand"><div className="brand-mark"><ShieldCheck size={22}/></div><span>PropTrust</span></div>
}

function PropertyCard({p}:{p:Property}){
  return <article className="property-card">
    <div className="property-image" style={{backgroundImage:`url(${p.image})`}}><span className="demo-badge">{p.badge}</span><span className="score-badge">Score {p.score}/100</span></div>
    <div className="property-body"><div className="eyebrow">{p.operation}</div><h3>{p.title}</h3><div className="location"><MapPin size={15}/>{p.location}</div><strong className="price">{p.price}</strong><div className="facts"><span><BedDouble size={16}/>{p.rooms} amb.</span><span><Bath size={16}/>{p.baths}</span><span><Ruler size={16}/>{p.sqm} m²</span></div></div>
  </article>
}

export function HomePage(){
  return <div className="app-shell">
    <header className="site-header"><Link to="/"><Logo/></Link><nav><a href="#propiedades">Propiedades</a><a href="#profesionales">Profesionales</a><a href="#como-funciona">Cómo funciona</a></nav><div className="header-actions"><Link className="ghost" to="/ingresar">Ingresar</Link><Link className="primary" to="/publicar">Publicar gratis</Link></div></header>
    <main>
      <section className="hero"><div className="hero-copy"><span className="pill"><Sparkles size={15}/> Marketplace inmobiliario con reputación verificable</span><h1>Encontrá una propiedad. <span>Conocé quién está detrás.</span></h1><p>Propiedades, dueños e inmobiliarias con información clara, reputación auditable y herramientas para decidir mejor.</p><div className="search-box"><select aria-label="Operación"><option>Comprar</option><option>Alquilar</option><option>Temporario</option></select><input placeholder="Barrio, ciudad o dirección" /><button className="primary"><Search size={18}/>Buscar</button></div><div className="trust-row"><span><CheckCircle2 size={17}/>Publicación gratuita</span><span><ShieldCheck size={17}/>Identidad y matrícula verificables</span><span><Star size={17}/>Reseñas con operación verificada</span></div></div><div className="hero-panel"><div className="score-card"><div><small>Trust Score</small><strong>96</strong><span>/100</span></div><ShieldCheck size={38}/></div><div className="mini-card"><div className="avatar"><Building2/></div><div><b>Estudio Demo</b><span>Profesional de demostración</span></div><div className="rating"><Star size={15}/>4,9</div></div><div className="mini-card"><Users/><div><b>Marketplace inverso</b><span>Los profesionales pueden competir por captar tu propiedad.</span></div></div></div></section>
      <section className="stats"><div><strong>1</strong><span>perfil</span></div><div><strong>2</strong><span>scores transparentes</span></div><div><strong>0</strong><span>datos reales inventados</span></div><div><strong>100%</strong><span>datos demo identificados</span></div></section>
      <section id="propiedades" className="section"><div className="section-head"><div><span className="eyebrow">EXPLORAR</span><h2>Propiedades destacadas</h2><p>Contenido de demostración para validar UX. No representa publicaciones reales.</p></div><button className="link-btn">Ver todas <ArrowRight size={17}/></button></div><div className="property-grid">{demoProperties.map(p=><PropertyCard key={p.id} p={p}/>)}</div></section>
      <section id="como-funciona" className="section muted"><div className="section-head"><div><span className="eyebrow">MARKETPLACE INVERSO</span><h2>El dueño publica. Los profesionales compiten.</h2></div></div><div className="steps"><div className="step"><span>01</span><h3>Publicá gratis</h3><p>El propietario crea su publicación y decide si quiere recibir propuestas profesionales.</p></div><div className="step"><span>02</span><h3>Recibí propuestas</h3><p>Corredores e inmobiliarias pueden proponer comisión, estrategia, servicios y rango de precio.</p></div><div className="step"><span>03</span><h3>Compará reputación</h3><p>Trust Score, reseñas y operaciones verificadas ayudan a comparar sin depender de promesas.</p></div><div className="step"><span>04</span><h3>Elegí con datos</h3><p>El propietario acepta, rechaza o continúa como dueño directo.</p></div></div></section>
      <section id="profesionales" className="section professional"><div><span className="eyebrow">PARA INMOBILIARIAS Y CORREDORES</span><h2>Convertí reputación en captaciones.</h2><p>Perfil profesional, CRM, oportunidades de captación, propuestas comparables y analítica en un único lugar.</p><Link className="primary" to="/panel">Crear perfil profesional <ArrowRight size={18}/></Link></div><div className="professional-panel"><div className="metric"><span>Trust Score</span><strong>—</strong><small>Sin datos suficientes</small></div><div className="metric"><span>Operaciones verificadas</span><strong>0</strong><small>Demo</small></div><div className="metric"><span>Tiempo de respuesta</span><strong>—</strong><small>Sin datos suficientes</small></div></div></section>
    </main>
    <footer><Logo/><span>MVP de demostración · Argentina</span><span>© 2026 PropTrust</span></footer>
  </div>
}
