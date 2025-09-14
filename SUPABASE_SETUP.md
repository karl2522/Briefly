# Supabase Setup Guide

This guide will help you set up Supabase for your Briefly Community Notes application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or sign in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: briefly-community-notes (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **Service role key** (optional, for server-side operations)

## 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 4. Create the Database Schema

### Option A: Using the Supabase Dashboard (Recommended)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL to create the notes table:

```sql
-- Create the notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for the notes table
CREATE POLICY "Users can view their own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create an index for better performance
CREATE INDEX notes_user_id_idx ON notes(user_id);
CREATE INDEX notes_created_at_idx ON notes(created_at DESC);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Option B: Using Supabase CLI

If you have the Supabase CLI installed:

1. Initialize Supabase in your project:
```bash
npx supabase init
```

2. Create a migration file:
```bash
npx supabase migration new create_notes_table
```

3. Add the SQL from Option A to the migration file

4. Apply the migration:
```bash
npx supabase db push
```

## 5. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following settings:

### Site URL
- Add your development URL: `http://localhost:3000`
- Add your production URL when you deploy

### Redirect URLs
- Add: `http://localhost:3000/auth/callback`
- Add your production callback URL when you deploy

### Email Templates (Optional)
- Customize the email templates for signup, password reset, etc.

## 6. Test Your Setup

1. Start your Next.js development server:
```bash
npm run dev
```

2. Visit `http://localhost:3000`
3. Try to sign up for a new account
4. Check your email for the confirmation link
5. Sign in and try creating a note

## 7. Security Considerations

### Row Level Security (RLS)
- RLS is enabled on the notes table
- Users can only access their own notes
- All policies are properly configured

### Environment Variables
- Never commit your `.env.local` file
- Use different credentials for development and production
- The service role key should only be used server-side

### API Keys
- The anon key is safe to use in client-side code
- The service role key bypasses RLS and should be kept secret

## 8. Production Deployment

When deploying to production:

1. Create a new Supabase project for production
2. Update your environment variables with production credentials
3. Set up proper redirect URLs in Supabase
4. Consider setting up a custom domain for your Supabase project

## 9. Additional Features (Optional)

### Real-time Subscriptions
To enable real-time updates for notes:

```sql
-- Enable real-time for the notes table
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
```

### Storage for File Attachments
If you want to add file uploads:

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `note-attachments`
3. Set up appropriate policies for file access

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check your redirect URLs and site URL settings
2. **Database queries failing**: Verify your RLS policies and user authentication
3. **Environment variables not loading**: Make sure your `.env.local` file is in the project root

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Review the [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
