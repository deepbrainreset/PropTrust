import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, ShieldCheck } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { signInEmail, signInGoogle, firebaseConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/panel'

  async function run(action: () => Promise<void>) {
    setError('')
    setBusy(true)
    try {
      await action()
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="page-shell auth-page">
    <div className="auth-card panel">
      <div className="brand"><div className="brand-mark"><ShieldCheck size={22}/></div><span>PropTrust</span></div>
      <div>
        <span className="eyebrow">ACCESO</span>
        <h1>Ingresá a tu cuenta</h1>
        <p>Administrá publicaciones, consultas, propuestas y reputación desde un único panel.</p>
      </div>

      {!firebaseConfigured && <div className="notice warning">Modo demo activo: faltan las variables de Firebase. La interfaz funciona, pero no habrá autenticación real hasta configurar el proyecto.</div>}

      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="tu@email.com" /></label>
      <label>Contraseña<input value={password} onChange={e=>setPassword(e.target.value)} type="password" /></label>
      {error && <div className="notice error">{error}</div>}
      <button className="primary wide" disabled={busy || !firebaseConfigured} onClick={()=>run(()=>signInEmail(email,password))}><LogIn size={17}/>Ingresar</button>
      <button className="ghost wide" disabled={busy || !firebaseConfigured} onClick={()=>run(signInGoogle)}>Continuar con Google</button>
      <Link className="text-link" to="/">← Volver al inicio</Link>
    </div>
  </div>
}
