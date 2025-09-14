'use client'

import { LogoText } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { getUserStudyStats } from '@/lib/study-service'
import { createClient } from '@/lib/supabase/client'
import { StudyStats, UserProfile } from '@/lib/types'
import {
    ArrowLeft,
    Camera,
    Download,
    Edit,
    Save,
    Settings,
    Shield,
    TrendingUp,
    User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  // State
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    study_goals: '',
    daily_goal_minutes: 30
  })
  
  // Settings state
  const [settings, setSettings] = useState({
    email_notifications: true,
    study_reminders: true,
    weekly_reports: true,
    public_profile: false
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    
    if (user) {
      loadProfileData()
    }
  }, [user, loading, router])

  const loadProfileData = async () => {
    try {
      setIsLoading(true)
      
      // Load user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user!.id)
        .single()
      
      if (profileData) {
        setProfile(profileData)
        setFormData({
          username: profileData.username || '',
          full_name: profileData.full_name || '',
          bio: profileData.bio || '',
          study_goals: profileData.study_goals || '',
          daily_goal_minutes: profileData.daily_goal_minutes || 30
        })
      } else {
        // Create default profile
        const defaultProfile = {
          id: user!.id,
          username: user!.email?.split('@')[0] || '',
          full_name: user!.user_metadata?.full_name || '',
          avatar_url: user!.user_metadata?.avatar_url || '',
          bio: '',
          study_goals: '',
          daily_goal_minutes: 30
        }
        
        const { data: newProfile } = await supabase
          .from('user_profiles')
          .insert(defaultProfile)
          .select()
          .single()
        
        setProfile(newProfile)
        setFormData({
          username: newProfile.username || '',
          full_name: newProfile.full_name || '',
          bio: newProfile.bio || '',
          study_goals: newProfile.study_goals || '',
          daily_goal_minutes: newProfile.daily_goal_minutes || 30
        })
      }
      
      // Load study stats
      const stats = await getUserStudyStats(user!.id)
      setStudyStats(stats)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio,
          study_goals: formData.study_goals,
          daily_goal_minutes: formData.daily_goal_minutes
        })
        .eq('id', user!.id)
      
      if (error) {
        throw error
      }
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...formData } : null)
      setIsEditing(false)
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success"
      })
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      // Get all user data
      const [notesData, flashcardsData, sessionsData] = await Promise.all([
        supabase.from('notes').select('*').eq('user_id', user!.id),
        supabase.from('flashcards').select('*').eq('user_id', user!.id),
        supabase.from('study_sessions').select('*').eq('user_id', user!.id)
      ])
      
      const exportData = {
        profile: profile,
        notes: notesData.data || [],
        flashcards: flashcardsData.data || [],
        study_sessions: sessionsData.data || [],
        exported_at: new Date().toISOString()
      }
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `briefly-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Export Complete",
        description: "Your data has been downloaded",
        variant: "success"
      })
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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
                onClick={handleExportData}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-soft border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Manage your personal information and study preferences
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profile?.full_name || 'User'}
                    </h3>
                    <p className="text-gray-600">@{profile?.username || user?.email?.split('@')[0]}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="study_goals">Study Goals</Label>
                    <Textarea
                      id="study_goals"
                      value={formData.study_goals}
                      onChange={(e) => setFormData(prev => ({ ...prev, study_goals: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="What are your learning goals?"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="daily_goal">Daily Study Goal (minutes)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[formData.daily_goal_minutes]}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, daily_goal_minutes: value[0] }))}
                        max={120}
                        min={5}
                        step={5}
                        disabled={!isEditing}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-600">
                        {formData.daily_goal_minutes} minutes per day
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card className="shadow-soft border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Study Statistics
                </CardTitle>
                <CardDescription>
                  Your learning progress and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {studyStats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {studyStats.total_notes}
                      </div>
                      <div className="text-sm text-gray-600">Total Notes</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {studyStats.total_flashcards}
                      </div>
                      <div className="text-sm text-gray-600">Flashcards</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {studyStats.total_study_time}m
                      </div>
                      <div className="text-sm text-gray-600">Study Time</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">
                        {studyStats.streak_days}
                      </div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No statistics available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-soft border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Preferences
                </CardTitle>
                <CardDescription>
                  Customize your study experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive updates about your study progress</p>
                    </div>
                    <Switch
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Study Reminders</Label>
                      <p className="text-sm text-gray-600">Get reminded to study daily</p>
                    </div>
                    <Switch
                      checked={settings.study_reminders}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, study_reminders: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Weekly Reports</Label>
                      <p className="text-sm text-gray-600">Receive weekly progress summaries</p>
                    </div>
                    <Switch
                      checked={settings.weekly_reports}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weekly_reports: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Public Profile</Label>
                      <p className="text-sm text-gray-600">Allow others to see your study progress</p>
                    </div>
                    <Switch
                      checked={settings.public_profile}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, public_profile: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Account Security</h4>
                    <p className="text-sm text-gray-600">Your account is secured with Supabase Auth</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Data Export</h4>
                    <p className="text-sm text-gray-600">Download all your data</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExportData}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
