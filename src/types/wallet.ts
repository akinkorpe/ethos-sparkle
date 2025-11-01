export interface WalletInfo {
  id: string
  address: string
  label: string
  isPrimary: boolean
  balance?: string
  valueUsd?: number
  addedAt: number
}

export type ViewMode = 'individual' | 'combined'
