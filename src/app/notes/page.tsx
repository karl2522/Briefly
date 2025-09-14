'use client'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { Note } from '@/lib/types'
import { ArrowLeft, Edit, FileText, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NotesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [notes, setNotes] = useState<Note[]>([])
  const [loadingNotes, setLoadingNotes] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({ title: '', content: '' })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch notes",
          variant: "destructive",
        })
        return
      }

      setNotes(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoadingNotes(false)
    }
  }

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    try {
      const { error } = await supabase
        .from('notes')
        .insert({
          title: formData.title,
          content: formData.content,
          user_id: user.id,
        })

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create note",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Note created successfully!",
        variant: "success",
      })

      setFormData({ title: '', content: '' })
      setIsCreateDialogOpen(false)
      fetchNotes()
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleEditNote = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingNote) return

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: formData.title,
          content: formData.content,
        })
        .eq('id', editingNote.id)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update note",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Note updated successfully!",
        variant: "success",
      })

      setFormData({ title: '', content: '' })
      setEditingNote(null)
      setIsEditDialogOpen(false)
      fetchNotes()
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete note",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Note deleted successfully!",
        variant: "success",
      })

      fetchNotes()
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setFormData({ title: note.title, content: note.content })
    setIsEditDialogOpen(true)
  }

  if (loading || loadingNotes) {
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
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="hidden sm:flex items-center">
                <Logo size="sm" />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-700 truncate max-w-32 sm:max-w-none">
                {user.email?.split('@')[0]}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Notes</h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                Create, edit, and manage your community notes.
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 shadow-soft cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Create Note</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Note</DialogTitle>
                  <DialogDescription>
                    Add a new note to your collection.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateNote} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Note title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Write your note content here..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Note</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {notes.length === 0 ? (
            <Card className="shadow-soft border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-12 sm:py-16">
                <div className="p-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Get started by creating your first community note.
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="gradient-primary text-white hover:opacity-90 shadow-soft-lg cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Note
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {notes.map((note) => (
                <Card key={note.id} className="shadow-soft hover:shadow-soft-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 truncate">{note.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {new Date(note.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(note)}
                          className="h-8 w-8 p-0 border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteNote(note.id)}
                          className="h-8 w-8 p-0 border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                      {note.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Note</DialogTitle>
                <DialogDescription>
                  Update your note content.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditNote} className="space-y-4">
                <div>
                  <Input
                    placeholder="Note title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Write your note content here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setEditingNote(null)
                      setFormData({ title: '', content: '' })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Note</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
