'use client'

import { LogoText } from '@/components/logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import {
    createStudySession,
    generateFlashcardsFromNote,
    getRecentStudySessions,
    getUserFlashcards,
    getUserStudyStats,
    updateFlashcardAfterStudy
} from '@/lib/study-service'
import {
    Flashcard,
    Note,
    StudySession,
    StudyStats
} from '@/lib/types'
import {
    ArrowLeft,
    BookOpen,
    Brain,
    CheckCircle,
    Clock,
    Play,
    Plus,
    Target,
    TrendingUp,
    XCircle,
    Zap
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function FlashcardsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  // State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null)
  const [recentSessions, setRecentSessions] = useState<StudySession[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Study mode state
  const [isStudyMode, setIsStudyMode] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalStudied, setTotalStudied] = useState(0)
  
  // Generation dialog state
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState('')
  const [flashcardCount, setFlashcardCount] = useState(5)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    
    if (user) {
      loadData()
    }
  }, [user, loading, router])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [flashcardsData, statsData, sessionsData] = await Promise.all([
        getUserFlashcards(user!.id),
        getUserStudyStats(user!.id),
        getRecentStudySessions(user!.id, 5)
      ])
      
      setFlashcards(flashcardsData)
      setStudyStats(statsData)
      setRecentSessions(sessionsData)
      
      // Load notes for generation
      const { data: notesData } = await fetch('/api/notes').then(res => res.json())
      setNotes(notesData || [])
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load flashcards data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateFlashcards = async () => {
    if (!selectedNoteId) return
    
    try {
      setIsGenerating(true)
      const newFlashcards = await generateFlashcardsFromNote(
        selectedNoteId,
        user!.id,
        flashcardCount,
        difficulty
      )
      
      setFlashcards(prev => [...newFlashcards, ...prev])
      setShowGenerateDialog(false)
      
      toast({
        title: "Success",
        description: `Generated ${newFlashcards.length} flashcards`,
        variant: "success"
      })
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const startStudySession = () => {
    if (flashcards.length === 0) {
      toast({
        title: "No Cards",
        description: "Create some flashcards first to start studying",
        variant: "destructive"
      })
      return
    }
    
    setIsStudyMode(true)
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setStudyStartTime(new Date())
    setCorrectAnswers(0)
    setTotalStudied(0)
  }

  const endStudySession = async () => {
    if (!studyStartTime) return
    
    const duration = Math.round((Date.now() - studyStartTime.getTime()) / 1000 / 60) // minutes
    
    try {
      await createStudySession(
        user!.id,
        'flashcards',
        duration,
        totalStudied,
        correctAnswers
      )
      
      // Refresh stats
      const newStats = await getUserStudyStats(user!.id)
      setStudyStats(newStats)
      
      toast({
        title: "Study Complete!",
        description: `Studied ${totalStudied} cards in ${duration} minutes`,
        variant: "success"
      })
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save study session",
        variant: "destructive"
      })
    }
    
    setIsStudyMode(false)
    setStudyStartTime(null)
  }

  const handleCardResponse = async (quality: number) => {
    const currentCard = flashcards[currentCardIndex]
    if (!currentCard) return
    
    try {
      await updateFlashcardAfterStudy(currentCard.id, user!.id, quality)
      
      if (quality >= 3) {
        setCorrectAnswers(prev => prev + 1)
      }
      
      setTotalStudied(prev => prev + 1)
      
      // Move to next card
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(prev => prev + 1)
        setShowAnswer(false)
      } else {
        // End of session
        endStudySession()
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update flashcard",
        variant: "destructive"
      })
    }
  }

  const resetStudySession = () => {
    setIsStudyMode(false)
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setStudyStartTime(null)
    setCorrectAnswers(0)
    setTotalStudied(0)
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    )
  }

  if (isStudyMode) {
    const currentCard = flashcards[currentCardIndex]
    const progress = ((currentCardIndex + 1) / flashcards.length) * 100
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
        {/* Study Mode Header */}
        <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20 relative z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetStudySession}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Exit Study
                </Button>
                <div className="text-sm text-gray-600">
                  Card {currentCardIndex + 1} of {flashcards.length}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {correctAnswers}/{totalStudied} correct
                </div>
                <Progress value={progress} className="w-32" />
              </div>
            </div>
          </div>
        </nav>

        {/* Study Card */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="shadow-soft-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="text-sm text-gray-500 mb-2">Question</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {currentCard?.front_text}
                </h2>
                
                {!showAnswer ? (
                  <Button
                    onClick={() => setShowAnswer(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Show Answer
                  </Button>
                ) : (
                  <div className="space-y-6">
                    <div className="text-sm text-gray-500 mb-2">Answer</div>
                    <p className="text-lg text-gray-700 mb-8">
                      {currentCard?.back_text}
                    </p>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      How well did you know this?
                    </div>
                    
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleCardResponse(1)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Again
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCardResponse(2)}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        Hard
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCardResponse(3)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        Good
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCardResponse(4)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Easy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <LogoText className="text-lg sm:text-xl" />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={startStudySession}
                disabled={flashcards.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Studying
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cards">My Cards</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-soft border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Cards</p>
                      <p className="text-2xl font-bold text-gray-900">{studyStats?.total_flashcards || 0}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Study Time</p>
                      <p className="text-2xl font-bold text-gray-900">{studyStats?.total_study_time || 0}m</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Streak</p>
                      <p className="text-2xl font-bold text-gray-900">{studyStats?.streak_days || 0} days</p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Difficulty</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {studyStats?.average_difficulty ? studyStats.average_difficulty.toFixed(1) : '0.0'}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card className="shadow-soft border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Study Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No study sessions yet</p>
                ) : (
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{session.session_type}</p>
                          <p className="text-sm text-gray-600">
                            {session.cards_studied} cards • {session.duration_minutes} minutes
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {new Date(session.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-green-600">
                            {session.correct_answers}/{session.cards_studied} correct
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Flashcards</h2>
              <Badge variant="outline" className="text-gray-600">
                {flashcards.length} cards
              </Badge>
            </div>

            {flashcards.length === 0 ? (
              <Card className="shadow-soft border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Flashcards Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Generate flashcards from your notes or create them manually
                  </p>
                  <Button
                    onClick={() => setShowGenerateDialog(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Generate from Notes
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flashcards.map((card) => (
                  <Card key={card.id} className="shadow-soft border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Question</h3>
                          <p className="text-sm text-gray-700 line-clamp-3">{card.front_text}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Answer</h3>
                          <p className="text-sm text-gray-700 line-clamp-3">{card.back_text}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            Difficulty: {card.difficulty_level}/5
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {card.repetitions} reviews
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <Card className="shadow-soft border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Generate Flashcards from Notes</CardTitle>
                <CardDescription>
                  Create flashcards automatically from your existing notes using AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="note-select">Select Note</Label>
                    <Select value={selectedNoteId} onValueChange={setSelectedNoteId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a note to generate flashcards from" />
                      </SelectTrigger>
                      <SelectContent>
                        {notes.map((note) => (
                          <SelectItem key={note.id} value={note.id}>
                            {note.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="count">Number of Cards</Label>
                    <Input
                      id="count"
                      type="number"
                      min="1"
                      max="20"
                      value={flashcardCount}
                      onChange={(e) => setFlashcardCount(parseInt(e.target.value) || 5)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateFlashcards}
                  disabled={!selectedNoteId || isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Flashcards
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
