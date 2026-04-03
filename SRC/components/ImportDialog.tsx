import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, File, CheckCircle, Download, Warning } from '@phosphor-icons/react'
import { KnowledgePoint, MasteryLevel } from '@/lib/data'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (points: KnowledgePoint[]) => void
  currentPoints: KnowledgePoint[]
}

export function ImportDialog({ open, onOpenChange, onImport, currentPoints }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<KnowledgePoint[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [modifiedCount, setModifiedCount] = useState(0)
  const [newCount, setNewCount] = useState(0)
  const [replaceMode, setReplaceMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const exportData = currentPoints.map(point => ({
      id: point.id,
      title: point.title,
      description: point.description,
      mastery: point.mastery,
      notes: point.notes || '',
      videoLink: point.videoLink || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 30 },
      { wch: 50 },
      { wch: 12 },
      { wch: 50 },
      { wch: 40 }
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Knowledge Points')
    
    const date = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `knowledge-points-${date}.xlsx`)
    
    toast.success('Fichier Excel exporté avec succès!')
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setIsProcessing(true)

    try {
      const data = await selectedFile.arrayBuffer()
      const workbook = XLSX.read(data)
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet) as any[]

      const existingIds = new Set(currentPoints.map(p => p.id))
      let modified = 0
      let newItems = 0
      const maxId = currentPoints.length > 0 ? Math.max(...currentPoints.map(p => p.id)) : 0

      const parsedPoints: KnowledgePoint[] = jsonData.map((row, index) => {
        const mastery = (row.mastery || row.Mastery || 'weak') as MasteryLevel
        const validMastery: MasteryLevel = ['weak', 'progress', 'mastered'].includes(mastery) ? mastery : 'weak'
        
        const point: KnowledgePoint = {
          id: row.id || (maxId + index + 1),
          title: row.title || row.titre || row.Title || row.Titre || '',
          description: row.description || row.Description || '',
          mastery: validMastery,
          notes: row.notes || row.Notes || '',
          videoLink: row.videoLink || row.VideoLink || row.videolink || ''
        }

        if (!replaceMode && existingIds.has(point.id)) {
          modified++
        } else {
          newItems++
        }

        return point
      }).filter(point => point.title && point.description)

      if (parsedPoints.length === 0) {
        toast.error('Aucune donnée valide trouvée dans le fichier')
        setFile(null)
      } else {
        setPreview(parsedPoints)
        setModifiedCount(modified)
        setNewCount(newItems)
        if (replaceMode) {
          toast.success(`${parsedPoints.length} points détectés - Mode remplacement activé`)
        } else {
          toast.success(`${parsedPoints.length} points détectés (${modified} modifiés, ${newItems} nouveaux)`)
        }
      }
    } catch (error) {
      toast.error('Erreur lors de la lecture du fichier')
      setFile(null)
      setPreview([])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = () => {
    if (preview.length > 0) {
      if (replaceMode) {
        onImport(preview)
        toast.success(`Remplacement complet effectué: ${preview.length} points importés!`)
      } else {
        const existingPointsMap = new Map(currentPoints.map(p => [p.id, p]))
        const updatedPoints = preview.map(importedPoint => {
          const existing = existingPointsMap.get(importedPoint.id)
          if (existing) {
            existingPointsMap.delete(importedPoint.id)
          }
          return importedPoint
        })

        const remainingPoints = Array.from(existingPointsMap.values())
        const finalPoints = [...updatedPoints, ...remainingPoints].sort((a, b) => a.id - b.id)

        onImport(finalPoints)
        toast.success(`${modifiedCount} points modifiés, ${newCount} points ajoutés!`)
      }
      handleClose()
    }
  }

  const handleClose = () => {
    setFile(null)
    setPreview([])
    setIsProcessing(false)
    setReplaceMode(false)
    setModifiedCount(0)
    setNewCount(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onOpenChange(false)
  }

  const handleReplaceModeChange = (checked: boolean) => {
    setReplaceMode(checked)
    if (file && preview.length > 0) {
      const existingIds = new Set(currentPoints.map(p => p.id))
      let modified = 0
      let newItems = 0
      
      preview.forEach(point => {
        if (!checked && existingIds.has(point.id)) {
          modified++
        } else {
          newItems++
        }
      })
      
      setModifiedCount(modified)
      setNewCount(newItems)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <File weight="bold" className="text-primary" />
            Import / Export Excel
          </DialogTitle>
          <DialogDescription>
            Exportez vos points pour les modifier dans Excel, puis réimportez-les pour mettre à jour en bulk
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold">Étape 1: Exporter</h3>
            <Button 
              onClick={handleExport} 
              variant="outline" 
              className="w-full"
            >
              <Download className="mr-2" weight="bold" />
              Télécharger le fichier Excel actuel
            </Button>
            <p className="text-xs text-muted-foreground">
              Modifiez les colonnes: <strong>title</strong>, <strong>description</strong>, <strong>mastery</strong> (weak/progress/mastered), <strong>notes</strong>, <strong>videoLink</strong>
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold">Étape 2: Mode d'import</h3>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div className="flex-1">
                <Label htmlFor="replace-mode" className="text-sm font-medium cursor-pointer">
                  Mode Remplacement
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {replaceMode 
                    ? "Tous les points seront supprimés et remplacés par les nouveaux" 
                    : "Les points existants seront mis à jour, les nouveaux seront ajoutés"}
                </p>
              </div>
              <Switch
                id="replace-mode"
                checked={replaceMode}
                onCheckedChange={handleReplaceModeChange}
              />
            </div>
            {replaceMode && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <Warning className="text-destructive mt-0.5 flex-shrink-0" weight="bold" />
                <div>
                  <p className="text-xs font-medium text-destructive">Attention</p>
                  <p className="text-xs text-destructive/90 mt-1">
                    Ce mode supprimera tous vos points actuels et les remplacera par ceux du fichier Excel.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold">Étape 3: Importer</h3>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Upload className="mx-auto mb-3 text-muted-foreground" size={40} />
              <p className="text-sm font-medium mb-1">
                {file ? file.name : 'Cliquez pour sélectionner le fichier modifié'}
              </p>
              <p className="text-xs text-muted-foreground">
                Formats acceptés: .xlsx, .xls
              </p>
            </div>
          </div>

          {isProcessing && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Traitement du fichier...</p>
            </div>
          )}

          {preview.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle weight="bold" className="text-[oklch(0.65_0.17_155)]" />
                  Aperçu ({preview.length} points)
                </h3>
              </div>
              
              {replaceMode ? (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    🔄 Mode Remplacement Complet
                  </p>
                  <p className="text-xs text-destructive/90">
                    Les {currentPoints.length} points actuels seront supprimés et remplacés par les {preview.length} nouveaux points du fichier.
                  </p>
                </div>
              ) : (
                <div className="bg-accent/10 rounded-lg p-3 space-y-1">
                  <p className="text-sm font-medium text-accent">
                    {modifiedCount > 0 && `✓ ${modifiedCount} point(s) seront modifiés`}
                  </p>
                  {newCount > 0 && (
                    <p className="text-sm font-medium text-primary">
                      + {newCount} nouveau(x) point(s) seront ajoutés
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Total après import: {currentPoints.length + newCount} points
                  </p>
                </div>
              )}
              
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {preview.slice(0, 5).map((point, index) => (
                  <div 
                    key={index} 
                    className="p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{point.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {point.description}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        point.mastery === 'mastered' ? 'bg-[oklch(0.65_0.17_155)] text-white' :
                        point.mastery === 'progress' ? 'bg-[oklch(0.70_0.15_60)] text-white' :
                        'bg-[oklch(0.65_0.19_25)] text-white'
                      }`}>
                        {point.mastery === 'mastered' ? 'Maîtrisé' :
                         point.mastery === 'progress' ? 'En cours' : 'Faible'}
                      </span>
                    </div>
                  </div>
                ))}
                {preview.length > 5 && (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    ... et {preview.length - 5} autres points
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={preview.length === 0 || isProcessing}
            className="bg-primary"
          >
            Importer {preview.length > 0 && `(${preview.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
