import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, firebaseConfigured, googleProvider } from '../lib/firebase'
import type { UserProfile, UserRole } from '../types/domain'

type AuthContextValue = {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  firebaseConfigured: boolean
  signInEmail: (email: string, password: string) => Promise<void>
  signInGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function ensureProfile(user: User): Promise<UserProfile | null> {
  if (!db) return null
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return { id: snap.id, ...snap.data() } as UserProfile

  const profile: UserProfile = {
    id: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Usuario',
    role: 'BUYER' as UserRole,
    photoURL: user.photoURL ?? undefined,
  }
  await setDoc(ref, { ...profile, createdAt: serverTimestamp() })
  return profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(firebaseConfigured)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      setProfile(nextUser ? await ensureProfile(nextUser) : null)
      setLoading(false)
    })
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    loading,
    firebaseConfigured,
    signInEmail: async (email, password) => {
      if (!auth) throw new Error('Firebase no está configurado todavía.')
      await signInWithEmailAndPassword(auth, email, password)
    },
    signInGoogle: async () => {
      if (!auth || !googleProvider) throw new Error('Firebase no está configurado todavía.')
      await signInWithPopup(auth, googleProvider)
    },
    logout: async () => {
      if (auth) await signOut(auth)
    },
  }), [user, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return value
}
