import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CalendarDays, Check, Loader2, Mail, MapPin, MessageSquare, PhoneCall, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { listAssignedLeads, listOwnerVisits, updateLeadStage, updateVisitStatus } from '../services/crm'
import type { LeadRecord, LeadStage, VisitRequest } from '../types/domain'

const stages: {id:LeadStage;label:string}[]=[
  {id:'new',label:'Nuevo'},{id:'contacted',label:'Contactado'},{id:'visit',label:'Visita'},{id:'negotiation',label:'Negociación'},{id:'reservation',label:'Reserva'},{id:'closed',label:'Cerrado'},{id:'lost',label:'Perdido'}
]

const demoLeads:LeadRecord[]=[
  {id:'demo-l1',propertyId:'demo-1',propertyTitle:'Departamento luminoso con balcón',ownerId:'demo',requesterId:'u1',requesterName:'Sofía Demo',requesterEmail:'sofia@example.com',assigneeId:'demo',message:'Quisiera coordinar una visita esta semana.',stage:'new',source:'property_contact'},
  {id:'demo-l2',propertyId:'demo-1',propertyTitle:'Departamento luminoso con balcón',ownerId:'demo',requesterId:'u2',requesterName:'Martín Demo',requesterEmail:'martin@example.com',assigneeId:'demo',message:'Estoy evaluando una oferta.',stage:'negotiation',source:'property_contact'}
]
const demoVisits:VisitRequest[]=[
  {id:'demo-v1',propertyId:'demo-1',propertyTitle:'Departamento luminoso con balcón',ownerId:'demo',requesterId:'u1',requesterName:'Sofía Demo',requesterEmail:'sofia@example.com',requestedDate:'2026-09-16',requestedTime:'17:30',notes:'Después del trabajo.',status:'pending'}
]

export function CrmPage(){
  const {user,profile,firebaseConfigured}=useAuth()
  const [leads,setLeads]=useState<LeadRecord[]>(firebaseConfigured?[]:demoLeads)
  const [visits,setVisits]=useState<VisitRequest[]>(firebaseConfigured?[]:demoVisits)
  const [loading,setLoading]=useState(firebaseConfigured)
  const [error,setError]=useState('')
  const [busy,setBusy]=useState('')

  const allowed=useMemo(()=>!firebaseConfigured||['OWNER','AGENT','AGENCY','ADMIN','SUPER_ADMIN'].includes(profile?.role||''),[firebaseConfigured,profile])

  useEffect(()=>{
    if(!firebaseConfigured||!user||!allowed)return
    Promise.all([listAssignedLeads(user.uid),listOwnerVisits(user.uid)])
      .then(([leadRows,visitRows])=>{setLeads(leadRows);setVisits(visitRows)})
      .catch(err=>setError(err instanceof Error?err.message:'No se pudo cargar el CRM.'))
      .finally(()=>setLoading(false))
  },[firebaseConfigured,user,allowed])

  async function moveLead(id:string,stage:LeadStage){
    setBusy(id);setError('')
    try{
      if(firebaseConfigured)await updateLeadStage(id,stage)
      setLeads(prev=>prev.map(l=>l.id===id?{...l,stage}:l))
    }catch(err){setError(err instanceof Error?err.message:'No se pudo actualizar el lead.')}finally{setBusy('')}
  }

  async function setVisit(id:string,status:VisitRequest['status']){
    setBusy(id);setError('')
    try{
      if(firebaseConfigured)await updateVisitStatus(id,status)
      setVisits(prev=>prev.map(v=>v.id===id?{...v,status}:v))
    }catch(err){setError(err instanceof Error?err.message:'No se pudo actualizar la visita.')}finally{setBusy('')}
  }

  if(!allowed)return <div className="page-shell"><div className="panel access-panel"><h1>CRM profesional</h1><p>Tu perfil actual no administra leads ni propiedades.</p><Link className="primary" to="/panel">Volver al panel</Link></div></div>

  return <div className="page-shell">
    <div className="page-topbar"><Link to="/panel" className="text-link"><ArrowLeft size={16}/>Panel</Link><span className="eyebrow">CRM</span></div>
    <div className="catalog-head"><div><h1>Leads y visitas</h1><p>Seguimiento comercial desde la primera consulta hasta el cierre.</p></div></div>
    {!firebaseConfigured&&<div className="notice warning">Modo demo: todos los contactos y visitas de esta pantalla son ficticios.</div>}
    {error&&<div className="notice error">{error}</div>}
    {loading&&<div className="catalog-empty"><Loader2 className="spin"/>Cargando CRM…</div>}

    {!loading&&<>
      <section className="crm-section">
        <div className="crm-title"><MessageSquare/><div><h2>Pipeline comercial</h2><p>{leads.length} leads</p></div></div>
        <div className="kanban">{stages.map(stage=><div className="kanban-column" key={stage.id}><div className="kanban-head"><b>{stage.label}</b><span>{leads.filter(l=>l.stage===stage.id).length}</span></div><div className="kanban-stack">{leads.filter(l=>l.stage===stage.id).map(lead=><article className="panel lead-card" key={lead.id}><span className="eyebrow">{lead.source==='visit_request'?'VISITA':'CONSULTA'}</span><h3>{lead.requesterName}</h3><p className="lead-property"><MapPin size={14}/>{lead.propertyTitle}</p><p>{lead.message}</p><a href={`mailto:${lead.requesterEmail}`} className="lead-contact"><Mail size={14}/>{lead.requesterEmail}</a><select disabled={busy===lead.id} value={lead.stage} onChange={e=>moveLead(lead.id!,e.target.value as LeadStage)}>{stages.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></article>)}</div></div>)}</div>
      </section>

      <section className="crm-section visits-section">
        <div className="crm-title"><CalendarDays/><div><h2>Solicitudes de visita</h2><p>{visits.length} solicitudes</p></div></div>
        <div className="visits-grid">{visits.map(v=><article className={`panel visit-card visit-${v.status}`} key={v.id}><div className="visit-card-head"><div><span className="eyebrow">{v.requestedDate} · {v.requestedTime}</span><h3>{v.requesterName}</h3></div><span className="status-pill">{v.status}</span></div><p><MapPin size={14}/>{v.propertyTitle}</p>{v.notes&&<p>{v.notes}</p>}<a href={`mailto:${v.requesterEmail}`}><Mail size={14}/>{v.requesterEmail}</a>{v.status==='pending'&&<div className="proposal-actions"><button className="ghost danger" disabled={busy===v.id} onClick={()=>setVisit(v.id!,'rejected')}><X size={16}/>Rechazar</button><button className="primary" disabled={busy===v.id} onClick={()=>setVisit(v.id!,'confirmed')}><Check size={16}/>Confirmar</button></div>}{v.status==='confirmed'&&<button className="ghost wide" disabled={busy===v.id} onClick={()=>setVisit(v.id!,'completed')}><PhoneCall size={16}/>Marcar realizada</button>}</article>)}</div>
      </section>
    </>}
  </div>
}
