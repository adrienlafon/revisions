import { Badge } from '@/components/ui/badge'
import { MasteryLevel } from '@/lib/data'
import { cn } from '@/lib/utils'

interface MasteryBadgeProps {
  mastery: MasteryLevel
  className?: string
}

const masteryConfig = {
  weak: {
    label: 'Faible',
    color: 'bg-[oklch(0.65_0.19_25)] text-white',
    dotColor: 'bg-white'
  },
  progress: {
    label: 'En cours',
    color: 'bg-[oklch(0.70_0.15_60)] text-[oklch(0.25_0.02_240)]',
    dotColor: 'bg-[oklch(0.25_0.02_240)]'
  },
  mastered: {
    label: 'Maîtrisé',
    color: 'bg-[oklch(0.65_0.17_155)] text-white',
    dotColor: 'bg-white'
  }
}

export function MasteryBadge({ mastery, className }: MasteryBadgeProps) {
  const config = masteryConfig[mastery]
  
  return (
    <Badge className={cn('uppercase text-xs font-medium tracking-wide', config.color, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', config.dotColor, mastery === 'progress' && 'animate-pulse')} />
      {config.label}
    </Badge>
  )
}
