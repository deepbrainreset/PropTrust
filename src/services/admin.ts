import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { ProfessionalProfile, VerificationStatus } from '../types/domain'

export async function listPendingProfessionalVerifications() {
  if (!db) return [] as ProfessionalProfile[]
  const q = query(collection(db, 'professionals'), where('verificationStatus', '==', 'pending'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as ProfessionalProfile[]
}

export async function reviewProfessionalVerification(
  professionalId: string,
  reviewerId: string,
  status: Extract<VerificationStatus, 'verified' | 'rejected'>,
) {
  if (!db) throw new Error('Firebase no está configurado todavía.')
  await updateDoc(doc(db, 'professionals', professionalId), {
    verificationStatus: status,
    verifiedAt: status === 'verified' ? serverTimestamp() : null,
    verifiedBy: reviewerId,
    updatedAt: serverTimestamp(),
  })
}
