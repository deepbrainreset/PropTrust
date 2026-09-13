import { useEffect } from 'react'
import { ArrowLeft, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { applySeo } from '../lib/seo'
import { billingConfigured, billingPlans } from '../services/billing'

export function PricingPage(){
  const configured=billingConfigured()
  useEffect(()=>applySeo({title:'Planes para dueños e inmobiliarias | PropTrust',description:'Planes PropTrust para propietarios, corredores e inmobiliarias. Publicación, CRM, captaciones, reputación verificable y herramientas profesionales.',canonicalPath:'/planes'}),[])
  return <div className="page-shell">
    <div className="page-topbar"><Link to="/" className="text-link"><ArrowLeft size={16}/>Inicio</Link><span className="eyebrow">PLANES</span></div>
    <div className="catalog-head"><div><h1>Planes simples, sin mezclar honorarios inmobiliarios con fees de plataforma</h1><p>PropTrust monetiza software y servicios de marketplace. Los honorarios profesionales de una operación inmobiliaria siguen siendo un concepto separado.</p></div><Link className="primary" to="/fundadores">Ver Programa Fundadores</Link></div>
    {!configured&&<div className="notice warning">Cobros online todavía no habilitados. Los botones comerciales se activarán cuando se vincule el proveedor de pagos en producción.</div>}
    <div className="professionals-grid">{billingPlans.map(plan=><article className="panel professional-card" key={plan.id}><div className="professional-card-top"><ShieldCheck/><span className="eyebrow">{plan.audience}</span></div><h2>{plan.name}</h2><strong className="detail-price">{plan.monthlyPriceLabel}</strong><div className="detail-description">{plan.features.map(feature=><p key={feature}><CheckCircle2 size={15}/> {feature}</p>)}</div>{plan.checkoutUrl?<a className="primary wide" href={plan.checkoutUrl} target="_blank" rel="noreferrer">Contratar <ExternalLink size={16}/></a>:plan.id==='owner_free'?<Link className="primary wide" to="/registro">Empezar gratis</Link>:<Link className="ghost wide" to="/fundadores">Solicitar acceso</Link>}</article>)}</div>
    <section className="panel dashboard-section"><div><span className="eyebrow">LANZAMIENTO</span><h2>Primero liquidez; después monetización</h2><p>Durante el período inicial priorizamos sumar inventario y profesionales. El Programa Fundadores mantiene 0% de comisión de plataforma durante 90 días para los primeros 50 participantes elegibles.</p></div></section>
  </div>
}
