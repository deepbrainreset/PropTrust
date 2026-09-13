import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, updateDoc, where, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { AgencyProposal, PropertyRecord } from '../types/domain'

export async function listOpenOpportunities() {
  if (!db) return [] as PropertyRecord[]
  const q = query(
    collection(db, 'properties'),
    where('status', '==', 'published'),
    where('acceptsAgencyProposals', '==', true),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as PropertyRecord[]
}

export async function submitProposal(input: AgencyProposal) {
  if (!db) throw new Error('Firebase no está configurado todavía.')
  const duplicates = query(
    collection(db, 'proposals'),
    where('propertyId', '==', input.propertyId),
    where('professionalId', '==', input.professionalId),
  )
  const existing = await getDocs(duplicates)
  if (!existing.empty) throw new Error('Ya enviaste una propuesta para esta propiedad.')

  const ref = await addDoc(collection(db, 'proposals'), {
    ...input,
    status: 'sent',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function listProposalsForProperty(propertyId: string) {
  if (!db) return [] as AgencyProposal[]
  const q = query(
    collection(db, 'proposals'),
    where('propertyId', '==', propertyId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as AgencyProposal[]
}

export async function listMyProposals(professionalId: string) {
  if (!db) return [] as AgencyProposal[]
  const q = query(
    collection(db, 'proposals'),
    where('professionalId', '==', professionalId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as AgencyProposal[]
}

export async function setProposalStatus(proposalId: string, status: 'accepted' | 'rejected' | 'withdrawn') {
  if (!db) throw new Error('Firebase no está configurado todavía.')
  await updateDoc(doc(db, 'proposals', proposalId), { status, updatedAt: serverTimestamp() })
}
