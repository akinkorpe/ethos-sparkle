import { useState } from 'react'
import { WalletInfo } from '@/types/wallet'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Wallet, Plus, Star, Trash2, Edit2, ChevronDown } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MultiWalletManagerProps {
  wallets: WalletInfo[]
  selectedWalletId: string | null
  onAddWallet: (address: string, label?: string) => void
  onRemoveWallet: (id: string) => void
  onUpdateWallet: (id: string, updates: Partial<WalletInfo>) => void
  onSelectWallet: (id: string) => void
  onSetPrimary: (id: string) => void
}

export function MultiWalletManager({
  wallets,
  selectedWalletId,
  onAddWallet,
  onRemoveWallet,
  onUpdateWallet,
  onSelectWallet,
  onSetPrimary
}: MultiWalletManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newWalletAddress, setNewWalletAddress] = useState('')
  const [newWalletLabel, setNewWalletLabel] = useState('')
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const { toast } = useToast()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleAddWallet = () => {
    if (!newWalletAddress) {
      toast({
        title: 'Error',
        description: 'Please enter a wallet address',
        variant: 'destructive'
      })
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(newWalletAddress)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid Ethereum address',
        variant: 'destructive'
      })
      return
    }

    onAddWallet(newWalletAddress, newWalletLabel || undefined)
    setNewWalletAddress('')
    setNewWalletLabel('')
    setIsAddDialogOpen(false)
    
    toast({
      title: 'Success',
      description: 'Wallet added successfully',
    })
  }

  const handleRemoveWallet = (id: string) => {
    onRemoveWallet(id)
    toast({
      title: 'Removed',
      description: 'Wallet removed from portfolio',
    })
  }

  const handleUpdateLabel = (id: string) => {
    if (!editLabel.trim()) return
    
    onUpdateWallet(id, { label: editLabel })
    setEditingWalletId(null)
    setEditLabel('')
    
    toast({
      title: 'Updated',
      description: 'Wallet label updated',
    })
  }

  const handleSetPrimary = (id: string) => {
    onSetPrimary(id)
    toast({
      title: 'Primary wallet set',
      description: 'This wallet is now your primary wallet',
    })
  }

  const selectedWallet = wallets.find(w => w.id === selectedWalletId)

  return (
    <div className="flex items-center gap-2">
      {wallets.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="glass-card hover-glow min-w-[200px] justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="font-mono text-sm">
                  {selectedWallet ? formatAddress(selectedWallet.address) : 'Select Wallet'}
                </span>
                {selectedWallet?.isPrimary && (
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                )}
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px] glass-card">
            <DropdownMenuLabel>Connected Wallets ({wallets.length})</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {wallets.map((wallet) => (
              <DropdownMenuItem
                key={wallet.id}
                className="flex items-center justify-between p-3 cursor-pointer"
                onSelect={() => onSelectWallet(wallet.id)}
              >
                <div className="flex items-center gap-2 flex-1">
                  {wallet.isPrimary && (
                    <Star className="h-3 w-3 fill-secondary text-secondary flex-shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{wallet.label}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatAddress(wallet.address)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!wallet.isPrimary && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetPrimary(wallet.id)
                      }}
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingWalletId(wallet.id)
                      setEditLabel(wallet.label)
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveWallet(wallet.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="glass-card hover-glow">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Add Wallet to Portfolio</DialogTitle>
            <DialogDescription>
              Add another wallet address to track in your portfolio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <Input
                id="wallet-address"
                placeholder="0x..."
                value={newWalletAddress}
                onChange={(e) => setNewWalletAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet-label">Label (Optional)</Label>
              <Input
                id="wallet-label"
                placeholder="e.g., Trading Wallet"
                value={newWalletLabel}
                onChange={(e) => setNewWalletLabel(e.target.value)}
              />
            </div>
            <Button onClick={handleAddWallet} className="w-full gradient-primary">
              Add Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Label Dialog */}
      <Dialog open={editingWalletId !== null} onOpenChange={(open) => !open && setEditingWalletId(null)}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Edit Wallet Label</DialogTitle>
            <DialogDescription>
              Change the display name for this wallet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-label">Wallet Label</Label>
              <Input
                id="edit-label"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="Enter wallet label"
              />
            </div>
            <Button 
              onClick={() => editingWalletId && handleUpdateLabel(editingWalletId)} 
              className="w-full gradient-primary"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
