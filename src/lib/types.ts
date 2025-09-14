export interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export interface Note {
  id: string
  title: string
  content: string
  user_id: string
  file_url?: string
  file_name?: string
  file_type?: string
  tags: string[]
  difficulty_level: number
  study_count: number
  last_studied?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  study_goals?: string
  daily_goal_minutes: number
  created_at: string
  updated_at: string
}

export interface Flashcard {
  id: string
  note_id: string
  user_id: string
  front_text: string
  back_text: string
  difficulty_level: number
  ease_factor: number
  interval_days: number
  repetitions: number
  next_review: string
  created_at: string
  updated_at: string
}

export interface NoteSummary {
  id: string
  note_id: string
  user_id: string
  summary_text: string
  key_points: string[]
  ai_model?: string
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  user_id: string
  session_type: 'flashcards' | 'notes' | 'summary'
  duration_minutes: number
  cards_studied: number
  correct_answers: number
  notes_reviewed: number
  created_at: string
}

export interface FileUpload {
  id: string
  user_id: string
  note_id?: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  extracted_text?: string
  processing_status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface StudyAchievement {
  id: string
  user_id: string
  achievement_type: string
  achievement_name: string
  description?: string
  earned_at: string
}

export interface StudyStats {
  total_notes: number
  total_flashcards: number
  total_study_time: number
  streak_days: number
  average_difficulty: number
}

// AI Integration Types
export interface AISummaryRequest {
  content: string
  maxLength?: number
  style?: 'bullet' | 'paragraph' | 'outline'
}

export interface AISummaryResponse {
  summary: string
  key_points: string[]
  confidence: number
}

export interface AIFlashcardRequest {
  content: string
  count?: number
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface AIFlashcardResponse {
  flashcards: {
    front: string
    back: string
    difficulty: number
  }[]
}

// File Upload Types
export interface FileUploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

export interface SupportedFileType {
  type: string
  extensions: string[]
  maxSize: number // in bytes
}

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: Note
        Insert: Omit<Note, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
      }
      flashcards: {
        Row: Flashcard
        Insert: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Flashcard, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
      }
      note_summaries: {
        Row: NoteSummary
        Insert: Omit<NoteSummary, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NoteSummary, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
      }
      study_sessions: {
        Row: StudySession
        Insert: Omit<StudySession, 'id' | 'created_at'>
        Update: Partial<Omit<StudySession, 'id' | 'created_at' | 'user_id'>>
      }
      file_uploads: {
        Row: FileUpload
        Insert: Omit<FileUpload, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FileUpload, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
      }
      study_achievements: {
        Row: StudyAchievement
        Insert: Omit<StudyAchievement, 'id' | 'earned_at'>
        Update: Partial<Omit<StudyAchievement, 'id' | 'earned_at' | 'user_id'>>
      }
    }
  }
}
