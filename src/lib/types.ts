export type Plan = 'free' | 'pro' | 'plus'
export type Role = 'client' | 'superadmin'
export type UserStatus = 'active' | 'blocked'

export interface Profile {
  uid: string
  email: string
  name: string
  photoURL?: string
  role: Role
  plan: Plan
  status: UserStatus
  createdAt: number
}

export type LeadStage = 'viewed' | 'engaged' | 'paid'

export interface Lead {
  id: string
  widgetId: string
  name?: string
  email?: string
  stage: LeadStage
  section?: string
  lastMessage?: string
  value?: number
  createdAt: number
  updatedAt: number
}

export interface BehaviorRule {
  section: string
  thresholdSeconds: number
  message: string
  enabled: boolean
}

export interface WidgetConfig {
  id: string
  ownerUid: string
  businessName: string
  niche: string
  tone: string
  agentName: string
  accentColor: string
  welcomeMessage: string
  paymentLink: string
  googleAdsId?: string
  conversionLabel?: string
  behaviorRules: BehaviorRule[]
  active: boolean
}

export interface DashboardMetrics {
  viewed: number
  engaged: number
  paid: number
  revenue: number
  conversionRate: number
}
