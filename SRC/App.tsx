import { useState, useMemo, useEffect } from 'react'
import { INITIAL_KNOWLEDGE_POINTS, KnowledgePoint, MasteryLevel } from '@/lib/data'
import { KnowledgeCard } from '@/components/KnowledgeCard'
import { KnowledgeDetailDialog } from '@/components/KnowledgeDetailDialog'
import { QuizMode } from '@/components/QuizMode'
import { ImportDialog } from '@/components/ImportDialog'
import { DataTable } from '@/components/DataTable'
import { AdminPanel } from '@/components/AdminPanel'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, List, Upload, Table, GearSix } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface UserInfo {
  avatarUrl: string
  email: string
  id: string
  isOwner: boolean
  login: string
}

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [points, setPoints] = useState<KnowledgePoint[]>(INITIAL_KNOWLEDGE_POINTS)
  const [selectedPoint, setSelectedPoint] = useState<KnowledgePoint | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [quizMode, setQuizMode] = useState(false)
  const [filterLevel, setFilterLevel] = useState<MasteryLevel | 'all'>('all')
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [adminMode, setAdminMode] = useState(false)

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await window.spark.user()
        setUserInfo(user)
        
        const userProgressKey = `user-progress-${user.id}`
        const hasSeenWelcome = await window.spark.kv.get<boolean>(`welcome-${user.id}`)
        
        if (user.isOwner) {
          const masterData = await window.spark.kv.get<KnowledgePoint[]>('knowledge-points')
          
          if (masterData && Array.isArray(masterData) && masterData.length > 0) {
            const userProgress = await window.spark.kv.get<Record<number, { mastery: MasteryLevel, notes?: string }>>(userProgressKey)
            
            if (userProgress) {
              const pointsWithProgress = masterData.map(point => ({
                ...point,
                mastery: userProgress[point.id]?.mastery || point.mastery,
                notes: userProgress[point.id]?.notes || point.notes
              }))
              setPoints(pointsWithProgress)
            } else {
              setPoints(masterData)
            }
          } else {
            setPoints(INITIAL_KNOWLEDGE_POINTS)
          }
        } else {
          const masterData = await window.spark.kv.get<KnowledgePoint[]>('knowledge-points')
          
          if (masterData && Array.isArray(masterData) && masterData.length > 0) {
            const userProgress = await window.spark.kv.get<Record<number, { mastery: MasteryLevel, notes?: string }>>(userProgressKey)
            
            if (userProgress) {
              const pointsWithProgress = masterData.map(point => ({
                ...point,
                mastery: userProgress[point.id]?.mastery || 'weak' as MasteryLevel,
                notes: userProgress[point.id]?.notes || ''
              }))
              setPoints(pointsWithProgress)
            } else {
              const initialPoints = masterData.map(point => ({
                ...point,
                mastery: 'weak' as MasteryLevel,
                notes: ''
              }))
              setPoints(initialPoints)
            }
          } else {
            setPoints(INITIAL_KNOWLEDGE_POINTS)
          }
        }
        
        if (!hasSeenWelcome) {
          setTimeout(() => {
            toast.success(`Bienvenue ${user.login} !`, {
              description: 'Votre progression est enregistrée automatiquement et reste personnelle.',
              duration: 5000
            })
            window.spark.kv.set(`welcome-${user.id}`, true)
          }, 500)
        }
      } catch (error) {
        console.error('Error initializing user:', error)
        setPoints(INITIAL_KNOWLEDGE_POINTS)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeUser()
  }, [])

  useEffect(() => {
    if (userInfo && !isLoading && Array.isArray(points) && points.length > 0) {
      if (userInfo.isOwner) {
        window.spark.kv.set('knowledge-points', points)
      }
      
      const userProgressKey = `user-progress-${userInfo.id}`
      const userProgress: Record<number, { mastery: MasteryLevel, notes?: string }> = {}
      
      points.forEach(point => {
        userProgress[point.id] = {
          mastery: point.mastery,
          notes: point.notes
        }
      })
      
      window.spark.kv.set(userProgressKey, userProgress)
    }
  }, [points, userInfo, isLoading])

  const stats = useMemo(() => {
    if (!points || !Array.isArray(points) || points.length === 0) {
      return { total: 0, weak: 0, progress: 0, mastered: 0, masteryPercent: 0 }
    }
    
    const total = points.length
    const weak = points.filter(p => p.mastery === 'weak').length
    const progress = points.filter(p => p.mastery === 'progress').length
    const mastered = points.filter(p => p.mastery === 'mastered').length
    const masteryPercent = total > 0 ? (mastered / total) * 100 : 0
    
    return { total, weak, progress, mastered, masteryPercent }
  }, [points])

  const filteredPoints = useMemo(() => {
    if (!points || !Array.isArray(points)) return []
    if (filterLevel === 'all') return points
    return points.filter(p => p.mastery === filterLevel)
  }, [points, filterLevel])

  const handleCardClick = (point: KnowledgePoint) => {
    setSelectedPoint(point)
    setDialogOpen(true)
  }

  const handleMasteryChange = (pointId: number, mastery: MasteryLevel) => {
    setPoints(currentPoints => 
      currentPoints.map(p => p.id === pointId ? { ...p, mastery } : p)
    )
    if (selectedPoint?.id === pointId) {
      setSelectedPoint({ ...selectedPoint, mastery })
    }
  }

  const handleImport = (importedPoints: KnowledgePoint[]) => {
    setPoints(importedPoints)
  }

  const handleAdminSave = (updatedPoints: KnowledgePoint[]) => {
    setPoints(updatedPoints)
    setAdminMode(false)
  }

  const handlePointUpdate = (updatedPoint: KnowledgePoint) => {
    setPoints(currentPoints =>
      currentPoints.map(p => p.id === updatedPoint.id ? updatedPoint : p)
    )
    if (selectedPoint?.id === updatedPoint.id) {
      setSelectedPoint(updatedPoint)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  if (adminMode) {
    return (
      <>
        <AdminPanel
          points={points}
          onSave={handleAdminSave}
          onExit={() => setAdminMode(false)}
        />
        <Toaster />
      </>
    )
  }

  if (quizMode) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <QuizMode 
          points={points}
          onExit={() => setQuizMode(false)}
          onMasteryChange={handleMasteryChange}
        />
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">MasterMind</h1>
              <p className="text-white/90 text-sm md:text-base">
                Maîtrisez les 70 points essentiels de React - Votre progression personnelle
              </p>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {userInfo && userInfo.isOwner && (
                <>
                  <Button 
                    onClick={() => setAdminMode(true)}
                    variant="secondary"
                    size="lg"
                    className="bg-white/20 text-white hover:bg-white/30 font-semibold border-2 border-white/30"
                  >
                    <GearSix className="mr-2" weight="bold" />
                    Administration
                  </Button>
                  <Button 
                    onClick={() => setImportDialogOpen(true)}
                    variant="secondary"
                    size="lg"
                    className="bg-white/20 text-white hover:bg-white/30 font-semibold border-2 border-white/30"
                  >
                    <Upload className="mr-2" weight="bold" />
                    Importer
                  </Button>
                </>
              )}
              {userInfo && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/20">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={userInfo.avatarUrl} alt={userInfo.login} />
                        <AvatarFallback className="bg-white text-primary font-semibold">
                          {userInfo.login.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userInfo.login}</p>
                        <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    {userInfo.isOwner && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setAdminMode(true)}>
                          <GearSix className="mr-2 h-4 w-4" weight="bold" />
                          Administration
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                          <Upload className="mr-2 h-4 w-4" weight="bold" />
                          Importer des données
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button 
                onClick={() => setQuizMode(true)} 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              >
                <Brain className="mr-2" weight="bold" />
                Mode Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div className="bg-card rounded-xl border-2 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progression globale</h2>
            <span className="text-2xl font-bold text-primary">
              {Math.round(stats.masteryPercent)}%
            </span>
          </div>
          <Progress value={stats.masteryPercent} className="h-3 mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[oklch(0.65_0.19_25)]">{stats.weak}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Faible</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[oklch(0.70_0.15_60)]">{stats.progress}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">En cours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[oklch(0.65_0.17_155)]">{stats.mastered}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Maîtrisé</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <List weight="bold" className="text-muted-foreground" />
              <h2 className="text-xl font-semibold">
                {filterLevel === 'all' ? 'Tous les points' : `Points : ${filteredPoints.length}`}
              </h2>
            </div>
            
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <List weight="bold" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <Table weight="bold" />
              </Button>
            </div>
          </div>
          
          {viewMode === 'grid' && (
            <Tabs value={filterLevel} onValueChange={(v) => setFilterLevel(v as MasteryLevel | 'all')}>
              <TabsList>
                <TabsTrigger value="all">Tous ({stats.total})</TabsTrigger>
                <TabsTrigger value="weak">Faible ({stats.weak})</TabsTrigger>
                <TabsTrigger value="progress">En cours ({stats.progress})</TabsTrigger>
                <TabsTrigger value="mastered">Maîtrisé ({stats.mastered})</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        {viewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPoints.map(point => (
                <KnowledgeCard 
                  key={point.id}
                  point={point}
                  onClick={() => handleCardClick(point)}
                />
              ))}
            </div>

            {filteredPoints.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun point dans cette catégorie.</p>
              </div>
            )}
          </>
        ) : (
          <DataTable 
            points={points}
            onPointClick={handleCardClick}
            onPointUpdate={handlePointUpdate}
          />
        )}
      </div>
      <KnowledgeDetailDialog 
        point={selectedPoint}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onMasteryChange={handleMasteryChange}
        onPointUpdate={handlePointUpdate}
      />
      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
        currentPoints={points}
      />
      <Toaster />
    </div>
  );
}

export default App
