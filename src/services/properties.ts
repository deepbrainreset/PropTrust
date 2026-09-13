import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { PropertyRecord } from '../types/domain'

export async function createProperty(input: PropertyRecord) {
  if (!db) throw new Error('Firebase no está configurado todavía.')

  const ref = await addDoc(collection(db, 'properties'), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return ref.id
}

export async function listPublishedProperties(max = 24) {
  if (!db) return [] as PropertyRecord[]

  const q = query(
    collection(db, 'properties'),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(max),
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as PropertyRecord[]
}
