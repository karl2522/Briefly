'use client'

import { LogoText } from '@/components/logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/auth-context'
import { ArrowRight, BookOpen, ChevronDown, Clock, FileText, LogOut, Plus, TrendingUp, User, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const confirmSignOut = () => {
    setShowSignOutDialog(true)
  }

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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <LogoText className="text-lg sm:text-xl" />
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 cursor-pointer flex items-center gap-2"
                  >
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline truncate max-w-24">
                      {user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-xl">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <DropdownMenuItem 
                      onClick={confirmSignOut}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                Manage your community notes and stay organized.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Link href="/notes">
                <Button size="sm" className="gradient-primary text-white hover:opacity-90 shadow-soft cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">New Note</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 relative z-10">
          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">This Week</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-2 rounded-lg bg-indigo-100">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              </div>
            </div>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Recent</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
            </div>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Community</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10">
          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group cursor-pointer">
            <Link href="/notes" className="block">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">My Notes</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  View and manage all your personal notes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    View All
                  </Badge>
                  <span className="text-xs text-gray-500">0 notes</span>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group cursor-pointer">
            <Link href="/notes" className="block">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">Create Note</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Start writing a new community note
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                    Quick Create
                  </Badge>
                  <span className="text-xs text-gray-500">Ready to write</span>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group cursor-pointer sm:col-span-2 lg:col-span-1">
            <div className="block">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="text-gray-500">
                    Coming Soon
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">Community</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Discover and collaborate on community notes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Feature in development</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group cursor-pointer">
            <Link href="/flashcards" className="block">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">Flashcards</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Study with AI-generated flashcards
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Study Mode
                  </Badge>
                  <span className="text-xs text-gray-500">0 cards</span>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group cursor-pointer">
            <Link href="/profile" className="block">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110 transition-transform duration-300">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">Profile</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Manage your account and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Settings
                  </Badge>
                  <span className="text-xs text-gray-500">Manage</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="w-full relative z-10">
          <Card className="shadow-soft border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Your latest notes and updates
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-gray-500">
                  No activity
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 sm:py-16 text-gray-500">
                <div className="p-6 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No activity yet</h3>
                <p className="text-base mb-6 max-w-md mx-auto">Create your first note to get started and see your activity here!</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/notes">
                    <Button className="gradient-primary text-white hover:opacity-90 shadow-soft-lg cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Note
                    </Button>
                  </Link>
                  <Link href="/notes">
                    <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 cursor-pointer">
                      <FileText className="h-4 w-4 mr-2" />
                      View Notes
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Sign Out Confirmation Dialog */}
      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-600" />
              Sign Out
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to access your notes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSignOutDialog(false)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
