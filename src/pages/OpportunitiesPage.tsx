import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Clock3, DollarSign, Loader2, MapPin, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { listOpenOpportunities, submitProposal } from '../services/proposals'
import type { AgencyProposal, PropertyRecord } from '../types/domain'

const demoOpportunity: PropertyRecord = {
  id:'demo-opportunity', ownerId:'demo-owner', title:'Departamento 3 ambientes con balcón', description:'Oportunidad de demostración.', operation:'sale', status:'published', currency:'USD', price:145000, neighborhood:'Caballito', city:'CABA', rooms:3, bedrooms:2, bathrooms:1, areaM2:68, propertyType:'Departamento', amenities:[], acceptsAgencyProposals:true, imageUrls:['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'], propertyScore:null,
}

export function OpportunitiesPage(){
  const { user, profile, firebaseConfigured } = useAuth()
  const [items,setItems]=useState<PropertyRecord[]>(firebaseConfigured?[]:[demoOpportunity])
  const [selected,setSelected]=useState<PropertyRecord|null>(null)
  const [loading,setLoading]=useState(firebaseConfigured)
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')
  const [error,setError]=useState('')
  const [form,setForm]=useState({valuationMin:'',valuationMax:'',commissionPct:'3',estimatedDays:'60',strategy:'',services:'Fotografía profesional, publicación multicanal, seguimiento de leads'})

  const allowed=useMemo(()=>!firebaseConfigured||profile?.role==='AGENT'||profile?.role==='AGENCY'||profile?.role==='ADMIN'||profile?.role==='SUPER_ADMIN',[firebaseConfigured,profile])

  useEffect(()=>{
    if(!firebaseConfigured||!allowed) return
    listOpenOpportunities().then(setItems).catch(err=>setError(err instanceof Error?err.message:'No se pudieron cargar oportunidades.')).finally(()=>setLoading(false))
  },[allowed,firebaseConfigured])

  async function send(){
    if(!selected) return
    if(!form.valuationMin||!form.valuationMax||!form.strategy.trim()){
      setError('Completá rango de tasación y estrategia comercial.')
      return
    }
    if(!firebaseConfigured){
      setMessage('Propuesta demo validada. Con Firebase activo se guardará en Firestore.')
      return
    }
    if(!user) return
    setBusy(true);setError('');setMessage('')
    try{
      const proposal:AgencyProposal={
        propertyId:selected.id!, professionalId:user.uid,
        valuationMin:Number(form.valuationMin), valuationMax:Number(form.valuationMax),
        commissionPct:Number(form.commissionPct), estimatedDays:Number(form.estimatedDays),
        strategy:form.strategy.trim(), services:form.services.split(',').map(x=>x.trim()).filter(Boolean), status:'sent',
      }
      await submitProposal(proposal)
      setMessage('Propuesta enviada correctamente.')
      setSelected(null)
    }catch(err){setError(err instanceof Error?err.message:'No se pudo enviar la propuesta.')}finally{setBusy(false)}
  }

  if(!allowed) return <div className="page-shell"><div className="panel access-panel"><BriefcaseBusiness/><h1>Área profesional</h1><p>Las oportunidades de captación están disponibles para corredores e inmobiliarias. Tu perfil actual es <b>{profile?.role}</b>.</p><Link className="primary" to="/panel">Volver al panel</Link></div></div>

  return <div className="page-shell">
    <div className="page-topbar"><Link to="/panel" className="text-link"><ArrowLeft size={16}/>Panel</Link><span className="eyebrow">MARKETPLACE INVERSO</span></div>
    <div className="catalog-head"><div><h1>Oportunidades de captación</h1><p>Propietarios que habilitaron propuestas de corredores e inmobiliarias.</p></div></div>
    {!firebaseConfigured&&<div className="notice warning">Modo demo: ninguna oportunidad mostrada corresponde a una propiedad real.</div>}
    {error&&<div className="notice error">{error}</div>}
    {message&&<div className="notice success"><CheckCircle2 size={17}/>{message}</div>}
    {loading&&<div className="catalog-empty"><Loader2 className="spin"/>Cargando oportunidades…</div>}

    <div className="opportunity-grid">{items.map(p=><article className="panel opportunity-card" key={p.id}><div className="opportunity-image" style={{backgroundImage:`url(${p.imageUrls[0]||'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'})`}}>{String(p.id).startsWith('demo')&&<span className="demo-badge">Demo</span>}</div><div className="opportunity-body"><span className="eyebrow">{p.operation==='sale'?'VENTA':'ALQUILER'}</span><h3>{p.title}</h3><p><MapPin size={15}/>{p.neighborhood}, {p.city}</p><strong>{p.currency} {p.price.toLocaleString('es-AR')}</strong><div className="opportunity-meta"><span>{p.areaM2} m²</span><span>{p.rooms} amb.</span><span>Dueño habilitó propuestas</span></div><button className="primary" onClick={()=>{setSelected(p);setMessage('');setError('')}}>Enviar propuesta</button></div></article>)}</div>

    {selected&&<div className="proposal-backdrop" onClick={()=>setSelected(null)}><section className="panel proposal-modal" onClick={e=>e.stopPropagation()}><div className="proposal-title"><div><span className="eyebrow">PROPUESTA PROFESIONAL</span><h2>{selected.title}</h2><p>{selected.neighborhood}, {selected.city}</p></div><button className="ghost compact" onClick={()=>setSelected(null)}>Cerrar</button></div><div className="form-grid"><label>Valoración mínima <div className="input-icon"><DollarSign size={16}/><input type="number" value={form.valuationMin} onChange={e=>setForm({...form,valuationMin:e.target.value})}/></div></label><label>Valoración máxima <div className="input-icon"><DollarSign size={16}/><input type="number" value={form.valuationMax} onChange={e=>setForm({...form,valuationMax:e.target.value})}/></div></label><label>Comisión %<input type="number" step="0.1" min="0" value={form.commissionPct} onChange={e=>setForm({...form,commissionPct:e.target.value})}/></label><label>Días estimados <div className="input-icon"><Clock3 size={16}/><input type="number" min="1" value={form.estimatedDays} onChange={e=>setForm({...form,estimatedDays:e.target.value})}/></div></label><label className="span-2">Estrategia<textarea rows={5} value={form.strategy} onChange={e=>setForm({...form,strategy:e.target.value})} placeholder="Cómo posicionarías y comercializarías esta propiedad."/></label><label className="span-2">Servicios incluidos<input value={form.services} onChange={e=>setForm({...form,services:e.target.value})}/><small>Separados por coma</small></label></div><button className="primary wide" disabled={busy} onClick={send}>{busy?<Loader2 className="spin" size={17}/>:<Send size={17}/>}Enviar propuesta</button></section></div>}
  </div>
}
