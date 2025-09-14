import { createClient } from '@/lib/supabase/client'
import { Flashcard, StudySession, StudyStats } from '@/lib/types'
import { generateFlashcards } from './ai-service'

const supabase = createClient()

export class StudyService {
  /**
   * Generate flashcards from a note
   */
  static async generateFlashcardsFromNote(
    noteId: string,
    userId: string,
    count: number = 5,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): Promise<Flashcard[]> {
    try {
      // Get note content
      const { data: note, error: noteError } = await supabase
        .from('notes')
        .select('content')
        .eq('id', noteId)
        .eq('user_id', userId)
        .single()
      
      if (noteError || !note) {
        throw new Error('Note not found')
      }
      
      // Generate flashcards using AI service
      const aiResponse = await generateFlashcards({
        content: note.content,
        count,
        difficulty
      })
      
      // Insert flashcards into database
      const flashcardsToInsert = aiResponse.flashcards.map(card => ({
        note_id: noteId,
        user_id: userId,
        front_text: card.front,
        back_text: card.back,
        difficulty_level: card.difficulty
      }))
      
      const { data: flashcards, error: insertError } = await supabase
        .from('flashcards')
        .insert(flashcardsToInsert)
        .select()
      
      if (insertError) {
        throw new Error(insertError.message)
      }
      
      return flashcards || []
      
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to generate flashcards')
    }
  }
  
  /**
   * Get flashcards for study (spaced repetition)
   */
  static async getFlashcardsForStudy(userId: string, limit: number = 20): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review', new Date().toISOString())
      .order('next_review', { ascending: true })
      .limit(limit)
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data || []
  }
  
  /**
   * Get all flashcards for a user
   */
  static async getUserFlashcards(userId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data || []
  }
  
  /**
   * Update flashcard after study session (spaced repetition)
   */
  static async updateFlashcardAfterStudy(
    flashcardId: string,
    userId: string,
    quality: number // 0-5 scale
  ): Promise<void> {
    try {
      // Get current flashcard data
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', flashcardId)
        .eq('user_id', userId)
        .single()
      
      if (fetchError || !flashcard) {
        throw new Error('Flashcard not found')
      }
      
      // Calculate new interval using SM-2 algorithm
      let newInterval = flashcard.interval_days
      let newRepetitions = flashcard.repetitions
      let newEaseFactor = flashcard.ease_factor
      
      if (quality >= 3) {
        // Correct answer
        if (newRepetitions === 0) {
          newInterval = 1
        } else if (newRepetitions === 1) {
          newInterval = 6
        } else {
          newInterval = Math.round(newInterval * newEaseFactor)
        }
        newRepetitions += 1
      } else {
        // Incorrect answer - reset
        newRepetitions = 0
        newInterval = 1
      }
      
      // Update ease factor
      newEaseFactor = Math.max(1.3, newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
      
      // Calculate next review date
      const nextReview = new Date()
      nextReview.setDate(nextReview.getDate() + newInterval)
      
      // Update flashcard
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          interval_days: newInterval,
          repetitions: newRepetitions,
          ease_factor: newEaseFactor,
          next_review: nextReview.toISOString()
        })
        .eq('id', flashcardId)
        .eq('user_id', userId)
      
      if (updateError) {
        throw new Error(updateError.message)
      }
      
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update flashcard')
    }
  }
  
  /**
   * Create a study session
   */
  static async createStudySession(
    userId: string,
    sessionType: 'flashcards' | 'notes' | 'summary',
    durationMinutes: number,
    cardsStudied: number = 0,
    correctAnswers: number = 0,
    notesReviewed: number = 0
  ): Promise<StudySession> {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: userId,
        session_type: sessionType,
        duration_minutes: durationMinutes,
        cards_studied: cardsStudied,
        correct_answers: correctAnswers,
        notes_reviewed: notesReviewed
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data
  }
  
  /**
   * Get user's study statistics
   */
  static async getUserStudyStats(userId: string): Promise<StudyStats> {
    try {
      // Get basic counts
      const [notesResult, flashcardsResult, sessionsResult] = await Promise.all([
        supabase.from('notes').select('id, difficulty_level').eq('user_id', userId),
        supabase.from('flashcards').select('id').eq('user_id', userId),
        supabase.from('study_sessions').select('duration_minutes, created_at').eq('user_id', userId)
      ])
      
      if (notesResult.error) throw new Error(notesResult.error.message)
      if (flashcardsResult.error) throw new Error(flashcardsResult.error.message)
      if (sessionsResult.error) throw new Error(sessionsResult.error.message)
      
      const notes = notesResult.data || []
      const flashcards = flashcardsResult.data || []
      const sessions = sessionsResult.data || []
      
      // Calculate statistics
      const totalNotes = notes.length
      const totalFlashcards = flashcards.length
      const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration_minutes, 0)
      
      // Calculate streak (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const recentSessions = sessions.filter(session => 
        new Date(session.created_at) >= thirtyDaysAgo
      )
      
      const uniqueDays = new Set(
        recentSessions.map(session => 
          new Date(session.created_at).toDateString()
        )
      ).size
      
      const averageDifficulty = notes.length > 0 
        ? notes.reduce((sum, note) => sum + note.difficulty_level, 0) / notes.length
        : 0
      
      return {
        total_notes: totalNotes,
        total_flashcards: totalFlashcards,
        total_study_time: totalStudyTime,
        streak_days: uniqueDays,
        average_difficulty: averageDifficulty
      }
      
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get study stats')
    }
  }
  
  /**
   * Get recent study sessions
   */
  static async getRecentStudySessions(userId: string, limit: number = 10): Promise<StudySession[]> {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data || []
  }
  
  /**
   * Delete a flashcard
   */
  static async deleteFlashcard(flashcardId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId)
      .eq('user_id', userId)
    
    return !error
  }
  
  /**
   * Get flashcards by note
   */
  static async getFlashcardsByNote(noteId: string, userId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('note_id', noteId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data || []
  }
}

// Export individual functions for convenience
export const generateFlashcardsFromNote = StudyService.generateFlashcardsFromNote
export const getFlashcardsForStudy = StudyService.getFlashcardsForStudy
export const getUserFlashcards = StudyService.getUserFlashcards
export const updateFlashcardAfterStudy = StudyService.updateFlashcardAfterStudy
export const createStudySession = StudyService.createStudySession
export const getUserStudyStats = StudyService.getUserStudyStats
export const getRecentStudySessions = StudyService.getRecentStudySessions
export const deleteFlashcard = StudyService.deleteFlashcard
export const getFlashcardsByNote = StudyService.getFlashcardsByNote
