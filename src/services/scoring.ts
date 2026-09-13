import type { PropertyRecord } from '../types/domain'

export interface PropertyScoreBreakdown {
  total:number
  completeness:number
  media:number
  pricing:number
  transparency:number
  freshness:number
  notes:string[]
  algorithmVersion:string
}

function clamp(n:number,min=0,max=100){ return Math.max(min,Math.min(max,n)) }

export function calculatePropertyScore(property:PropertyRecord, options?:{daysActive?:number;marketDeviationPct?:number|null;ownerVerified?:boolean;expensesVerified?:boolean}):PropertyScoreBreakdown {
  const notes:string[]=[]
  let completeness=0
  const required=[property.title,property.description,property.neighborhood,property.city,property.propertyType]
  completeness += required.filter(Boolean).length/required.length*45
  completeness += property.rooms>0?10:0
  completeness += property.areaM2>0?15:0
  completeness += property.bathrooms>0?10:0
  completeness += property.price>0?10:0
  completeness += property.amenities.length>0?10:0
  completeness=clamp(completeness)
  if(completeness<70) notes.push('Faltan datos relevantes de la publicación.')

  const imageCount=property.imageUrls.length
  const media=clamp(imageCount>=12?100:imageCount>=8?85:imageCount>=5?70:imageCount>=3?50:imageCount>0?25:0)
  if(media<70) notes.push('Más fotos mejorarían la evidencia visual de la publicación.')

  let pricing=50
  if(options?.marketDeviationPct!=null){
    const deviation=Math.abs(options.marketDeviationPct)
    pricing=deviation<=5?100:deviation<=10?85:deviation<=20?65:deviation<=30?40:20
    if(deviation>20) notes.push('El precio se aleja del rango de referencia disponible.')
  } else notes.push('Aún no hay suficiente evidencia de mercado para evaluar competitividad de precio.')

  let transparency=20
  if(options?.ownerVerified) transparency+=45
  if(property.expenses!=null) transparency+=15
  if(options?.expensesVerified) transparency+=20
  transparency=clamp(transparency)
  if(!options?.ownerVerified) notes.push('La identidad del anunciante todavía no está verificada.')

  const days=options?.daysActive
  const freshness=days==null?60:days<=7?100:days<=30?90:days<=60?75:days<=120?55:35
  if(days!=null&&days>120) notes.push('La publicación lleva más de 120 días activa.')

  const total=Math.round(completeness*.3+media*.2+pricing*.2+transparency*.2+freshness*.1)
  return {total,completeness:Math.round(completeness),media,pricing,transparency,freshness,notes,algorithmVersion:'property-score-v1'}
}
