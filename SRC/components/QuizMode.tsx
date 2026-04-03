import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KnowledgePoint, MasteryLevel } from '@/lib/data'
import { MasteryBadge } from './MasteryBadge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Eye, Shuffle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'

interface QuizModeProps {
  points: KnowledgePoint[]
  onExit: () => void
  onMasteryChange: (pointId: number, mastery: MasteryLevel) => void
}

export function QuizMode({ points, onExit, onMasteryChange }: QuizModeProps) {
  const [selectedLevels, setSelectedLevels] = useState<MasteryLevel[]>(['weak', 'progress', 'mastered'])
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [shuffledPoints, setShuffledPoints] = useState<KnowledgePoint[]>([])

  const startQuiz = () => {
    if (!points || !Array.isArray(points)) {
      setShuffledPoints([])
      return
    }
    const filtered = points.filter(p => selectedLevels.includes(p.mastery))
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setShuffledPoints(shuffled)
    setCurrentIndex(0)
    setRevealed(false)
    setQuizStarted(true)
  }

  const handleNext = () => {
    if (currentIndex < shuffledPoints.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setRevealed(false)
    } else {
      setQuizStarted(false)
    }
  }

  const handleMasteryChange = (mastery: MasteryLevel) => {
    onMasteryChange(shuffledPoints[currentIndex].id, mastery)
    const updated = [...shuffledPoints]
    updated[currentIndex] = { ...updated[currentIndex], mastery }
    setShuffledPoints(updated)
  }

  const toggleLevel = (level: MasteryLevel) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    )
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onExit}>
            <ArrowLeft className="mr-2" />
            Retour
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Mode Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Sélectionnez les niveaux à réviser :</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id="quiz-weak" 
                    checked={selectedLevels.includes('weak')}
                    onCheckedChange={() => toggleLevel('weak')}
                  />
                  <Label htmlFor="quiz-weak" className="flex-1 cursor-pointer flex items-center justify-between">
                    <span>Faible</span>
                    <MasteryBadge mastery="weak" />
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id="quiz-progress" 
                    checked={selectedLevels.includes('progress')}
                    onCheckedChange={() => toggleLevel('progress')}
                  />
                  <Label htmlFor="quiz-progress" className="flex-1 cursor-pointer flex items-center justify-between">
                    <span>En cours de travail</span>
                    <MasteryBadge mastery="progress" />
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id="quiz-mastered" 
                    checked={selectedLevels.includes('mastered')}
                    onCheckedChange={() => toggleLevel('mastered')}
                  />
                  <Label htmlFor="quiz-mastered" className="flex-1 cursor-pointer flex items-center justify-between">
                    <span>Maîtrisé</span>
                    <MasteryBadge mastery="mastered" />
                  </Label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                {Array.isArray(points) ? points.filter(p => selectedLevels.includes(p.mastery)).length : 0} point(s) disponible(s)
              </p>
              <Button 
                onClick={startQuiz} 
                className="w-full"
                size="lg"
                disabled={selectedLevels.length === 0 || !Array.isArray(points) || points.filter(p => selectedLevels.includes(p.mastery)).length === 0}
              >
                <Shuffle className="mr-2" weight="bold" />
                Commencer le quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (shuffledPoints.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Aucun point disponible avec les filtres sélectionnés.
            </p>
            <Button onClick={() => setQuizStarted(false)}>
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentPoint = shuffledPoints[currentIndex]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setQuizStarted(false)}>
          <ArrowLeft className="mr-2" />
          Quitter le quiz
        </Button>
        <div className="text-sm font-medium text-muted-foreground">
          Question {currentIndex + 1} / {shuffledPoints.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium opacity-90 mb-2">Point #{currentPoint.id}</div>
                  <CardTitle className="text-2xl font-bold leading-tight">
                    {currentPoint.title}
                  </CardTitle>
                </div>
                <MasteryBadge mastery={currentPoint.mastery} className="bg-white/20 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="min-h-[120px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!revealed ? (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center w-full"
                    >
                      <p className="text-muted-foreground mb-6">
                        Réfléchissez à ce point de connaissance...
                      </p>
                      <Button onClick={() => setRevealed(true)} size="lg" variant="outline">
                        <Eye className="mr-2" weight="bold" />
                        Révéler la réponse
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <div className="bg-muted/50 rounded-lg p-6 mb-6">
                        <p className="text-base leading-relaxed">
                          {currentPoint.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                          Comment évaluez-vous votre maîtrise ?
                        </h4>
                        <RadioGroup 
                          value={currentPoint.mastery}
                          onValueChange={(value) => handleMasteryChange(value as MasteryLevel)}
                          className="gap-3"
                        >
                          <div className="flex items-center space-x-3 border-2 rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-[oklch(0.65_0.19_25)] has-[:checked]:bg-[oklch(0.65_0.19_25)]/5">
                            <RadioGroupItem value="weak" id="quiz-answer-weak" />
                            <Label htmlFor="quiz-answer-weak" className="flex-1 cursor-pointer flex items-center justify-between">
                              <span className="font-medium">Faible</span>
                              <MasteryBadge mastery="weak" />
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-3 border-2 rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-[oklch(0.70_0.15_60)] has-[:checked]:bg-[oklch(0.70_0.15_60)]/5">
                            <RadioGroupItem value="progress" id="quiz-answer-progress" />
                            <Label htmlFor="quiz-answer-progress" className="flex-1 cursor-pointer flex items-center justify-between">
                              <span className="font-medium">En cours</span>
                              <MasteryBadge mastery="progress" />
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-3 border-2 rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-[oklch(0.65_0.17_155)] has-[:checked]:bg-[oklch(0.65_0.17_155)]/5">
                            <RadioGroupItem value="mastered" id="quiz-answer-mastered" />
                            <Label htmlFor="quiz-answer-mastered" className="flex-1 cursor-pointer flex items-center justify-between">
                              <span className="font-medium">Maîtrisé</span>
                              <MasteryBadge mastery="mastered" />
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button onClick={handleNext} size="lg">
                          {currentIndex < shuffledPoints.length - 1 ? 'Question suivante' : 'Terminer le quiz'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
