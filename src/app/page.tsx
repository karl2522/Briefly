'use client'

import { LogoText } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, Bot, Brain, FileText, LogIn, Send, Upload, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function LandingPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      role: 'user',
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsTyping(true)

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I understand you want help with: "${userMessage.content}". I can help you with note-taking, summarization, creating flashcards, and studying strategies. What specific assistance do you need?`,
        role: 'assistant',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <Link href="/">
                <LogoText className="text-lg sm:text-xl" />
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 cursor-pointer"
                >
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Free AI Study Tools</h1>
            <p className="mt-2 text-gray-600">
              Upload documents, create notes, generate flashcards, and get instant help with your studies using AI.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Chat Assistant Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-lg h-[700px] flex flex-col">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">Briefly AI</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Get instant help with your studies
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-6">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="p-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Brain className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask me anything!</h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        I can help with note-taking, summarization, flashcards, and study strategies.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setChatInput("Help me create flashcards")}
                          className="text-xs cursor-pointer"
                        >
                          Create Flashcards
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setChatInput("Summarize this document")}
                          className="text-xs cursor-pointer"
                        >
                          Summarize
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setChatInput("Study tips")}
                          className="text-xs cursor-pointer"
                        >
                          Study Tips
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.role === 'assistant' && (
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex-shrink-0 w-8 h-8 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-purple-600" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.role === 'user' ? 'text-purple-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </p>
                          </div>
                          {message.role === 'user' && (
                            <div className="p-2 rounded-lg bg-gray-100 flex-shrink-0 w-8 h-8 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex gap-3 justify-start">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex-shrink-0 w-8 h-8 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="bg-gray-100 rounded-lg px-4 py-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
                
                <div className="border-t border-gray-100 p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about studying..."
                      className="flex-1 min-h-[40px] max-h-24 resize-none"
                      rows={1}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isTyping}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">AI Study Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 cursor-pointer hover:bg-purple-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">AI Notes</div>
                        <div className="text-sm text-gray-600">Create & summarize notes</div>
                      </div>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 cursor-pointer hover:bg-blue-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">AI Flashcards</div>
                        <div className="text-sm text-gray-600">Study with AI-generated cards</div>
                      </div>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 cursor-pointer hover:bg-orange-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100">
                        <Upload className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">File Upload</div>
                        <div className="text-sm text-gray-600">Process documents with AI</div>
                      </div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Why Choose Briefly?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-100 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">100% Free</p>
                    <p className="text-xs text-gray-600">No hidden costs or subscriptions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-blue-100 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">AI-Powered</p>
                    <p className="text-xs text-gray-600">Advanced AI for better learning</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-purple-100 mt-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Easy to Use</p>
                    <p className="text-xs text-gray-600">Intuitive interface for everyone</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <LogoText className="text-xl mb-4" />
              <p className="text-gray-600 text-sm mb-4 max-w-md">
                Free AI-powered study tools for students and professionals. 
                Upload documents, generate summaries, and create flashcards with the power of artificial intelligence.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">AI Tools</h3>
              <ul className="space-y-2">
                <li><a href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">AI Notes</a></li>
                <li><a href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">AI Flashcards</a></li>
                <li><a href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">File Upload</a></li>
                <li><a href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">AI Summarizer</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2024 Briefly. All rights reserved. Made with ❤️ for students.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-sm text-gray-500">Free AI Tools for Education</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}