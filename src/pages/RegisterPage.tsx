import { useState } from 'react'
import { Building2, Home, ShieldCheck, UserRound, UsersRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, type SelfAssignableRole } from '../auth/AuthContext'

const roles: { role: SelfAssignableRole; title: string; description: string; icon: typeof Home }[] = [
  { role: 'BUYER', title: 'Busco propiedad', description: 'Guardar favoritos, contactar anunciantes y agendar visitas.', icon: UserRound },
  { role: 'OWNER', title: 'Soy propietario', description: 'Publicar, recibir consultas y comparar propuestas profesionales.', icon: Home },
  { role: 'AGENT', title: 'Soy corredor', description: 'Perfil profesional, captaciones, propuestas y CRM.', icon: UsersRound },
  { role: 'AGENCY', title: 'Soy inmobiliaria', description: 'Equipo, cartera, oportunidades de captación y reputación.', icon: Building2 },
]

export function RegisterPage(){
  const { registerEmail, firebaseConfigured } = useAuth()
  const navigate = useNavigate()
  const [displayName,setDisplayName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [role,setRole]=useState<SelfAssignableRole>('OWNER')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')

  async function submit(){
    setError('')
    if(!displayName.trim()||!email.trim()||password.length<6){
      setError('Completá nombre, email y una contraseña de al menos 6 caracteres.')
      return
    }
    if(!firebaseConfigured){
      navigate('/panel')
      return
    }
    setBusy(true)
    try{
      await registerEmail(email.trim(),password,displayName.trim(),role)
      navigate('/panel',{replace:true})
    }catch(err){
      setError(err instanceof Error?err.message:'No se pudo crear la cuenta.')
    }finally{setBusy(false)}
  }

  return <div className="page-shell auth-page">
    <div className="register-wrap">
      <div className="auth-card panel">
        <Link to="/" className="brand"><div className="brand-mark"><ShieldCheck size={22}/></div><span>PropTrust</span></Link>
        <div><span className="eyebrow">CREAR CUENTA</span><h1>¿Cómo vas a usar PropTrust?</h1><p>Elegí el perfil inicial. Los roles administrativos nunca pueden autoasignarse.</p></div>
        {!firebaseConfigured&&<div className="notice warning">Modo demo activo. Podés recorrer el onboarding sin crear una cuenta real.</div>}
        <div className="role-grid">{roles.map(({role:r,title,description,icon:Icon})=><button key={r} type="button" className={`role-card ${role===r?'selected':''}`} onClick={()=>setRole(r)}><Icon size={20}/><span><b>{title}</b><small>{description}</small></span></button>)}</div>
        <label>Nombre o razón social<input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Tu nombre" /></label>
        <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" /></label>
        <label>Contraseña<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" /></label>
        {error&&<div className="notice error">{error}</div>}
        <button className="primary wide" disabled={busy} onClick={submit}>{busy?'Creando cuenta…':'Crear cuenta'}</button>
        <div className="auth-foot">¿Ya tenés cuenta? <Link className="text-link" to="/ingresar">Ingresar</Link></div>
      </div>
    </div>
  </div>
}
