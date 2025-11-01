import { WalletConnect } from '@/components/WalletConnect'
import { PortfolioDashboard } from '@/components/PortfolioDashboard'
import { MultiWalletManager } from '@/components/MultiWalletManager'
import { ViewModeSwitcher } from '@/components/ViewModeSwitcher'
import { useWalletManager } from '@/hooks/useWalletManager'
import { useAccount } from 'wagmi'
import heroImage from '@/assets/hero-crypto.jpg'
import { TrendingUp } from 'lucide-react'

const Index = () => {
  const { address, isConnected } = useAccount()
  const walletManager = useWalletManager()

  const handleWalletConnected = (connectedAddress: string) => {
    // Check if this wallet is already added
    const exists = walletManager.wallets.find(
      w => w.address.toLowerCase() === connectedAddress.toLowerCase()
    )
    
    if (!exists) {
      walletManager.addWallet(connectedAddress, 'Main Wallet')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">Portfolio Tracker</h1>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {walletManager.wallets.length > 0 && (
                <>
                  <ViewModeSwitcher 
                    viewMode={walletManager.viewMode}
                    onToggle={walletManager.toggleViewMode}
                  />
                  <MultiWalletManager
                    wallets={walletManager.wallets}
                    selectedWalletId={walletManager.selectedWalletId}
                    onAddWallet={walletManager.addWallet}
                    onRemoveWallet={walletManager.removeWallet}
                    onUpdateWallet={walletManager.updateWallet}
                    onSelectWallet={walletManager.setSelectedWalletId}
                    onSetPrimary={walletManager.setPrimaryWallet}
                  />
                </>
              )}
              <WalletConnect onConnected={handleWalletConnected} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Crypto Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Track Your <span className="text-gradient">Crypto Portfolio</span> in Real-Time
            </h2>
            <p className="text-xl text-muted-foreground">
              Monitor your Web3 assets across multiple wallets with live prices, 
              24-hour changes, and comprehensive portfolio analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="container mx-auto px-4 py-12">
        <PortfolioDashboard 
          wallets={walletManager.wallets}
          selectedWalletId={walletManager.selectedWalletId}
          viewMode={walletManager.viewMode}
          hasConnectedWallet={isConnected}
        />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-xl">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
            <p className="text-muted-foreground">
              Monitor your portfolio value with live price updates every 30 seconds
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Connection</h3>
            <p className="text-muted-foreground">
              Connect safely with MetaMask or WalletConnect protocol
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Multi-Wallet Support</h3>
            <p className="text-muted-foreground">
              Manage and track multiple wallets from a single dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Built with React, TypeScript, and Web3 technologies
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Index
