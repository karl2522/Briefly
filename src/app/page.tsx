'use client'

import { LogoText } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { FileText, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <LogoText className="text-lg sm:text-xl" />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button className="gradient-primary text-white hover:opacity-90 shadow-soft">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Community Notes
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create, share, and collaborate on community notes. Build knowledge together 
            with a simple and powerful note-taking platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto gradient-primary text-white hover:opacity-90 shadow-soft-lg">
                Get Started Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-purple-200 text-purple-700 hover:bg-purple-50">
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-purple-600" />
                Create Notes
              </CardTitle>
              <CardDescription>
                Write and organize your thoughts with our intuitive note editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                Create rich, formatted notes with markdown support and organize them 
                with tags and categories.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-indigo-600" />
                Community Driven
              </CardTitle>
              <CardDescription>
                Share knowledge and collaborate with your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                Build collective knowledge by sharing notes and collaborating 
                with others in your community.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-6 w-6 mr-2 text-amber-500" />
                Fast & Reliable
              </CardTitle>
              <CardDescription>
                Lightning-fast performance with real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                Built with modern technology for fast, reliable performance 
                and seamless user experience.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join the community and start sharing your knowledge today.
          </p>
          <Link href="/login">
            <Button size="lg" className="gradient-primary text-white hover:opacity-90 shadow-soft-lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Briefly. Built with Next.js, Supabase, and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
