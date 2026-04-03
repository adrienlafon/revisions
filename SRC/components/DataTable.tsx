import { useState, useMemo } from 'react'
import { KnowledgePoint, MasteryLevel, CATEGORIES } from '@/lib/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MasteryBadge } from '@/components/MasteryBadge'
import { MagnifyingGlass, ArrowUp, ArrowDown, PencilSimple, Check, X, FileXls, VideoCamera } from '@phosphor-icons/react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

type SortField = 'id' | 'title' | 'mastery' | 'category'
type SortDirection = 'asc' | 'desc'

interface DataTableProps {
  points: KnowledgePoint[]
  onPointClick: (point: KnowledgePoint) => void
  onPointUpdate?: (point: KnowledgePoint) => void
}

export function DataTable({ points, onPointClick, onPointUpdate }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [masteryFilter, setMasteryFilter] = useState<MasteryLevel | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('id')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editMastery, setEditMastery] = useState<MasteryLevel>('weak')

  const getCategoryForPoint = (pointId: number) => {
    return CATEGORIES.find(cat => cat.pointIds.includes(pointId))
  }

  const filteredAndSortedPoints = useMemo(() => {
    if (!points || !Array.isArray(points)) {
      return []
    }

    let filtered = points.filter(point => {
      const matchesSearch = 
        point.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesMastery = masteryFilter === 'all' || point.mastery === masteryFilter
      const matchesCategory = categoryFilter === 'all' || getCategoryForPoint(point.id)?.id === categoryFilter
      return matchesSearch && matchesMastery && matchesCategory
    })

    filtered.sort((a, b) => {
      let comparison = 0
      
      if (sortField === 'id') {
        comparison = a.id - b.id
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title)
      } else if (sortField === 'mastery') {
        const masteryOrder = { weak: 0, progress: 1, mastered: 2 }
        comparison = masteryOrder[a.mastery] - masteryOrder[b.mastery]
      } else if (sortField === 'category') {
        const catA = getCategoryForPoint(a.id)?.name || ''
        const catB = getCategoryForPoint(b.id)?.name || ''
        comparison = catA.localeCompare(catB)
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [points, searchQuery, masteryFilter, categoryFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ArrowUp className="inline ml-1" size={16} weight="bold" /> : 
      <ArrowDown className="inline ml-1" size={16} weight="bold" />
  }

  const handleEditStart = (point: KnowledgePoint) => {
    setEditingId(point.id)
    setEditTitle(point.title)
    setEditDescription(point.description)
    setEditMastery(point.mastery)
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
    setEditMastery('weak')
  }

  const handleEditSave = () => {
    if (!editingId) return
    
    if (!editTitle.trim()) {
      toast.error('Le titre ne peut pas être vide')
      return
    }

    if (!editDescription.trim()) {
      toast.error('La description ne peut pas être vide')
      return
    }

    const updatedPoint: KnowledgePoint = {
      id: editingId,
      title: editTitle.trim(),
      description: editDescription.trim(),
      mastery: editMastery
    }

    onPointUpdate?.(updatedPoint)
    toast.success('Point de connaissance mis à jour')
    handleEditCancel()
  }

  const handleExportExcel = () => {
    const exportData = filteredAndSortedPoints.map(point => ({
      'ID': point.id,
      'Titre': point.title,
      'Description': point.description,
      'Catégorie': getCategoryForPoint(point.id)?.name || 'Non catégorisé',
      'Maîtrise': point.mastery === 'weak' ? 'Faible' : point.mastery === 'progress' ? 'En cours' : 'Maîtrisé',
      'Notes': point.notes || '',
      'Lien vidéo': point.videoLink || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    
    const colWidths = [
      { wch: 8 },
      { wch: 30 },
      { wch: 50 },
      { wch: 20 },
      { wch: 15 },
      { wch: 40 },
      { wch: 40 }
    ]
    worksheet['!cols'] = colWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Points de connaissance')

    const timestamp = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(workbook, `mastermind-export-${timestamp}.xlsx`)
    
    toast.success(`${exportData.length} point${exportData.length > 1 ? 's' : ''} exporté${exportData.length > 1 ? 's' : ''} avec succès`)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-[250px]">
          <MagnifyingGlass 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            size={18}
            weight="bold"
          />
          <Input
            placeholder="Rechercher un point..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter.toString()} onValueChange={(v) => setCategoryFilter(v === 'all' ? 'all' : parseInt(v))}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={masteryFilter} onValueChange={(v) => setMasteryFilter(v as MasteryLevel | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Niveau de maîtrise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="weak">Faible</SelectItem>
            <SelectItem value="progress">En cours</SelectItem>
            <SelectItem value="mastered">Maîtrisé</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleExportExcel}
          variant="outline"
          className="gap-2"
        >
          <FileXls weight="bold" size={18} />
          Exporter Excel
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('id')}
                    className="font-semibold hover:bg-transparent p-0"
                  >
                    ID
                    <SortIcon field="id" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('title')}
                    className="font-semibold hover:bg-transparent p-0"
                  >
                    Titre
                    <SortIcon field="title" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="w-[160px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('category')}
                    className="font-semibold hover:bg-transparent p-0"
                  >
                    Catégorie
                    <SortIcon field="category" />
                  </Button>
                </TableHead>
                <TableHead className="w-[140px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('mastery')}
                    className="font-semibold hover:bg-transparent p-0"
                  >
                    Maîtrise
                    <SortIcon field="mastery" />
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">Vidéo</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedPoints.map((point) => {
                const isEditing = editingId === point.id
                const category = getCategoryForPoint(point.id)
                
                return isEditing ? (
                  <TableRow key={point.id} className="bg-accent/10">
                    <TableCell className="font-medium text-muted-foreground">
                      #{point.id}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="min-w-[200px]"
                        placeholder="Titre"
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="min-w-[300px] min-h-[80px]"
                        placeholder="Description"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {category?.name || 'Non catégorisé'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={editMastery} onValueChange={(v) => setEditMastery(v as MasteryLevel)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weak">Faible</SelectItem>
                          <SelectItem value="progress">En cours</SelectItem>
                          <SelectItem value="mastered">Maîtrisé</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {point.videoLink && (
                        <a
                          href={point.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <VideoCamera weight="bold" size={20} />
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={handleEditSave}
                          className="h-8 w-8 p-0"
                        >
                          <Check weight="bold" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditCancel}
                          className="h-8 w-8 p-0"
                        >
                          <X weight="bold" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow 
                    key={point.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      #{point.id}
                    </TableCell>
                    <TableCell className="font-medium" onClick={() => onPointClick(point)}>
                      {point.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground" onClick={() => onPointClick(point)}>
                      <div className="line-clamp-2">
                        {point.description}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => onPointClick(point)}>
                      <div 
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
                        style={{
                          backgroundColor: category ? `color-mix(in oklch, ${category.color} 15%, transparent)` : 'var(--muted)',
                          borderColor: category ? category.color : 'var(--border)',
                          color: category ? category.color : 'var(--muted-foreground)'
                        }}
                      >
                        {category?.name || 'Non catégorisé'}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => onPointClick(point)}>
                      <MasteryBadge mastery={point.mastery} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {point.videoLink ? (
                        <a
                          href={point.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 inline-flex"
                          title="Ouvrir la vidéo"
                        >
                          <VideoCamera weight="bold" size={20} />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditStart(point)}
                        className="h-8 w-8 p-0"
                      >
                        <PencilSimple weight="bold" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {filteredAndSortedPoints.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucun point trouvé avec ces critères.
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center">
        {filteredAndSortedPoints.length} point{filteredAndSortedPoints.length > 1 ? 's' : ''} affiché{filteredAndSortedPoints.length > 1 ? 's' : ''}
      </div>
    </div>
  )
}
