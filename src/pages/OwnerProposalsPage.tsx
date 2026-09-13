import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Clock3, Loader2, MapPin, Percent, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { listOwnerProperties } from '../services/properties'
import { listProposalsForProperty, setProposalStatus } from '../services/proposals'
import type { AgencyProposal, PropertyRecord } from '../types/domain'

type Bundle={property:PropertyRecord;proposals:AgencyProposal[]}

const demoBundle:Bundle={
  property:{id:'demo-owner-property',ownerId:'demo',title:'Departamento 3 ambientes con balcón',description:'Demo',operation:'sale',status:'published',currency:'USD',price:145000,neighborhood:'Caballito',city:'CABA',rooms:3,bedrooms:2,bathrooms:1,areaM2:68,propertyType:'Departamento',amenities:[],acceptsAgencyProposals:true,imageUrls:[],propertyScore:null},
  proposals:[
    {id:'demo-p1',propertyId:'demo-owner-property',professionalId:'demo-a',professionalName:'Estudio Norte',professionalRole:'AGENCY',valuationMin:138000,valuationMax:149000,commissionPct:3,estimatedDays:55,strategy:'Lanzamiento con fotografía profesional, pauta segmentada y seguimiento semanal.',services:['Fotografía','Portales','Pauta digital','Reportes'],status:'sent'},
    {id:'demo-p2',propertyId:'demo-owner-property',professionalId:'demo-b',professionalName:'Lucía Demo',professionalRole:'AGENT',valuationMin:142000,valuationMax:152000,commissionPct:2.5,estimatedDays:70,strategy:'Precio competitivo con validación de demanda y agenda concentrada de visitas.',services:['Tasación','Publicación','Visitas'],status:'sent'},
  ]
}

export function OwnerProposalsPage(){
  const {user,profile,firebaseConfigured}=useAuth()
  const [bundles,setBundles]=useState<Bundle[]>(firebaseConfigured?[]:[demoBundle])
  const [loading,setLoading]=useState(firebaseConfigured)
  const [error,setError]=useState('')
  const [busyId,setBusyId]=useState('')

  useEffect(()=>{
    if(!firebaseConfigured||!user) return
    const ownerId=user.uid
    async function load(){
      try{
        const properties=await listOwnerProperties(ownerId)
        const result=await Promise.all(properties.filter(p=>p.acceptsAgencyProposals).map(async property=>({property,proposals:await listProposalsForProperty(property.id!)})))
        setBundles(result)
      }catch(err){setError(err instanceof Error?err.message:'No se pudieron cargar las propuestas.')}finally{setLoading(false)}
    }
    load()
  },[firebaseConfigured,user])

  const allowed=!firebaseConfigured||profile?.role==='OWNER'||profile?.role==='ADMIN'||profile?.role==='SUPER_ADMIN'
  if(!allowed)return <div className="page-shell"><div className="panel access-panel"><h1>Propuestas para propietarios</h1><p>Este panel corresponde a propiedades publicadas por dueños. Tu perfil actual es <b>{profile?.role}</b>.</p><Link className="primary" to="/panel">Volver al panel</Link></div></div>

  async function change(proposalId:string,status:'accepted'|'rejected'){
    if(!firebaseConfigured){
      setBundles(prev=>prev.map(b=>({...b,proposals:b.proposals.map(p=>p.id===proposalId?{...p,status}:p)})))
      return
    }
    setBusyId(proposalId)
    try{
      await setProposalStatus(proposalId,status)
      setBundles(prev=>prev.map(b=>({...b,proposals:b.proposals.map(p=>p.id===proposalId?{...p,status}:p)})))
    }catch(err){setError(err instanceof Error?err.message:'No se pudo actualizar la propuesta.')}finally{setBusyId('')}
  }

  return <div className="page-shell">
    <div className="page-topbar"><Link to="/panel" className="text-link"><ArrowLeft size={16}/>Panel</Link><span className="eyebrow">COMPARADOR</span></div>
    <div className="catalog-head"><div><h1>Propuestas recibidas</h1><p>Compará rango de precio, comisión, plazo y estrategia antes de elegir representación.</p></div></div>
    {!firebaseConfigured&&<div className="notice warning">Modo demo: las propuestas mostradas son ficticias y sólo sirven para validar el flujo.</div>}
    {error&&<div className="notice error">{error}</div>}
    {loading&&<div className="catalog-empty"><Loader2 className="spin"/>Cargando propuestas…</div>}

    {!loading&&bundles.length===0&&<div className="catalog-empty">Todavía no hay propiedades con propuestas habilitadas.</div>}

    <div className="proposal-bundles">{bundles.map(({property,proposals})=><section className="panel owner-proposal-section" key={property.id}><div className="owner-property-head"><div><span className="eyebrow">{property.operation==='sale'?'VENTA':'ALQUILER'}</span><h2>{property.title}</h2><p><MapPin size={15}/>{property.neighborhood}, {property.city}</p></div><strong>{property.currency} {property.price.toLocaleString('es-AR')}</strong></div>{proposals.length===0?<div className="proposal-empty">Aún no recibiste propuestas para esta propiedad.</div>:<div className="proposal-compare-grid">{proposals.map(p=><article className={`proposal-card status-${p.status}`} key={p.id}><div className="proposal-card-head"><div><span className="eyebrow">{p.professionalRole==='AGENCY'?'INMOBILIARIA':'CORREDOR'}</span><h3>{p.professionalName||'Profesional'}</h3></div><span className="status-pill">{p.status==='sent'?'Pendiente':p.status==='accepted'?'Aceptada':p.status==='rejected'?'Rechazada':'Retirada'}</span></div><div className="proposal-metrics"><div><small>Rango sugerido</small><strong>USD {p.valuationMin.toLocaleString('es-AR')}–{p.valuationMax.toLocaleString('es-AR')}</strong></div><div><Percent size={16}/><span>{p.commissionPct}% comisión</span></div><div><Clock3 size={16}/><span>{p.estimatedDays} días estimados</span></div></div><div className="proposal-copy"><b>Estrategia</b><p>{p.strategy}</p></div><div className="proposal-services">{p.services.map(service=><span key={service}>{service}</span>)}</div>{p.status==='sent'&&<div className="proposal-actions"><button className="ghost danger" disabled={busyId===p.id} onClick={()=>change(p.id!,'rejected')}><X size={16}/>Rechazar</button><button className="primary" disabled={busyId===p.id} onClick={()=>change(p.id!,'accepted')}><Check size={16}/>Aceptar</button></div>}</article>)}</div>}</section>)}</div>
  </div>
}
