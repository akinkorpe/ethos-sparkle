import { useState, useEffect } from 'react'
import { WalletInfo, ViewMode } from '@/types/wallet'

const STORAGE_KEY = 'portfolio_wallets'
const VIEW_MODE_KEY = 'portfolio_view_mode'

export function useWalletManager() {
  const [wallets, setWallets] = useState<WalletInfo[]>([])
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('combined')

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const storedViewMode = localStorage.getItem(VIEW_MODE_KEY)
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setWallets(parsed)
        if (parsed.length > 0) {
          const primary = parsed.find((w: WalletInfo) => w.isPrimary)
          setSelectedWalletId(primary?.id || parsed[0].id)
        }
      } catch (error) {
        console.error('Error loading wallets:', error)
      }
    }
    
    if (storedViewMode) {
      setViewMode(storedViewMode as ViewMode)
    }
  }, [])

  // Save to localStorage whenever wallets change
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets))
    }
  }, [wallets])

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode)
  }, [viewMode])

  const addWallet = (address: string, label?: string) => {
    const id = `wallet_${Date.now()}`
    const newWallet: WalletInfo = {
      id,
      address,
      label: label || `Wallet ${wallets.length + 1}`,
      isPrimary: wallets.length === 0,
      addedAt: Date.now()
    }
    
    setWallets(prev => [...prev, newWallet])
    setSelectedWalletId(id)
    return newWallet
  }

  const removeWallet = (id: string) => {
    setWallets(prev => {
      const updated = prev.filter(w => w.id !== id)
      
      // If removing the primary wallet, make the first remaining wallet primary
      if (updated.length > 0) {
        const removedWallet = prev.find(w => w.id === id)
        if (removedWallet?.isPrimary) {
          updated[0].isPrimary = true
        }
      }
      
      return updated
    })
    
    if (selectedWalletId === id && wallets.length > 1) {
      const remaining = wallets.filter(w => w.id !== id)
      setSelectedWalletId(remaining[0]?.id || null)
    }
  }

  const updateWallet = (id: string, updates: Partial<WalletInfo>) => {
    setWallets(prev => prev.map(w => {
      if (w.id === id) {
        // If setting as primary, remove primary from others
        if (updates.isPrimary) {
          return { ...w, ...updates }
        }
        return { ...w, ...updates }
      }
      // Remove primary from others if a new wallet is being set as primary
      if (updates.isPrimary) {
        return { ...w, isPrimary: false }
      }
      return w
    }))
  }

  const setPrimaryWallet = (id: string) => {
    setWallets(prev => prev.map(w => ({
      ...w,
      isPrimary: w.id === id
    })))
  }

  const getWallet = (id: string) => {
    return wallets.find(w => w.id === id)
  }

  const getPrimaryWallet = () => {
    return wallets.find(w => w.isPrimary) || wallets[0]
  }

  const getSelectedWallet = () => {
    return selectedWalletId ? getWallet(selectedWalletId) : null
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'combined' ? 'individual' : 'combined')
  }

  return {
    wallets,
    selectedWalletId,
    viewMode,
    addWallet,
    removeWallet,
    updateWallet,
    setPrimaryWallet,
    setSelectedWalletId,
    setViewMode,
    toggleViewMode,
    getWallet,
    getPrimaryWallet,
    getSelectedWallet
  }
}
