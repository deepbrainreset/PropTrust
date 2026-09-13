import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { LeadRecord, LeadStage, VisitRequest } from '../types/domain'

export async function createLead(input: LeadRecord) {
  if (!db) throw new Error('Firebase no está configurado todavía.')
  const ref = await addDoc(collection(db, 'leads'), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function listAssignedLeads(userId: string) {
  if (!db) return [] as LeadRecord[]
  const q = query(collection(db, 'leads'), where('assigneeId', '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as LeadRecord[]
}

export async function updateLeadStage(leadId: string, stage: LeadStage) {
  if (!db) throw new Error('Firebase no está configurado todavía.')
  await updateDoc(doc(db, 'leads', leadId), { stage, updatedAt: serverTimestamp() })
}

export async function createVisitRequest(input: VisitRequest) {
  if (!db) throw new Error('Firebase no está configurado todavía.')
  const ref = await addDoc(collection(db, 'visits'), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function listOwnerVisits(ownerId: string) {
  if (!db) return [] as VisitRequest[]
  const q = query(collection(db, 'visits'), where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as VisitRequest[]
}

export async function updateVisitStatus(visitId: string, status: VisitRequest['status']) {
  if (!db) throw new Error('Firebase no está configurado todavía.')
  await updateDoc(doc(db, 'visits', visitId), { status, updatedAt: serverTimestamp() })
}
