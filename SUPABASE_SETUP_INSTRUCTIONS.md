# Supabase Setup Instructions for Briefly Study Tool

Follow these steps to set up your Supabase database and storage for the Briefly study tool.

## 1. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `SUPABASE_STUDY_SCHEMA.sql`
4. Click **Run** to execute the SQL

This will create all the necessary tables:
- `notes` - Enhanced with study features
- `user_profiles` - User profile information
- `flashcards` - Spaced repetition flashcards
- `note_summaries` - AI-generated summaries
- `study_sessions` - Learning progress tracking
- `file_uploads` - File storage management
- `study_achievements` - Gamification system

## 2. Storage Setup

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Name: `note-files`
4. Make it **Public**: No (private bucket)
5. Click **Create bucket**

## 3. Storage Policies

After creating the bucket, go to **Storage** → **Policies** and add these policies:

### Policy 1: Users can upload their own files
```sql
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'note-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 2: Users can view their own files
```sql
CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'note-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 3: Users can delete their own files
```sql
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'note-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 4. Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 5. Authentication Setup

1. Go to **Authentication** → **Settings**
2. Set **Site URL** to: `http://localhost:3000`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/login`

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Try creating an account and logging in
4. Test creating notes and flashcards

## Troubleshooting

### If tables don't appear:
- Make sure you're running the SQL in the correct Supabase project
- Check the SQL Editor for any error messages
- Try running the SQL in smaller chunks if there are issues

### If file uploads don't work:
- Verify the storage bucket is created
- Check that the storage policies are applied correctly
- Ensure your environment variables are set correctly

### If authentication fails:
- Double-check your environment variables
- Verify the Site URL and Redirect URLs in Supabase
- Check the browser console for error messages

## Next Steps

Once the database is set up, you can:
1. Start using the study tool features
2. Upload files and create notes
3. Generate flashcards from your notes
4. Track your study progress
5. Customize your profile and settings

The study tool is now ready for use! 🎉
