import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
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

export async function createPropertyWithImages(input: PropertyRecord, files: File[] = []) {
  if (!db) throw new Error('Firebase no está configurado todavía.')
  const id = await createProperty({ ...input, imageUrls: [] })

  if (!files.length) return id
  if (!storage) throw new Error('Firebase Storage no está configurado.')

  const urls: string[] = []
  for (const [index, file] of files.entries()) {
    if (!file.type.startsWith('image/')) continue
    if (file.size > 12 * 1024 * 1024) throw new Error(`La imagen ${file.name} supera 12 MB.`)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const objectRef = storageRef(storage, `properties/${input.ownerId}/${id}/${String(index + 1).padStart(2, '0')}-${safeName}`)
    await uploadBytes(objectRef, file, { contentType: file.type })
    urls.push(await getDownloadURL(objectRef))
  }

  await updateDoc(doc(db, 'properties', id), {
    imageUrls: urls,
    updatedAt: serverTimestamp(),
  })

  return id
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
  return snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() })) as PropertyRecord[]
}

export async function listOwnerProperties(ownerId: string) {
  if (!db) return [] as PropertyRecord[]
  const q = query(collection(db, 'properties'), where('ownerId', '==', ownerId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() })) as PropertyRecord[]
}
