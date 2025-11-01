import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from './ui/button'
import { Wallet, LogOut } from 'lucide-react'

export function WalletConnect() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="glass-card px-4 py-2 rounded-lg">
          <span className="text-sm font-mono">{formatAddress(address)}</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => disconnect()}
          className="hover-glow"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => open()}
      className="gradient-primary hover-glow font-semibold"
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
