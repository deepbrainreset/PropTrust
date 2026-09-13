import { collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { ProfessionalProfile } from '../types/domain'

export type ProfessionalEditableInput = Pick<ProfessionalProfile,
  'displayName' | 'professionalType' | 'bio' | 'city' | 'neighborhoods' |
  'licenseNumber' | 'licenseJurisdiction' | 'publicEmail' | 'publicPhone' |
  'website' | 'logoUrl' | 'yearsExperience'
>

export function calculateTrustScore(profile: ProfessionalProfile): number | null {
  const hasEnoughEvidence = profile.verificationStatus === 'verified'
    && (profile.verifiedTransactions >= 1 || profile.reviewCount >= 3)

  if (!hasEnoughEvidence) return null

  let score = 35
  if (profile.verificationStatus === 'verified') score += 20
  score += Math.min(profile.verifiedTransactions * 4, 20)

  if (profile.reviewCount >= 3 && profile.ratingAverage != null) {
    score += Math.round(Math.max(0, Math.min(5, profile.ratingAverage)) / 5 * 15)
  }

  if (profile.responseRate != null) {
    score += Math.round(Math.max(0, Math.min(100, profile.responseRate)) / 100 * 7)
  }

  if (profile.averageResponseMinutes != null && profile.averageResponseMinutes <= 120) score += 3

  return Math.min(100, score)
}

export async function getProfessionalProfile(userId: string) {
  if (!db) return null
  const snap = await getDoc(doc(db, 'professionals', userId))
  if (!snap.exists()) return null
  const profile = { id: snap.id, ...snap.data() } as ProfessionalProfile
  return { ...profile, trustScore: calculateTrustScore(profile) }
}

export async function saveProfessionalProfile(userId: string, input: ProfessionalEditableInput) {
  if (!db) throw new Error('Firebase no está configurado todavía.')
  const ref = doc(db, 'professionals', userId)
  const existing = await getDoc(ref)

  if (existing.exists()) {
    await setDoc(ref, { ...input, updatedAt: serverTimestamp() }, { merge: true })
  } else {
    await setDoc(ref, {
      ...input,
      userId,
      verificationStatus: 'unverified',
      verifiedTransactions: 0,
      reviewCount: 0,
      ratingAverage: null,
      responseRate: null,
      averageResponseMinutes: null,
      trustScore: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

export async function requestProfessionalVerification(userId: string) {
  if (!db) throw new Error('Firebase no está configurado todavía.')
  const ref = doc(db, 'professionals', userId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Completá el perfil profesional primero.')
  const data = snap.data() as ProfessionalProfile
  if (!data.licenseNumber || !data.licenseJurisdiction) throw new Error('Ingresá matrícula y jurisdicción antes de solicitar revisión.')
  if (data.verificationStatus === 'verified') return

  await setDoc(ref, {
    verificationStatus: 'pending',
    verificationRequestedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export async function listVerifiedProfessionals(max = 24) {
  if (!db) return [] as ProfessionalProfile[]
  const q = query(collection(db, 'professionals'), where('verificationStatus', '==', 'verified'), limit(max))
  const snap = await getDocs(q)
  return snap.docs.map(d => {
    const profile = { id: d.id, ...d.data() } as ProfessionalProfile
    return { ...profile, trustScore: calculateTrustScore(profile) }
  })
}
