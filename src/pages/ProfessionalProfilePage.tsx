import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BadgeCheck, Building2, CheckCircle2, Loader2, Save, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getProfessionalProfile, requestProfessionalVerification, saveProfessionalProfile } from '../services/professionals'
import type { ProfessionalProfile } from '../types/domain'

const emptyForm={
  displayName:'',bio:'',city:'CABA',neighborhoods:'',licenseNumber:'',licenseJurisdiction:'CABA',publicEmail:'',publicPhone:'',website:'',logoUrl:'',yearsExperience:''
}

export function ProfessionalProfilePage(){
  const {user,profile,firebaseConfigured}=useAuth()
  const [professional,setProfessional]=useState<ProfessionalProfile|null>(null)
  const [form,setForm]=useState(emptyForm)
  const [loading,setLoading]=useState(firebaseConfigured)
  const [busy,setBusy]=useState<'save'|'verify'|''>('')
  const [message,setMessage]=useState('')
  const [error,setError]=useState('')

  const allowed=useMemo(()=>!firebaseConfigured||profile?.role==='AGENT'||profile?.role==='AGENCY'||profile?.role==='ADMIN'||profile?.role==='SUPER_ADMIN',[firebaseConfigured,profile])
  const professionalType: 'AGENT'|'AGENCY' = profile?.role==='AGENCY'?'AGENCY':'AGENT'

  useEffect(()=>{
    if(!firebaseConfigured||!user||!allowed){setLoading(false);return}
    getProfessionalProfile(user.uid).then(p=>{
      setProfessional(p)
      setForm({
        displayName:p?.displayName||profile?.displayName||'',
        bio:p?.bio||'',city:p?.city||'CABA',neighborhoods:p?.neighborhoods?.join(', ')||'',
        licenseNumber:p?.licenseNumber||'',licenseJurisdiction:p?.licenseJurisdiction||'CABA',
        publicEmail:p?.publicEmail||'',publicPhone:p?.publicPhone||'',website:p?.website||'',logoUrl:p?.logoUrl||'',
        yearsExperience:p?.yearsExperience!=null?String(p.yearsExperience):''
      })
    }).catch(err=>setError(err instanceof Error?err.message:'No se pudo cargar el perfil.')).finally(()=>setLoading(false))
  },[firebaseConfigured,user,allowed,profile?.displayName])

  function patch(key:keyof typeof emptyForm,value:string){setForm(prev=>({...prev,[key]:value}))}

  async function save(){
    if(!form.displayName.trim()||!form.city.trim()){setError('Completá nombre y ciudad.');return}
    if(!firebaseConfigured){setMessage('Perfil demo validado. Con Firebase activo se guardará en Firestore.');return}
    if(!user)return
    setBusy('save');setError('');setMessage('')
    try{
      await saveProfessionalProfile(user.uid,{
        displayName:form.displayName.trim(),professionalType,bio:form.bio.trim(),city:form.city.trim(),
        neighborhoods:form.neighborhoods.split(',').map(x=>x.trim()).filter(Boolean),
        licenseNumber:form.licenseNumber.trim()||undefined,licenseJurisdiction:form.licenseJurisdiction.trim()||undefined,
        publicEmail:form.publicEmail.trim()||undefined,publicPhone:form.publicPhone.trim()||undefined,
        website:form.website.trim()||undefined,logoUrl:form.logoUrl.trim()||undefined,
        yearsExperience:form.yearsExperience?Number(form.yearsExperience):undefined,
      })
      const updated=await getProfessionalProfile(user.uid)
      setProfessional(updated)
      setMessage('Perfil profesional guardado.')
    }catch(err){setError(err instanceof Error?err.message:'No se pudo guardar el perfil.')}finally{setBusy('')}
  }

  async function requestVerification(){
    if(!firebaseConfigured){setMessage('Solicitud demo validada. La verificación real requiere revisión administrativa.');return}
    if(!user)return
    setBusy('verify');setError('');setMessage('')
    try{
      await requestProfessionalVerification(user.uid)
      const updated=await getProfessionalProfile(user.uid)
      setProfessional(updated)
      setMessage('Solicitud enviada. El perfil seguirá como pendiente hasta una revisión real.')
    }catch(err){setError(err instanceof Error?err.message:'No se pudo solicitar verificación.')}finally{setBusy('')}
  }

  if(!allowed)return <div className="page-shell"><div className="panel access-panel"><h1>Perfil profesional</h1><p>Disponible para corredores e inmobiliarias.</p><Link className="primary" to="/panel">Volver al panel</Link></div></div>

  const verification=professional?.verificationStatus||'unverified'
  const score=professional?.trustScore??null

  return <div className="page-shell">
    <div className="page-topbar"><Link to="/panel" className="text-link"><ArrowLeft size={16}/>Panel</Link><span className="eyebrow">PERFIL PROFESIONAL</span></div>
    <div className="professional-edit-grid">
      <section className="panel form-panel">
        <div className="panel-title"><div className="icon-box">{professionalType==='AGENCY'?<Building2/>:<UserRound/>}</div><div><h1>{professionalType==='AGENCY'?'Perfil de inmobiliaria':'Perfil de corredor'}</h1><p>Los campos públicos podrán mostrarse en el directorio. La verificación siempre requiere revisión externa.</p></div></div>
        {!firebaseConfigured&&<div className="notice warning">Modo demo: no se guarda información real.</div>}
        {error&&<div className="notice error">{error}</div>}
        {message&&<div className="notice success"><CheckCircle2 size={17}/>{message}</div>}
        {loading?<div className="catalog-empty"><Loader2 className="spin"/>Cargando perfil…</div>:<div className="form-grid">
          <label className="span-2">Nombre público<input value={form.displayName} onChange={e=>patch('displayName',e.target.value)}/></label>
          <label>Ciudad<input value={form.city} onChange={e=>patch('city',e.target.value)}/></label>
          <label>Años de experiencia<input type="number" min="0" value={form.yearsExperience} onChange={e=>patch('yearsExperience',e.target.value)}/></label>
          <label className="span-2">Barrios / zonas <small>Separados por coma</small><input value={form.neighborhoods} onChange={e=>patch('neighborhoods',e.target.value)} placeholder="Palermo, Recoleta, Caballito"/></label>
          <label>Matrícula<input value={form.licenseNumber} onChange={e=>patch('licenseNumber',e.target.value)} placeholder="Número declarado"/></label>
          <label>Jurisdicción<input value={form.licenseJurisdiction} onChange={e=>patch('licenseJurisdiction',e.target.value)} /></label>
          <label>Email público<input type="email" value={form.publicEmail} onChange={e=>patch('publicEmail',e.target.value)}/></label>
          <label>Teléfono público<input value={form.publicPhone} onChange={e=>patch('publicPhone',e.target.value)}/></label>
          <label className="span-2">Sitio web<input value={form.website} onChange={e=>patch('website',e.target.value)} placeholder="https://..."/></label>
          <label className="span-2">Logo / foto URL<input value={form.logoUrl} onChange={e=>patch('logoUrl',e.target.value)} placeholder="https://..."/></label>
          <label className="span-2">Bio<textarea rows={6} value={form.bio} onChange={e=>patch('bio',e.target.value)} placeholder="Experiencia, enfoque, zonas y tipo de operaciones."/></label>
        </div>}
        <div className="form-actions"><button className="primary" disabled={busy==='save'||loading} onClick={save}>{busy==='save'?<Loader2 className="spin" size={17}/>:<Save size={17}/>}Guardar perfil</button></div>
      </section>

      <aside className="panel trust-panel">
        <div className="trust-status-icon"><ShieldCheck/></div><span className="eyebrow">TRUST PROFILE</span><h2>{score==null?'Sin datos suficientes':`${score}/100`}</h2><p>El score no se activa sólo por completar un perfil. Requiere verificación y evidencia reputacional mínima.</p>
        <div className={`verification-state verification-${verification}`}><BadgeCheck size={18}/><span><b>{verification==='verified'?'Verificado':verification==='pending'?'Verificación pendiente':verification==='rejected'?'Verificación rechazada':'No verificado'}</b><small>{verification==='verified'?'Matrícula revisada.':verification==='pending'?'La matrícula todavía no fue aprobada.':'Ingresá matrícula y jurisdicción para pedir revisión.'}</small></span></div>
        <dl className="trust-breakdown"><div><dt>Operaciones verificadas</dt><dd>{professional?.verifiedTransactions??0}</dd></div><div><dt>Reseñas</dt><dd>{professional?.reviewCount??0}</dd></div><div><dt>Rating</dt><dd>{professional?.ratingAverage??'—'}</dd></div><div><dt>Tasa de respuesta</dt><dd>{professional?.responseRate!=null?`${professional.responseRate}%`:'—'}</dd></div></dl>
        {verification!=='verified'&&<button className="ghost wide" disabled={busy==='verify'||loading} onClick={requestVerification}>{busy==='verify'?<Loader2 className="spin" size={17}/>:<BadgeCheck size={17}/>}Solicitar revisión de matrícula</button>}
        <div className="notice">Declarar una matrícula no equivale a verificarla. La insignia “Verificado” sólo puede asignarse mediante un proceso administrativo controlado.</div>
      </aside>
    </div>
  </div>
}
