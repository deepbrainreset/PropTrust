import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, Eye, Loader2, PauseCircle, PlayCircle, SquarePen, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { listOwnerProperties, setOwnerPropertyStatus, updateOwnerProperty } from '../services/properties'
import type { PropertyRecord, PropertyStatus } from '../types/domain'

const demoRows:PropertyRecord[]=[{id:'demo-owner-1',ownerId:'demo-owner',title:'Departamento demo del propietario',description:'Publicación ficticia para validar gestión de cartera.',operation:'sale',status:'published',currency:'USD',price:120000,neighborhood:'Caballito',city:'CABA',rooms:3,bedrooms:2,bathrooms:1,areaM2:61,expenses:85000,propertyType:'Departamento',amenities:['Balcón'],acceptsAgencyProposals:true,imageUrls:[],propertyScore:null}]

const labels:Record<PropertyStatus,string>={draft:'Borrador',published:'Publicada',paused:'Pausada',reserved:'Reservada',closed:'Cerrada'}

export function OwnerPropertiesPage(){
  const { user, profile, firebaseConfigured }=useAuth()
  const ownerId=user?.uid||'demo-owner'
  const role=profile?.role||(firebaseConfigured?'BUYER':'DEMO')
  const allowed=role==='OWNER'||role==='ADMIN'||role==='SUPER_ADMIN'||role==='DEMO'
  const [rows,setRows]=useState<PropertyRecord[]>(firebaseConfigured?[]:demoRows)
  const [loading,setLoading]=useState(firebaseConfigured)
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')
  const [notice,setNotice]=useState('')

  useEffect(()=>{ if(!firebaseConfigured||!user)return; listOwnerProperties(user.uid).then(setRows).catch(err=>setError(err instanceof Error?err.message:'No se pudieron cargar tus propiedades.')).finally(()=>setLoading(false)) },[firebaseConfigured,user])

  async function changeStatus(row:PropertyRecord,status:PropertyStatus){
    if(!row.id)return
    setBusy(row.id);setError('');setNotice('')
    try{ if(firebaseConfigured)await setOwnerPropertyStatus(row.id,ownerId,status); setRows(prev=>prev.map(p=>p.id===row.id?{...p,status}:p)); setNotice(`Publicación actualizada a: ${labels[status]}.`) }catch(err){setError(err instanceof Error?err.message:'No se pudo actualizar la publicación.')}finally{setBusy('')}
  }

  async function edit(row:PropertyRecord){
    if(!row.id)return
    const title=window.prompt('Título de la publicación',row.title)
    if(title===null)return
    const priceRaw=window.prompt('Precio',String(row.price))
    if(priceRaw===null)return
    const price=Number(priceRaw)
    if(!title.trim()||!Number.isFinite(price)||price<=0){setError('Título y precio deben ser válidos.');return}
    setBusy(row.id);setError('');setNotice('')
    try{ if(firebaseConfigured)await updateOwnerProperty(row.id,ownerId,{title:title.trim(),price}); setRows(prev=>prev.map(p=>p.id===row.id?{...p,title:title.trim(),price}:p)); setNotice('Cambios guardados.') }catch(err){setError(err instanceof Error?err.message:'No se pudieron guardar los cambios.')}finally{setBusy('')}
  }

  if(!allowed)return <div className="page-shell"><div className="panel access-panel"><h1>Acceso restringido</h1><p>La gestión de cartera está disponible para propietarios y administradores.</p><Link className="primary" to="/panel">Volver al panel</Link></div></div>

  return <div className="page-shell">
    <div className="page-topbar"><Link to="/panel" className="text-link"><ArrowLeft size={16}/>Panel</Link><span className="eyebrow">MI CARTERA</span></div>
    <div className="catalog-head"><div><h1>Mis propiedades</h1><p>Editá datos comerciales y controlá el ciclo de vida de cada publicación.</p></div><Link className="primary" to="/publicar">Nueva propiedad</Link></div>
    {!firebaseConfigured&&<div className="notice warning">Modo demo: los cambios sólo se reflejan localmente.</div>}{error&&<div className="notice error">{error}</div>}{notice&&<div className="notice success"><CheckCircle2 size={17}/>{notice}</div>}
    {loading&&<div className="catalog-empty"><Loader2 className="spin"/>Cargando cartera…</div>}
    {!loading&&<div className="professionals-grid">{rows.map(row=><article className="panel professional-card" key={row.id}><span className="eyebrow">{labels[row.status]}</span><h2>{row.title}</h2><p>{row.neighborhood}, {row.city}</p><strong className="detail-price">{row.currency} {row.price.toLocaleString('es-AR')}</strong><p>{row.acceptsAgencyProposals?'Acepta propuestas profesionales':'Sin propuestas profesionales'}</p><div className="header-actions"><button className="ghost" onClick={()=>edit(row)} disabled={busy===row.id}><SquarePen size={16}/>Editar</button>{row.status==='published'?<button className="ghost" onClick={()=>changeStatus(row,'paused')} disabled={busy===row.id}><PauseCircle size={16}/>Pausar</button>:row.status!=='closed'?<button className="ghost" onClick={()=>changeStatus(row,'published')} disabled={busy===row.id}><PlayCircle size={16}/>Publicar</button>:null}{row.status!=='closed'&&<button className="ghost" onClick={()=>changeStatus(row,'closed')} disabled={busy===row.id}><XCircle size={16}/>Cerrar</button>}{row.status==='published'&&<Link className="text-link" to={`/propiedad/${row.id}`}><Eye size={16}/>Ver aviso</Link>}</div></article>)}</div>}
    {!loading&&rows.length===0&&<div className="catalog-empty">Todavía no publicaste propiedades.</div>}
  </div>
}
