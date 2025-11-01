import { useAccount, useBalance } from 'wagmi'
import { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react'
import axios from 'axios'

interface TokenPrice {
  usd: number
  usd_24h_change: number
}

export function PortfolioDashboard() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const [ethPrice, setEthPrice] = useState<TokenPrice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true'
        )
        setEthPrice(response.data.ethereum)
      } catch (error) {
        console.error('Error fetching prices:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isConnected) {
      fetchPrices()
      const interval = setInterval(fetchPrices, 30000) // Update every 30s
      return () => clearInterval(interval)
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Wallet className="h-16 w-16 mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground max-w-md">
          Connect your wallet to start tracking your crypto portfolio in real-time
        </p>
      </div>
    )
  }

  const ethBalance = balance ? parseFloat(balance.formatted) : 0
  const totalValue = ethPrice ? ethBalance * ethPrice.usd : 0
  const change24h = ethPrice?.usd_24h_change || 0
  const isPositive = change24h >= 0

  return (
    <div className="space-y-6">
      {/* Total Portfolio Value */}
      <Card className="glass-card p-8 hover-glow border-2">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
          {loading ? (
            <div className="h-12 w-48 bg-muted animate-pulse rounded" />
          ) : (
            <h1 className="text-5xl font-bold text-gradient">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
          )}
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={isPositive ? 'text-success' : 'text-destructive'}>
              {isPositive ? '+' : ''}{change24h.toFixed(2)}% (24h)
            </span>
          </div>
        </div>
      </Card>

      {/* Asset Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="glass-card p-6 hover-glow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">ETH Balance</p>
              <h3 className="text-2xl font-bold mt-1">
                {ethBalance.toFixed(4)} ETH
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          {ethPrice && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                ${(ethBalance * ethPrice.usd).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
                {isPositive ? '+' : ''}{change24h.toFixed(2)}% today
              </p>
            </div>
          )}
        </Card>

        <Card className="glass-card p-6 hover-glow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">ETH Price</p>
              <h3 className="text-2xl font-bold mt-1">
                ${ethPrice?.usd.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              {isPositive ? (
                <TrendingUp className="h-6 w-6 text-success" />
              ) : (
                <TrendingDown className="h-6 w-6 text-destructive" />
              )}
            </div>
          </div>
          <p className={`text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{change24h.toFixed(2)}% (24h)
          </p>
        </Card>

        <Card className="glass-card p-6 hover-glow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">24h Change</p>
              <h3 className="text-2xl font-bold mt-1">
                ${ethPrice ? ((ethBalance * ethPrice.usd * change24h) / 100).toFixed(2) : '0.00'}
              </h3>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              isPositive ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              {isPositive ? (
                <TrendingUp className="h-6 w-6 text-success" />
              ) : (
                <TrendingDown className="h-6 w-6 text-destructive" />
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Portfolio performance
          </p>
        </Card>
      </div>
    </div>
  )
}
