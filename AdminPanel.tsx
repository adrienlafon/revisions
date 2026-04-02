import { useState, useEffect } from 'react'
import { KnowledgePoint } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus, FloppyDisk, ArrowLeft, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface AdminPanelProps {
  points: KnowledgePoint[]
  onSave: (points: KnowledgePoint[]) => void
  onExit: () => void
}

export function AdminPanel({ points, onSave, onExit }: AdminPanelProps) {
  const [editedPoints, setEditedPoints] = useState<KnowledgePoint[]>(points)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setHasChanges(JSON.stringify(points) !== JSON.stringify(editedPoints))
  }, [points, editedPoints])

  const handleUpdatePoint = (id: number, field: keyof KnowledgePoint, value: string) => {
    setEditedPoints(current =>
      current.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    )
  }

  const handleDeletePoint = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce point de connaissance ?')) {
      setEditedPoints(current => current.filter(p => p.id !== id))
      toast.success('Point supprimé')
    }
  }

  const handleAddPoint = () => {
    const maxId = Math.max(...editedPoints.map(p => p.id), 0)
    const newPoint: KnowledgePoint = {
      id: maxId + 1,
      title: 'Nouveau point',
      description: 'Description du nouveau point',
      mastery: 'weak'
    }
    setEditedPoints(current => [...current, newPoint])
    toast.success('Nouveau point ajouté')
  }

  const handleSave = () => {
    onSave(editedPoints)
    toast.success(`${editedPoints.length} points sauvegardés avec succès`)
  }

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir annuler tous les changements ?')) {
      setEditedPoints(points)
      toast.info('Changements annulés')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onExit}
              >
                <ArrowLeft className="mr-2" weight="bold" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Administration des Thèmes</h1>
                <p className="text-sm text-muted-foreground">
                  Modification en bulk de tous les points de connaissance
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="secondary" className="animate-pulse">
                  Modifications non sauvegardées
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={handleAddPoint}
              >
                <Plus className="mr-2" weight="bold" />
                Ajouter
              </Button>
              {hasChanges && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  Annuler
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="font-semibold"
              >
                <FloppyDisk className="mr-2" weight="bold" />
                Sauvegarder ({editedPoints.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="space-y-4">
          {editedPoints.map((point) => (
            <Card key={point.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                      #{point.id}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Titre</label>
                      <Input
                        value={point.title}
                        onChange={(e) => handleUpdatePoint(point.id, 'title', e.target.value)}
                        className="font-semibold text-lg"
                        placeholder="Titre du point"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={point.mastery}
                      onValueChange={(value) => handleUpdatePoint(point.id, 'mastery', value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weak">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[oklch(0.65_0.19_25)]"></div>
                            Faible
                          </span>
                        </SelectItem>
                        <SelectItem value="progress">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[oklch(0.70_0.15_60)]"></div>
                            En cours
                          </span>
                        </SelectItem>
                        <SelectItem value="mastered">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[oklch(0.65_0.17_155)]"></div>
                            Maîtrisé
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePoint(point.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash weight="bold" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 bg-muted/30 p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
                    📝 Description du thème
                  </label>
                  <Textarea
                    value={point.description}
                    onChange={(e) => handleUpdatePoint(point.id, 'description', e.target.value)}
                    placeholder="Saisissez ici la description complète du point de connaissance..."
                    rows={4}
                    className="resize-none bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes personnelles</label>
                    <Textarea
                      value={point.notes || ''}
                      onChange={(e) => handleUpdatePoint(point.id, 'notes', e.target.value)}
                      placeholder="Vos notes sur ce sujet..."
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Lien vidéo (lecture seule pour utilisateurs)</label>
                    <Input
                      value={point.videoLink || ''}
                      onChange={(e) => handleUpdatePoint(point.id, 'videoLink', e.target.value)}
                      placeholder="https://youtube.com/..."
                      type="url"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {editedPoints.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Aucun point de connaissance</p>
            <Button onClick={handleAddPoint}>
              <Plus className="mr-2" weight="bold" />
              Ajouter le premier point
            </Button>
          </Card>
        )}
      </div>

      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-20">
          <Card className="p-4 shadow-lg border-2 border-primary/20 bg-card">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <p className="font-semibold">Modifications en attente</p>
                <p className="text-muted-foreground">{editedPoints.length} points à sauvegarder</p>
              </div>
              <Button onClick={handleSave} size="sm">
                <FloppyDisk className="mr-2" weight="bold" />
                Sauvegarder
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
