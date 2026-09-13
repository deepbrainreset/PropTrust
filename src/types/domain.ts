export type UserRole = 'BUYER' | 'OWNER' | 'AGENT' | 'AGENCY' | 'ADMIN' | 'SUPER_ADMIN'

export type PropertyStatus = 'draft' | 'published' | 'paused' | 'reserved' | 'closed'
export type PropertyOperation = 'sale' | 'rent' | 'temporary'
export type LeadStage = 'new' | 'contacted' | 'visit' | 'negotiation' | 'reservation' | 'closed' | 'lost'

export interface UserProfile {
  id: string
  email: string
  displayName: string
  role: UserRole
  photoURL?: string
  createdAt?: unknown
}

export interface PropertyRecord {
  id?: string
  ownerId: string
  title: string
  description: string
  operation: PropertyOperation
  status: PropertyStatus
  currency: 'USD' | 'ARS'
  price: number
  neighborhood: string
  city: string
  address?: string
  rooms: number
  bedrooms: number
  bathrooms: number
  areaM2: number
  expenses?: number
  propertyType: string
  amenities: string[]
  acceptsAgencyProposals: boolean
  imageUrls: string[]
  propertyScore?: number | null
  createdAt?: unknown
  updatedAt?: unknown
}

export interface AgencyProposal {
  id?: string
  propertyId: string
  professionalId: string
  professionalName?: string
  professionalRole?: 'AGENT' | 'AGENCY'
  valuationMin: number
  valuationMax: number
  commissionPct: number
  estimatedDays: number
  strategy: string
  services: string[]
  status: 'sent' | 'accepted' | 'rejected' | 'withdrawn'
  createdAt?: unknown
  updatedAt?: unknown
}

export interface LeadRecord {
  id?: string
  propertyId: string
  propertyTitle: string
  ownerId: string
  requesterId: string
  requesterName: string
  requesterEmail: string
  assigneeId: string
  message: string
  stage: LeadStage
  source: 'property_contact' | 'visit_request' | 'manual'
  createdAt?: unknown
  updatedAt?: unknown
}

export interface VisitRequest {
  id?: string
  propertyId: string
  propertyTitle: string
  ownerId: string
  requesterId: string
  requesterName: string
  requesterEmail: string
  requestedDate: string
  requestedTime: string
  notes?: string
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled'
  createdAt?: unknown
  updatedAt?: unknown
}
