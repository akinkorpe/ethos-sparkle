import { ViewMode } from '@/types/wallet'
import { Button } from './ui/button'
import { Layers, User } from 'lucide-react'

interface ViewModeSwitcherProps {
  viewMode: ViewMode
  onToggle: () => void
}

export function ViewModeSwitcher({ viewMode, onToggle }: ViewModeSwitcherProps) {
  return (
    <div className="flex items-center gap-2 glass-card p-1 rounded-lg">
      <Button
        variant={viewMode === 'combined' ? 'default' : 'ghost'}
        size="sm"
        onClick={onToggle}
        className={viewMode === 'combined' ? 'gradient-primary' : ''}
      >
        <Layers className="h-4 w-4 mr-1" />
        Combined
      </Button>
      <Button
        variant={viewMode === 'individual' ? 'default' : 'ghost'}
        size="sm"
        onClick={onToggle}
        className={viewMode === 'individual' ? 'gradient-primary' : ''}
      >
        <User className="h-4 w-4 mr-1" />
        Individual
      </Button>
    </div>
  )
}
