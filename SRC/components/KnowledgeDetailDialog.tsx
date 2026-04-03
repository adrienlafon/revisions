import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { KnowledgePoint, MasteryLevel } from '@/lib/data'
import { MasteryBadge } from './MasteryBadge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { VideoCamera, FloppyDisk } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface KnowledgeDetailDialogProps {
  point: KnowledgePoint | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMasteryChange: (pointId: number, mastery: MasteryLevel) => void
  onPointUpdate?: (point: KnowledgePoint) => void
}

export function KnowledgeDetailDialog({ 
  point, 
  open, 
  onOpenChange, 
  onMasteryChange,
  onPointUpdate 
}: KnowledgeDetailDialogProps) {
  const [notes, setNotes] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (point) {
      setNotes(point.notes || '')
      setVideoLink(point.videoLink || '')
      setHasChanges(false)
    }
  }, [point])

  if (!point) return null

  const handleNotesChange = (value: string) => {
    setNotes(value)
    setHasChanges(true)
  }

  const handleVideoLinkChange = (value: string) => {
    setVideoLink(value)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (onPointUpdate) {
      onPointUpdate({
        ...point,
        notes,
        videoLink
      })
      setHasChanges(false)
      toast.success('Modifications enregistrées')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium text-muted-foreground mb-2">Point #{point.id}</div>
              <DialogTitle className="text-2xl font-bold leading-tight pr-8">
                {point.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Description
            </h4>
            <p className="text-base leading-relaxed">
              {point.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Niveau de maîtrise
            </h4>
            <RadioGroup 
              value={point.mastery} 
              onValueChange={(value) => onMasteryChange(point.id, value as MasteryLevel)}
              className="gap-3"
            >
              <div className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-[oklch(0.65_0.19_25)] has-[:checked]:bg-[oklch(0.65_0.19_25)]/5">
                <RadioGroupItem value="weak" id="weak" />
                <Label htmlFor="weak" className="flex-1 cursor-pointer flex items-center justify-between">
                  <span className="font-medium">Faible</span>
                  <MasteryBadge mastery="weak" />
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-[oklch(0.70_0.15_60)] has-[:checked]:bg-[oklch(0.70_0.15_60)]/5">
                <RadioGroupItem value="progress" id="progress" />
                <Label htmlFor="progress" className="flex-1 cursor-pointer flex items-center justify-between">
                  <span className="font-medium">En cours de travail</span>
                  <MasteryBadge mastery="progress" />
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-[oklch(0.65_0.17_155)] has-[:checked]:bg-[oklch(0.65_0.17_155)]/5">
                <RadioGroupItem value="mastered" id="mastered" />
                <Label htmlFor="mastered" className="flex-1 cursor-pointer flex items-center justify-between">
                  <span className="font-medium">Maîtrisé</span>
                  <MasteryBadge mastery="mastered" />
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="video-link" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
              <VideoCamera weight="bold" />
              Lien vidéo
            </Label>
            <Input
              id="video-link"
              placeholder="https://youtube.com/watch?v=..."
              value={videoLink}
              onChange={(e) => handleVideoLinkChange(e.target.value)}
              className="mt-3"
            />
            {videoLink && (
              <a 
                href={videoLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 mt-3 rounded-lg border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-colors text-primary font-medium"
              >
                <VideoCamera weight="bold" size={20} />
                Ouvrir la vidéo
              </a>
            )}
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">
              Mes notes personnelles
            </Label>
            <Textarea
              id="notes"
              placeholder="Ajoutez vos notes, exemples de code, liens utiles..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="mt-3 min-h-[150px] font-mono text-sm"
            />
          </div>

          {hasChanges && (
            <Button 
              onClick={handleSave}
              className="w-full"
              size="lg"
            >
              <FloppyDisk className="mr-2" weight="bold" />
              Enregistrer les modifications
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
