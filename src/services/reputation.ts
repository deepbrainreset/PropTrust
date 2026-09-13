import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { ProfessionalReview, VerifiedTransaction } from '../types/domain'

export function calculateTrustScore(input:{verified:boolean;verifiedTransactions:number;reviewCount:number;ratingAverage?:number|null;responseRate?:number|null}){
  if(!input.verified || (input.verifiedTransactions<1 && input.reviewCount<3)) return null
  const transactions=Math.min(input.verifiedTransactions/10,1)*35
  const reviews=input.ratingAverage==null?0:Math.max(0,Math.min(input.ratingAverage/5,1))*40
  const response=input.responseRate==null?0:Math.max(0,Math.min(input.responseRate/100,1))*25
  return Math.round(transactions+reviews+response)
}

export async function createReview(input:Omit<ProfessionalReview,'id'|'createdAt'|'updatedAt'>){
  if(!db) throw new Error('Firebase no está configurado.')
  if(input.rating<1||input.rating>5) throw new Error('La calificación debe estar entre 1 y 5.')
  if(input.comment.trim().length<10) throw new Error('La reseña debe tener al menos 10 caracteres.')
  const ref=await addDoc(collection(db,'reviews'),{...input,comment:input.comment.trim(),createdAt:serverTimestamp(),updatedAt:serverTimestamp()})
  return ref.id
}

export async function listProfessionalReviews(professionalId:string){
  if(!db) return [] as ProfessionalReview[]
  const snapshot=await getDocs(query(collection(db,'reviews'),where('professionalId','==',professionalId),where('status','==','published')))
  return snapshot.docs.map(d=>({id:d.id,...d.data()})) as ProfessionalReview[]
}

export async function listVerifiedTransactions(professionalId:string){
  if(!db) return [] as VerifiedTransaction[]
  const snapshot=await getDocs(query(collection(db,'transactions'),where('professionalId','==',professionalId),where('status','==','verified')))
  return snapshot.docs.map(d=>({id:d.id,...d.data()})) as VerifiedTransaction[]
}
