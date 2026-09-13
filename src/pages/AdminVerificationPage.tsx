import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BadgeCheck, Check, Loader2, MapPin, ShieldAlert, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { listPendingProfessionalVerifications, reviewProfessionalVerification } from '../services/admin'
import type { ProfessionalProfile } from '../types/domain'

const demoPending: ProfessionalProfile[] = [
  {
    id:'demo-pending', userId:'demo-pending', displayName:'Inmobiliaria Demo Pendiente', professionalType:'AGENCY',
    bio:'Solicitud ficticia para validar el flujo administrativo.', city:'CABA', neighborhoods:['Palermo'],
    licenseNumber:'DEMO-PENDING', licenseJurisdiction:'CABA', verificationStatus:'pending', verifiedTransactions:0,
    reviewCount:0, ratingAverage:null, responseRate:null, averageResponseMinutes:null, trustScore:null,
  }
]

export function AdminVerificationPage(){
  const {user,profile,firebaseConfigured}=useAuth()
  const [rows,setRows]=useState<ProfessionalProfile[]>(firebaseConfigured?[]:demoPending)
  const [loading,setLoading]=useState(firebaseConfigured)
  const [error,setError]=useState('')
  const [message,setMessage]=useState('')
  const [busy,setBusy]=useState('')

  const allowed=useMemo(()=>!firebaseConfigured||profile?.role==='ADMIN'||profile?.role==='SUPER_ADMIN',[firebaseConfigured,profile])

  useEffect(()=>{
    if(!firebaseConfigured||!allowed)return
    listPendingProfessionalVerifications().then(setRows).catch(err=>setError(err instanceof Error?err.message:'No se pudieron cargar solicitudes.')).finally(()=>setLoading(false))
  },[firebaseConfigured,allowed])

  async function review(id:string,status:'verified'|'rejected'){
    if(!firebaseConfigured){
      setRows(prev=>prev.filter(p=>p.id!==id))
      setMessage(status==='verified'?'Solicitud demo aprobada.':'Solicitud demo rechazada.')
      return
    }
    if(!user)return
    setBusy(id);setError('');setMessage('')
    try{
      await reviewProfessionalVerification(id,user.uid,status)
      setRows(prev=>prev.filter(p=>p.id!==id))
      setMessage(status==='verified'?'Profesional marcado como verificado.':'Solicitud rechazada.')
    }catch(err){setError(err instanceof Error?err.message:'No se pudo revisar la solicitud.')}finally{setBusy('')}
  }

  if(!allowed)return <div className="page-shell"><div className="panel access-panel"><ShieldAlert/><h1>Acceso administrativo</h1><p>Esta sección requiere rol ADMIN o SUPER_ADMIN.</p><Link className="primary" to="/panel">Volver al panel</Link></div></div>

  return <div className="page-shell">
    <div className="page-topbar"><Link to="/panel" className="text-link"><ArrowLeft size={16}/>Panel</Link><span className="eyebrow">ADMIN</span></div>
    <div className="catalog-head"><div><h1>Verificación profesional</h1><p>Revisá matrícula y jurisdicción antes de aprobar. PropTrust no interpreta una declaración como evidencia.</p></div></div>
    {!firebaseConfigured&&<div className="notice warning">Modo demo: esta solicitud es ficticia. En producción la aprobación debe ocurrir sólo después de comprobar la matrícula en una fuente oficial.</div>}
    {error&&<div className="notice error">{error}</div>}
    {message&&<div className="notice success"><BadgeCheck size={17}/>{message}</div>}
    {loading&&<div className="catalog-empty"><Loader2 className="spin"/>Cargando solicitudes…</div>}

    {!loading&&rows.length===0&&<div className="catalog-empty">No hay verificaciones pendientes.</div>}
    <div className="verification-admin-grid">{rows.map(p=><article className="panel admin-verification-card" key={p.id}><div className="verification-card-head"><div><span className="eyebrow">{p.professionalType==='AGENCY'?'INMOBILIARIA':'CORREDOR'}</span><h2>{p.displayName}</h2></div><span className="status-pill">Pendiente</span></div><p className="professional-location"><MapPin size={15}/>{p.city} · {p.neighborhoods.join(', ')||'Sin zonas declaradas'}</p><div className="verification-data"><div><small>Matrícula declarada</small><strong>{p.licenseNumber||'No informada'}</strong></div><div><small>Jurisdicción</small><strong>{p.licenseJurisdiction||'No informada'}</strong></div></div><p>{p.bio||'Sin descripción profesional.'}</p><div className="notice">Antes de aprobar, corroborar número, titular y jurisdicción en el registro profesional oficial correspondiente.</div><div className="proposal-actions"><button className="ghost danger" disabled={busy===p.id} onClick={()=>review(p.id,'rejected')}><X size={16}/>Rechazar</button><button className="primary" disabled={busy===p.id||!p.licenseNumber||!p.licenseJurisdiction} onClick={()=>review(p.id,'verified')}><Check size={16}/>Aprobar verificación</button></div></article>)}</div>
  </div>
}
