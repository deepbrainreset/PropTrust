import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Home, ImagePlus, Loader2, Save } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { createPropertyWithImages } from '../services/properties'
import type { PropertyOperation, PropertyRecord } from '../types/domain'

const initial = {
  title: '',
  description: '',
  operation: 'sale' as PropertyOperation,
  currency: 'USD' as 'USD' | 'ARS',
  price: '',
  neighborhood: '',
  city: 'CABA',
  address: '',
  rooms: '2',
  bedrooms: '1',
  bathrooms: '1',
  areaM2: '',
  expenses: '',
  propertyType: 'Departamento',
  acceptsAgencyProposals: true,
}

export function PublishPropertyPage() {
  const { user, firebaseConfigured } = useAuth()
  const [form, setForm] = useState(initial)
  const [images, setImages] = useState<File[]>([])
  const [status, setStatus] = useState<'idle'|'saving'|'success'|'error'>('idle')
  const [message, setMessage] = useState('')

  const canSubmit = useMemo(() => Boolean(form.title && form.price && form.neighborhood && form.areaM2), [form])
  const set = (key: keyof typeof initial, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }))

  async function submit(publish: boolean) {
    if (!canSubmit) {
      setStatus('error')
      setMessage('Completá título, precio, barrio y superficie.')
      return
    }

    if (!firebaseConfigured) {
      setStatus('success')
      setMessage(`Demo validada con ${images.length} imagen${images.length===1?'':'es'}. Al conectar Firebase, se guardará en Firestore y Storage.`)
      return
    }

    if (!user) return

    setStatus('saving')
    setMessage('')
    try {
      const record: PropertyRecord = {
        ownerId: user.uid,
        title: form.title.trim(),
        description: form.description.trim(),
        operation: form.operation,
        status: publish ? 'published' : 'draft',
        currency: form.currency,
        price: Number(form.price),
        neighborhood: form.neighborhood.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        rooms: Number(form.rooms),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        areaM2: Number(form.areaM2),
        expenses: form.expenses ? Number(form.expenses) : undefined,
        propertyType: form.propertyType,
        amenities: [],
        acceptsAgencyProposals: form.acceptsAgencyProposals,
        imageUrls: [],
        propertyScore: null,
      }
      const id = await createPropertyWithImages(record, images)
      setStatus('success')
      setMessage(`Propiedad ${publish ? 'publicada' : 'guardada como borrador'} · ID ${id}`)
      setForm(initial)
      setImages([])
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'No se pudo guardar la propiedad.')
    }
  }

  return <div className="page-shell">
    <div className="page-topbar"><Link to="/panel" className="text-link"><ArrowLeft size={16}/>Panel</Link><span className="eyebrow">PUBLICACIÓN</span></div>
    <div className="form-layout">
      <section className="panel form-panel">
        <div className="panel-title"><div className="icon-box"><Home size={20}/></div><div><h1>Publicar propiedad</h1><p>Los datos marcados como privados no deben exponerse en la ficha pública.</p></div></div>

        <div className="form-grid">
          <label className="span-2">Título<input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Ej. Departamento luminoso con balcón" /></label>
          <label>Operación<select value={form.operation} onChange={e=>set('operation',e.target.value as PropertyOperation)}><option value="sale">Venta</option><option value="rent">Alquiler</option><option value="temporary">Temporario</option></select></label>
          <label>Tipo<select value={form.propertyType} onChange={e=>set('propertyType',e.target.value)}><option>Departamento</option><option>PH</option><option>Casa</option><option>Local</option><option>Oficina</option><option>Terreno</option></select></label>
          <label>Moneda<select value={form.currency} onChange={e=>set('currency',e.target.value as 'USD'|'ARS')}><option>USD</option><option>ARS</option></select></label>
          <label>Precio<input type="number" min="0" value={form.price} onChange={e=>set('price',e.target.value)} /></label>
          <label>Barrio<input value={form.neighborhood} onChange={e=>set('neighborhood',e.target.value)} placeholder="Palermo" /></label>
          <label>Ciudad<input value={form.city} onChange={e=>set('city',e.target.value)} /></label>
          <label className="span-2">Dirección exacta <small>Privada hasta que definas cómo mostrarla</small><input value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Av. ..." /></label>
          <label>Ambientes<input type="number" min="1" value={form.rooms} onChange={e=>set('rooms',e.target.value)} /></label>
          <label>Dormitorios<input type="number" min="0" value={form.bedrooms} onChange={e=>set('bedrooms',e.target.value)} /></label>
          <label>Baños<input type="number" min="0" value={form.bathrooms} onChange={e=>set('bathrooms',e.target.value)} /></label>
          <label>Superficie total m²<input type="number" min="1" value={form.areaM2} onChange={e=>set('areaM2',e.target.value)} /></label>
          <label>Expensas<input type="number" min="0" value={form.expenses} onChange={e=>set('expenses',e.target.value)} /></label>
          <label className="span-2">Descripción<textarea rows={7} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Describí la propiedad sin datos de contacto ni afirmaciones no verificables." /></label>
          <label className="span-2 upload-field"><span><ImagePlus size={18}/>Fotos <small>JPG/PNG/WebP · máximo 12 MB por archivo</small></span><input type="file" accept="image/*" multiple onChange={e=>setImages(Array.from(e.target.files||[]).slice(0,20))} />{images.length>0&&<small>{images.length} archivo{images.length===1?'':'s'} seleccionado{images.length===1?'':'s'}</small>}</label>
        </div>

        <label className="check-row"><input type="checkbox" checked={form.acceptsAgencyProposals} onChange={e=>set('acceptsAgencyProposals',e.target.checked)} /><span><b>Quiero recibir propuestas de inmobiliarias y corredores</b><small>Habilita el marketplace inverso para esta propiedad.</small></span></label>

        {message && <div className={`notice ${status === 'error' ? 'error' : 'success'}`}>{status === 'success' && <CheckCircle2 size={17}/>} {message}</div>}

        <div className="form-actions">
          <button className="ghost" disabled={status==='saving'} onClick={()=>submit(false)}><Save size={17}/>Guardar borrador</button>
          <button className="primary" disabled={status==='saving' || !canSubmit} onClick={()=>submit(true)}>{status==='saving'?<Loader2 className="spin" size={17}/>:<CheckCircle2 size={17}/>}Publicar</button>
        </div>
      </section>

      <aside className="panel side-panel">
        <span className="eyebrow">CHECKLIST MVP</span>
        <h3>Antes de publicar</h3>
        <ul className="clean-list"><li>Datos básicos completos</li><li>Precio y moneda claros</li><li>Fotos reales y representativas</li><li>No prometer “verificado” sin evidencia</li></ul>
        <div className="notice">Property Score queda inicialmente en “sin datos suficientes”. El score se calculará sólo cuando existan señales objetivas.</div>
      </aside>
    </div>
  </div>
}
