# Briefly - Community Notes Platform

A modern, full-stack community notes application built with Next.js 15, Supabase, TypeScript, and Tailwind CSS. Features user authentication, note creation/editing/deletion, and a beautiful, responsive UI using Radix UI components.

## 🚀 Features

- **User Authentication**: Secure sign up and sign in with Supabase Auth
- **Note Management**: Create, read, update, and delete notes
- **Modern UI**: Beautiful, responsive design with Radix UI components
- **Real-time Updates**: Live updates using Supabase real-time subscriptions
- **Type Safety**: Full TypeScript support throughout the application
- **Production Ready**: Built with best practices for scalability and security

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **Backend**: Supabase (Database, Auth, Real-time)
- **Icons**: Lucide React
- **State Management**: React Context + Hooks

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd briefly
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Set Up Database Schema

Run the SQL from the `SUPABASE_SETUP.md` file in your Supabase SQL Editor:

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
```

### 4. Configure Authentication

In your Supabase dashboard:
1. Go to Authentication → Settings
2. Set Site URL to `http://localhost:3000`
3. Add Redirect URL: `http://localhost:3000/auth/callback`

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Authentication page
│   ├── notes/            # Notes management page
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
│   └── ui/              # Radix UI based components
├── contexts/            # React contexts
│   └── auth-context.tsx # Authentication context
├── hooks/               # Custom React hooks
│   └── use-toast.ts    # Toast notification hook
├── lib/                 # Utility functions and configurations
│   ├── supabase/       # Supabase client configurations
│   ├── types.ts        # TypeScript type definitions
│   └── utils.ts        # Utility functions
└── middleware.ts        # Next.js middleware for auth
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

The application uses a comprehensive set of Radix UI components:

- **Button** - Customizable button component
- **Card** - Container for content sections
- **Dialog** - Modal dialogs for forms
- **Input/Textarea** - Form input components
- **Toast** - Notification system
- **Tabs** - Tabbed interfaces

## 🔐 Authentication Flow

1. User visits the landing page
2. Redirected to login page if not authenticated
3. Can sign up or sign in using email/password
4. After authentication, redirected to dashboard
5. Protected routes are handled by middleware

## 📝 Notes Management

- **Create**: Add new notes with title and content
- **Read**: View all notes in a responsive grid
- **Update**: Edit existing notes in-place
- **Delete**: Remove notes with confirmation

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase auth settings with production URLs
5. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Detailed Supabase configuration
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend-as-a-service platform
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Lucide](https://lucide.dev/) for beautiful icons
