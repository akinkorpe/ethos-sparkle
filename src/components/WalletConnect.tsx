import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { Button } from './ui/button'
import { Wallet } from 'lucide-react'
import { useEffect } from 'react'

interface WalletConnectProps {
  onConnected?: (address: string) => void
}

export function WalletConnect({ onConnected }: WalletConnectProps) {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && address && onConnected) {
      onConnected(address)
    }
  }, [isConnected, address, onConnected])

  if (isConnected && address) {
    return null // Wallet management is now handled by MultiWalletManager
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
