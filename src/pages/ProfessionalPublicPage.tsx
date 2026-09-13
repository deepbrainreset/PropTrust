import { useEffect, useState } from 'react'
import { ArrowLeft, BadgeCheck, Building2, Loader2, MapPin, ShieldCheck, Star, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { firebaseConfigured } from '../lib/firebase'
import { applySeo } from '../lib/seo'
import { getProfessionalProfile } from '../services/professionals'
import { listProfessionalReviews } from '../services/reputation'
import type { ProfessionalProfile, ProfessionalReview } from '../types/domain'

const demo:ProfessionalProfile={id:'demo-agency',userId:'demo-agency',displayName:'Estudio Norte Demo',professionalType:'AGENCY',bio:'Perfil ficticio para validar la experiencia pública de profesionales.',city:'CABA',neighborhoods:['Palermo','Recoleta'],licenseNumber:'DEMO-001',licenseJurisdiction:'CABA',verificationStatus:'verified',verifiedTransactions:14,reviewCount:12,ratingAverage:4.8,responseRate:94,averageResponseMinutes:42,trustScore:92,yearsExperience:9}
const demoReviews:ProfessionalReview[]=[{id:'demo-review',professionalId:'demo-agency',authorId:'demo-client',authorName:'Cliente demo',transactionId:'demo-tx',rating:5,comment:'Reseña ficticia para mostrar cómo se verá una opinión asociada a una operación verificada.',verifiedTransaction:true,status:'published'}]

export function ProfessionalPublicPage(){
  const { id='' }=useParams()
  const [profile,setProfile]=useState<ProfessionalProfile|null>(firebaseConfigured?null:demo)
  const [reviews,setReviews]=useState<ProfessionalReview[]>(firebaseConfigured?[]:demoReviews)
  const [loading,setLoading]=useState(firebaseConfigured)
  const [error,setError]=useState('')

  useEffect(()=>{ if(!firebaseConfigured)return; Promise.all([getProfessionalProfile(id),listProfessionalReviews(id)]).then(([p,r])=>{ if(!p||p.verificationStatus!=='verified')setError('Este profesional no tiene un perfil público verificado.'); else {setProfile(p);setReviews(r)} }).catch(err=>setError(err instanceof Error?err.message:'No se pudo cargar el perfil.')).finally(()=>setLoading(false)) },[id])
  useEffect(()=>{ if(!profile)return; return applySeo({title:`${profile.displayName} | Profesional verificado en PropTrust`,description:`${profile.professionalType==='AGENCY'?'Inmobiliaria':'Corredor'} verificado en ${profile.city}. Trust Score ${profile.trustScore==null?'sin datos suficientes':`${profile.trustScore}/100`}.`,canonicalPath:`/profesional/${profile.id}`,structuredData:{'@context':'https://schema.org','@type':'RealEstateAgent',name:profile.displayName,description:profile.bio,address:{'@type':'PostalAddress',addressLocality:profile.city,addressCountry:'AR'},aggregateRating:profile.reviewCount>=1&&profile.ratingAverage?{'@type':'AggregateRating',ratingValue:profile.ratingAverage,reviewCount:profile.reviewCount}:undefined}}) },[profile])

  if(loading)return <div className="page-shell"><div className="catalog-empty"><Loader2 className="spin"/>Cargando perfil…</div></div>
  if(!profile)return <div className="page-shell"><div className="panel access-panel"><h1>Perfil no disponible</h1><p>{error||'No encontramos este profesional.'}</p><Link className="primary" to="/profesionales">Ver profesionales</Link></div></div>

  return <div className="page-shell">
    <div className="page-topbar"><Link to="/profesionales" className="text-link"><ArrowLeft size={16}/>Profesionales</Link><span className="verification-chip"><BadgeCheck size={15}/>Verificado</span></div>
    {!firebaseConfigured&&<div className="notice warning">Modo demo: este perfil y sus reseñas son ficticios.</div>}
    <section className="panel dashboard-section"><div className="professional-avatar">{profile.logoUrl?<img src={profile.logoUrl} alt=""/>:profile.professionalType==='AGENCY'?<Building2/>:<UserRound/>}</div><div><span className="eyebrow">{profile.professionalType==='AGENCY'?'INMOBILIARIA':'CORREDOR'}</span><h1>{profile.displayName}</h1><p><MapPin size={15}/> {profile.city}{profile.neighborhoods.length?` · ${profile.neighborhoods.join(', ')}`:''}</p><p>{profile.bio}</p><p><b>Matrícula:</b> {profile.licenseNumber} · {profile.licenseJurisdiction}</p></div><div className="trust-score-public"><ShieldCheck/><div><small>Trust Score</small><strong>{profile.trustScore==null?'—':`${profile.trustScore}/100`}</strong><span>{profile.trustScore==null?'Sin evidencia suficiente':`${profile.verifiedTransactions} operaciones verificadas`}</span></div></div></section>
    <section className="section"><div className="section-head"><div><span className="eyebrow">REPUTACIÓN</span><h2>Reseñas</h2><p>Las reseñas con operación verificada están vinculadas a evidencia transaccional validada por la plataforma.</p></div></div><div className="professionals-grid">{reviews.map(review=><article className="panel professional-card" key={review.id}><div className="professional-card-top"><span><Star size={16}/> {review.rating}/5</span>{review.verifiedTransaction&&<span className="verification-chip"><BadgeCheck size={14}/>Operación verificada</span>}</div><p>{review.comment}</p><small>{review.authorName}</small></article>)}</div>{reviews.length===0&&<div className="catalog-empty">Todavía no hay reseñas publicadas.</div>}</section>
  </div>
}
