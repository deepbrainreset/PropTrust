export type BillingPlanId='owner_free'|'agency_basic'|'agency_pro'|'agency_enterprise'

export interface BillingPlan {
  id:BillingPlanId
  name:string
  audience:string
  monthlyPriceLabel:string
  features:string[]
  checkoutUrl?:string
}

const env=import.meta.env

export const billingPlans:BillingPlan[]=[
  {id:'owner_free',name:'Dueño',audience:'Propietarios particulares',monthlyPriceLabel:'Gratis',features:['Publicación de propiedad','Recepción de consultas','Propuestas de inmobiliarias','Property Score preliminar']},
  {id:'agency_basic',name:'Agency Basic',audience:'Corredores e inmobiliarias chicas',monthlyPriceLabel:'Precio de lanzamiento a definir',checkoutUrl:env.VITE_CHECKOUT_AGENCY_BASIC_URL,features:['Perfil profesional','CRM','Oportunidades de captación','Propuestas','Trust Score']},
  {id:'agency_pro',name:'Agency Pro',audience:'Equipos comerciales',monthlyPriceLabel:'Precio de lanzamiento a definir',checkoutUrl:env.VITE_CHECKOUT_AGENCY_PRO_URL,features:['Todo Basic','Mayor capacidad operativa','Analítica','Automatizaciones e IA cuando estén habilitadas']},
  {id:'agency_enterprise',name:'Agency Enterprise',audience:'Redes y grandes inmobiliarias',monthlyPriceLabel:'A medida',checkoutUrl:env.VITE_CHECKOUT_AGENCY_ENTERPRISE_URL,features:['Todo Pro','Usuarios/equipos ampliados','Integraciones','Soporte e implementación']},
]

export function billingConfigured(){ return billingPlans.some(p=>Boolean(p.checkoutUrl)) }
export function getCheckoutUrl(planId:BillingPlanId){ return billingPlans.find(p=>p.id===planId)?.checkoutUrl||null }
