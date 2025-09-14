-- Briefly Study Tool - Enhanced Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Update existing notes table with study features
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_type TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
ADD COLUMN IF NOT EXISTS study_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_studied TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- 2. Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  study_goals TEXT,
  daily_goal_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  ease_factor REAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create note_summaries table
CREATE TABLE IF NOT EXISTS note_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  summary_text TEXT NOT NULL,
  key_points TEXT[] DEFAULT '{}',
  ai_model TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('flashcards', 'notes', 'summary')),
  duration_minutes INTEGER NOT NULL,
  cards_studied INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  notes_reviewed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create file_uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  extracted_text TEXT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create study_achievements table
CREATE TABLE IF NOT EXISTS study_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, achievement_type)
);

-- 8. Enable Row Level Security (RLS) on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_achievements ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 10. Create RLS policies for flashcards
CREATE POLICY "Users can view their own flashcards" ON flashcards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own flashcards" ON flashcards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards" ON flashcards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards" ON flashcards
  FOR DELETE USING (auth.uid() = user_id);

-- 11. Create RLS policies for note_summaries
CREATE POLICY "Users can view their own summaries" ON note_summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own summaries" ON note_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own summaries" ON note_summaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own summaries" ON note_summaries
  FOR DELETE USING (auth.uid() = user_id);

-- 12. Create RLS policies for study_sessions
CREATE POLICY "Users can view their own sessions" ON study_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 13. Create RLS policies for file_uploads
CREATE POLICY "Users can view their own uploads" ON file_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploads" ON file_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads" ON file_uploads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads" ON file_uploads
  FOR DELETE USING (auth.uid() = user_id);

-- 14. Create RLS policies for study_achievements
CREATE POLICY "Users can view their own achievements" ON study_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON study_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 15. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_notes_difficulty ON notes(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_notes_last_studied ON notes(last_studied);

CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_note_id ON flashcards(note_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON flashcards(next_review);

CREATE INDEX IF NOT EXISTS idx_note_summaries_user_id ON note_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_note_summaries_note_id ON note_summaries(note_id);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_created_at ON study_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_note_id ON file_uploads(note_id);

-- 16. Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 17. Create triggers for updated_at
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON flashcards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_note_summaries_updated_at BEFORE UPDATE ON note_summaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_file_uploads_updated_at BEFORE UPDATE ON file_uploads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 18. Create function to generate flashcards from notes
CREATE OR REPLACE FUNCTION generate_flashcards_from_note(
  p_note_id UUID,
  p_user_id UUID,
  p_count INTEGER DEFAULT 5
)
RETURNS TABLE(flashcard_id UUID) AS $$
DECLARE
  note_content TEXT;
  i INTEGER;
BEGIN
  -- Get note content
  SELECT content INTO note_content FROM notes WHERE id = p_note_id AND user_id = p_user_id;
  
  IF note_content IS NULL THEN
    RAISE EXCEPTION 'Note not found or access denied';
  END IF;
  
  -- Generate placeholder flashcards (in real implementation, this would call AI)
  FOR i IN 1..p_count LOOP
    INSERT INTO flashcards (note_id, user_id, front_text, back_text)
    VALUES (
      p_note_id,
      p_user_id,
      'Question ' || i || ' from note',
      'Answer ' || i || ' - This would be generated by AI'
    );
  END LOOP;
  
  -- Return generated flashcard IDs
  RETURN QUERY SELECT id FROM flashcards WHERE note_id = p_note_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 19. Create function to calculate study statistics
CREATE OR REPLACE FUNCTION get_user_study_stats(p_user_id UUID)
RETURNS TABLE(
  total_notes INTEGER,
  total_flashcards INTEGER,
  total_study_time INTEGER,
  streak_days INTEGER,
  average_difficulty REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM notes WHERE user_id = p_user_id) as total_notes,
    (SELECT COUNT(*)::INTEGER FROM flashcards WHERE user_id = p_user_id) as total_flashcards,
    (SELECT COALESCE(SUM(duration_minutes), 0)::INTEGER FROM study_sessions WHERE user_id = p_user_id) as total_study_time,
    (SELECT COUNT(DISTINCT DATE(created_at))::INTEGER FROM study_sessions WHERE user_id = p_user_id AND created_at >= NOW() - INTERVAL '30 days') as streak_days,
    (SELECT COALESCE(AVG(difficulty_level), 0)::REAL FROM notes WHERE user_id = p_user_id) as average_difficulty;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
