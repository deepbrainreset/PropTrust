import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Bath, BedDouble, Loader2, MapPin, Ruler, Search, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { firebaseConfigured } from '../lib/firebase'
import { listPublishedProperties } from '../services/properties'
import type { PropertyRecord } from '../types/domain'

const demo: PropertyRecord[] = [
  { id:'demo-1', ownerId:'demo', title:'Departamento luminoso con balcón', description:'Publicación de demostración.', operation:'sale', status:'published', currency:'USD', price:128000, neighborhood:'Palermo', city:'CABA', rooms:3, bedrooms:2, bathrooms:1, areaM2:62, propertyType:'Departamento', amenities:[], acceptsAgencyProposals:true, imageUrls:['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'], propertyScore:null },
  { id:'demo-2', ownerId:'demo', title:'PH reciclado con patio', description:'Publicación de demostración.', operation:'sale', status:'published', currency:'USD', price:149000, neighborhood:'Villa Crespo', city:'CABA', rooms:4, bedrooms:3, bathrooms:2, areaM2:88, propertyType:'PH', amenities:[], acceptsAgencyProposals:true, imageUrls:['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'], propertyScore:null },
]

export function PropertiesPage(){
  const [properties,setProperties]=useState<PropertyRecord[]>(firebaseConfigured?[]:demo)
  const [loading,setLoading]=useState(firebaseConfigured)
  const [query,setQuery]=useState('')
  const [operation,setOperation]=useState<'all'|'sale'|'rent'|'temporary'>('all')
  const [error,setError]=useState('')

  useEffect(()=>{
    if(!firebaseConfigured) return
    listPublishedProperties().then(setProperties).catch(err=>setError(err instanceof Error?err.message:'No se pudieron cargar las propiedades.')).finally(()=>setLoading(false))
  },[])

  const filtered=useMemo(()=>properties.filter(p=>{
    const q=query.trim().toLowerCase()
    const matchText=!q || `${p.title} ${p.neighborhood} ${p.city} ${p.propertyType}`.toLowerCase().includes(q)
    const matchOperation=operation==='all'||p.operation===operation
    return matchText&&matchOperation
  }),[properties,query,operation])

  return <div className="page-shell">
    <div className="page-topbar"><Link to="/" className="text-link"><ArrowLeft size={16}/>Inicio</Link><span className="eyebrow">PROPIEDADES</span></div>
    <div className="catalog-head"><div><h1>Explorá propiedades</h1><p>Publicaciones activas. Los datos demo están identificados y nunca se presentan como operaciones reales.</p></div><Link to="/publicar" className="primary">Publicar gratis</Link></div>

    <div className="panel catalog-filters"><div className="filter-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Barrio, ciudad, tipo o título" /></div><select value={operation} onChange={e=>setOperation(e.target.value as typeof operation)}><option value="all">Todas las operaciones</option><option value="sale">Venta</option><option value="rent">Alquiler</option><option value="temporary">Temporario</option></select></div>

    {!firebaseConfigured&&<div className="notice warning">Modo demo: conectando Firebase, esta pantalla leerá exclusivamente publicaciones con estado <b>published</b>.</div>}
    {error&&<div className="notice error">{error}</div>}
    {loading&&<div className="catalog-empty"><Loader2 className="spin"/>Cargando propiedades…</div>}

    {!loading&&<div className="catalog-grid">{filtered.map(p=><article className="property-card" key={p.id}><div className="property-image" style={{backgroundImage:`url(${p.imageUrls[0]||'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'})`}}>{String(p.id).startsWith('demo')&&<span className="demo-badge">Demo</span>}<span className="score-badge">{p.propertyScore==null?'Score pendiente':`Score ${p.propertyScore}/100`}</span></div><div className="property-body"><div className="eyebrow">{p.operation==='sale'?'VENTA':p.operation==='rent'?'ALQUILER':'TEMPORARIO'}</div><h3>{p.title}</h3><div className="location"><MapPin size={15}/>{p.neighborhood}, {p.city}</div><strong className="price">{p.currency} {p.price.toLocaleString('es-AR')}</strong><div className="facts"><span><BedDouble size={16}/>{p.rooms} amb.</span><span><Bath size={16}/>{p.bathrooms}</span><span><Ruler size={16}/>{p.areaM2} m²</span></div><div className="card-meta"><ShieldCheck size={15}/>{p.acceptsAgencyProposals?'Acepta propuestas profesionales':'Dueño directo'}</div></div></article>)}</div>}
    {!loading&&filtered.length===0&&<div className="catalog-empty">No encontramos propiedades con esos filtros.</div>}
  </div>
}
