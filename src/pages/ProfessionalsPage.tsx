import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, Loader2, MapPin, Search, ShieldCheck, Star, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { firebaseConfigured } from '../lib/firebase'
import { applySeo } from '../lib/seo'
import { listVerifiedProfessionals } from '../services/professionals'
import type { ProfessionalProfile } from '../types/domain'

const demoProfessionals:ProfessionalProfile[]=[
  {id:'demo-agency',userId:'demo-agency',displayName:'Estudio Norte Demo',professionalType:'AGENCY',bio:'Perfil ficticio para validar el directorio de profesionales.',city:'CABA',neighborhoods:['Palermo','Recoleta'],licenseNumber:'DEMO-001',licenseJurisdiction:'CABA',verificationStatus:'verified',verifiedTransactions:14,reviewCount:12,ratingAverage:4.8,responseRate:94,averageResponseMinutes:42,trustScore:92,yearsExperience:9},
  {id:'demo-agent',userId:'demo-agent',displayName:'Lucía Profesional Demo',professionalType:'AGENT',bio:'Perfil ficticio. Ningún dato corresponde a un profesional real.',city:'CABA',neighborhoods:['Caballito','Villa Crespo'],licenseNumber:'DEMO-002',licenseJurisdiction:'CABA',verificationStatus:'verified',verifiedTransactions:6,reviewCount:8,ratingAverage:4.6,responseRate:88,averageResponseMinutes:75,trustScore:83,yearsExperience:5},
]

export function ProfessionalsPage(){
  const [rows,setRows]=useState<ProfessionalProfile[]>(firebaseConfigured?[]:demoProfessionals)
  const [loading,setLoading]=useState(firebaseConfigured)
  const [error,setError]=useState('')
  const [term,setTerm]=useState('')

  useEffect(()=>applySeo({title:'Inmobiliarias y corredores verificados | PropTrust',description:'Compará inmobiliarias y corredores con matrícula verificada, operaciones verificadas, reseñas y Trust Score.',canonicalPath:'/profesionales',structuredData:{'@context':'https://schema.org','@type':'CollectionPage',name:'Profesionales inmobiliarios verificados | PropTrust'}}),[])
  useEffect(()=>{ if(!firebaseConfigured)return; listVerifiedProfessionals().then(setRows).catch(err=>setError(err instanceof Error?err.message:'No se pudieron cargar profesionales.')).finally(()=>setLoading(false)) },[])
  const filtered=useMemo(()=>rows.filter(p=>`${p.displayName} ${p.city} ${p.neighborhoods.join(' ')}`.toLowerCase().includes(term.trim().toLowerCase())),[rows,term])

  return <div className="page-shell">
    <div className="page-topbar"><Link to="/" className="text-link"><ArrowLeft size={16}/>Inicio</Link><span className="eyebrow">DIRECTORIO</span></div>
    <div className="catalog-head"><div><h1>Profesionales verificados</h1><p>Corredores e inmobiliarias cuya verificación fue aprobada por la plataforma. El Trust Score sólo aparece cuando existe evidencia suficiente.</p></div></div>
    {!firebaseConfigured&&<div className="notice warning">Modo demo: todos los perfiles visibles son ficticios.</div>}{error&&<div className="notice error">{error}</div>}
    <div className="panel professional-filter"><Search size={18}/><input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Nombre, ciudad o barrio"/></div>
    {loading&&<div className="catalog-empty"><Loader2 className="spin"/>Cargando profesionales…</div>}
    {!loading&&<div className="professionals-grid">{filtered.map(p=><article className="panel professional-card" key={p.id}><div className="professional-card-top"><div className="professional-avatar">{p.logoUrl?<img src={p.logoUrl} alt=""/>:p.professionalType==='AGENCY'?<Building2/>:<UserRound/>}</div><div className="verification-chip"><BadgeCheck size={15}/>Verificado</div></div><span className="eyebrow">{p.professionalType==='AGENCY'?'INMOBILIARIA':'CORREDOR'}</span><h2>{p.displayName}</h2><p className="professional-location"><MapPin size={15}/>{p.city}{p.neighborhoods.length?` · ${p.neighborhoods.slice(0,3).join(', ')}`:''}</p><p className="professional-bio">{p.bio}</p><div className="trust-score-public"><ShieldCheck/><div><small>Trust Score</small><strong>{p.trustScore==null?'—':`${p.trustScore}/100`}</strong></div></div><div className="professional-stats"><span><b>{p.verifiedTransactions}</b> operaciones verificadas</span><span><Star size={14}/><b>{p.ratingAverage??'—'}</b> ({p.reviewCount})</span></div><Link className="text-link" to={`/profesional/${p.id}`}>Ver perfil, matrícula y reseñas <ArrowRight size={15}/></Link></article>)}</div>}
    {!loading&&filtered.length===0&&<div className="catalog-empty">No hay profesionales verificados que coincidan con la búsqueda.</div>}
  </div>
}
