export interface SeoInput {
  title:string
  description:string
  canonicalPath?:string
  type?:'website'|'article'
  structuredData?:Record<string,unknown>|Record<string,unknown>[]
}

function upsertMeta(selector:string,attrs:Record<string,string>){
  let el=document.head.querySelector(selector) as HTMLMetaElement|null
  if(!el){ el=document.createElement('meta'); document.head.appendChild(el) }
  Object.entries(attrs).forEach(([k,v])=>el!.setAttribute(k,v))
}

export function applySeo(input:SeoInput){
  if(typeof document==='undefined') return ()=>{}
  document.title=input.title
  upsertMeta('meta[name="description"]',{name:'description',content:input.description})
  upsertMeta('meta[property="og:title"]',{property:'og:title',content:input.title})
  upsertMeta('meta[property="og:description"]',{property:'og:description',content:input.description})
  upsertMeta('meta[property="og:type"]',{property:'og:type',content:input.type||'website'})
  upsertMeta('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'})
  const base='https://proptrust.com.ar'
  const canonical=base+(input.canonicalPath||'/')
  let link=document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement|null
  if(!link){ link=document.createElement('link'); link.rel='canonical'; document.head.appendChild(link) }
  link.href=canonical
  upsertMeta('meta[property="og:url"]',{property:'og:url',content:canonical})
  document.getElementById('page-structured-data')?.remove()
  if(input.structuredData){ const script=document.createElement('script'); script.id='page-structured-data'; script.type='application/ld+json'; script.text=JSON.stringify(input.structuredData); document.head.appendChild(script) }
  return ()=>{ document.getElementById('page-structured-data')?.remove() }
}
