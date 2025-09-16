"use client"

import { LogoText } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Brain, Check, CheckCircle, FileText, LogIn, Quote, ShieldCheck, Sparkles, Star, Timer, Upload, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Top Nav */}
      <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/">
              <LogoText className="text-lg sm:text-xl" />
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <LogIn className="h-4 w-4 mr-2" /> Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-3 py-1 text-xs text-purple-700 shadow-soft">
                <Sparkles className="h-3.5 w-3.5" /> New: Flashcards and AI Summaries
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                AI tools that make studying
                <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">faster, smarter, and stress-free.</span>
              </h1>
              <p className="mt-4 text-gray-700 text-base sm:text-lg max-w-2xl">
                Upload a document and get clean notes, flashcards, and concise summaries in seconds.
              </p>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-purple-600" /> 3x faster review vs manual notes</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-purple-600" /> Your files stay private</li>
                <li className="flex items-center gap-2"><Star className="h-4 w-4 text-purple-600" /> High‑quality, citation‑ready summaries</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-600" /> Export to flashcards in one click</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="cursor-pointer">Try it now</Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" /> No credit card required
                </div>
                <div className="h-4 w-px bg-gray-300 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" /> Trusted by 1,200+ students
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <Card className="shadow-soft-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg">See it in action</CardTitle>
                  <CardDescription>Upload a doc → Get summarized notes in seconds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border bg-white shadow-soft overflow-hidden">
                    {/* Browser chrome */}
                    <div className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-r from-slate-50 to-white">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[60%]">briefly.app/dashboard</div>
                      <div className="h-3 w-12 bg-gray-200 rounded"></div>
                    </div>

                    {/* App preview */}
                    <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr]">
                      {/* Sidebar */}
                      <div className="border-r p-2 space-y-2 bg-slate-50/60">
                        <button className="w-full flex items-center gap-1.5 rounded-md border bg-white px-2 py-2 text-left text-xs text-gray-700 hover:bg-purple-50 overflow-hidden whitespace-nowrap">
                          <FileText className="h-4 w-4 text-purple-600" /> AI Notes
                        </button>
                        <button className="w-full flex items-center gap-1.5 rounded-md border bg-white px-2 py-2 text-left text-xs text-gray-700 hover:bg-blue-50 overflow-hidden whitespace-nowrap">
                          <BookOpen className="h-4 w-4 text-blue-600" /> Flashcards
                        </button>
                        <button className="w-full flex items-center gap-1.5 rounded-md border bg-white px-2 py-2 text-left text-xs text-gray-700 hover:bg-orange-50 overflow-hidden whitespace-nowrap">
                          <Upload className="h-4 w-4 text-orange-600" /> Upload
                        </button>
                      </div>

                      {/* Main */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">AI Study Assistant</p>
                            <p className="text-xs text-gray-500">Summaries • Notes • Flashcards</p>
                          </div>
                          <div className="text-[10px] text-gray-500">Preview</div>
                        </div>

                        {/* Chat area mock */}
                        <div className="h-44 sm:h-52 rounded-lg border bg-white p-3 space-y-2 overflow-hidden">
                          <div className="flex gap-2 items-start">
                            <div className="h-6 w-6 rounded-md bg-purple-100 flex items-center justify-center">
                              <Brain className="h-3.5 w-3.5 text-purple-600" />
                            </div>
                            <div className="max-w-[80%] rounded-md bg-gray-100 px-3 py-2">
                              <p className="text-xs text-gray-800">Upload a PDF and I’ll produce a 5‑minute summary and key terms.</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-start justify-end">
                            <div className="max-w-[80%] rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-white">
                              <p className="text-xs">Summarize chapter 3 and make 10 flashcards.</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-start">
                            <div className="h-6 w-6 rounded-md bg-purple-100 flex items-center justify-center">
                              <Brain className="h-3.5 w-3.5 text-purple-600" />
                            </div>
                            <div className="max-w-[85%] rounded-md bg-gray-100 px-3 py-2">
                              <p className="text-xs text-gray-800"><span className="font-medium">Summary:</span> Chapter 3 introduces …</p>
                              <p className="mt-1 text-[11px] text-gray-600">• Core concepts A, B, C • Key formula • 5 takeaways</p>
                            </div>
                          </div>
                        </div>

                        {/* Input */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-9 rounded-md border bg-white px-3 text-xs text-gray-500 flex items-center">Ask a question or paste text…</div>
                          <button className="h-9 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-3 text-xs text-white">Send</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <div className="p-2 rounded-md bg-purple-100 w-fit mb-2"><FileText className="h-5 w-5 text-purple-600" /></div>
                <CardTitle>AI Note Maker</CardTitle>
                <CardDescription>Create concise, well-structured notes from any document.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <div className="p-2 rounded-md bg-blue-100 w-fit mb-2"><BookOpen className="h-5 w-5 text-blue-600" /></div>
                <CardTitle>Flashcards</CardTitle>
                <CardDescription>Turn notes into smart, spaced-repetition flashcards.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <div className="p-2 rounded-md bg-indigo-100 w-fit mb-2"><Brain className="h-5 w-5 text-indigo-600" /></div>
                <CardTitle>Summarizer</CardTitle>
                <CardDescription>Instant summaries that keep the key insights.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <div className="p-2 rounded-md bg-emerald-100 w-fit mb-2"><Sparkles className="h-5 w-5 text-emerald-600" /></div>
                <CardTitle>Study Planner (Coming Soon)</CardTitle>
                <CardDescription>Personalized plans and quiz generator to master topics.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Built for how you study</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cramming for exams */}
            <Card className="border-0 shadow-soft bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-md bg-amber-100"><Timer className="h-5 w-5 text-amber-600" /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Cramming for exams</h3>
                    <p className="text-sm text-gray-600">Get short, clear notes so you can review fast.</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-600 mt-0.5" /> Auto‑highlight key definitions and formulas</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-600 mt-0.5" /> One‑page cheat sheets from long docs</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-600 mt-0.5" /> Time‑boxed summaries (2, 5, 10 min)</li>
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Avg 3× faster review</span>
                  <Link href="/login"><Button size="sm" variant="outline" className="cursor-pointer">Try summarizer</Button></Link>
                </div>
              </CardContent>
            </Card>

            {/* Group flashcards */}
            <Card className="border-0 shadow-soft bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-md bg-blue-100"><Users className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Making flashcards for group study</h3>
                    <p className="text-sm text-gray-600">Generate cards in one click and share with your team.</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-600 mt-0.5" /> Smart cloze deletions and distractors</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-600 mt-0.5" /> Export to Anki or use built‑in review</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-600 mt-0.5" /> Share sets with a link</li>
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Team‑ready in minutes</span>
                  <Link href="/login"><Button size="sm" variant="outline" className="cursor-pointer">Build flashcards</Button></Link>
                </div>
              </CardContent>
            </Card>

            {/* Summarizing readings */}
            <Card className="border-0 shadow-soft bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-md bg-indigo-100"><BookOpen className="h-5 w-5 text-indigo-600" /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Summarizing long readings</h3>
                    <p className="text-sm text-gray-600">Turn dense articles into approachable bullet points.</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-600 mt-0.5" /> Section‑by‑section breakdowns with citations</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-600 mt-0.5" /> Extract figures, tables, and key arguments</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-600 mt-0.5" /> Translate and simplify technical language</li>
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Keep the key insights</span>
                  <Link href="/login"><Button size="sm" variant="outline" className="cursor-pointer">Summarize a PDF</Button></Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What students say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <Card key={i} className="border-0 shadow-soft bg-white">
                <CardContent className="p-6">
                  <Quote className="h-5 w-5 text-purple-600 mb-3" />
                  <p className="text-gray-700">“This saved me hours. I uploaded lecture slides and got clean notes and flashcards instantly.”</p>
                  <p className="mt-4 text-sm text-gray-500">— Student, Computer Science</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-soft-lg p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-10">
              {/* Left: Narrative + proof */}
              <div className="md:col-span-7">
                <h3 className="text-3xl font-semibold leading-tight">Start studying smarter today</h3>
                <p className="text-white/85 mt-3 text-base">Create your first summary in under 2 minutes. No credit card required.</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg bg-white/10 ring-1 ring-white/20 px-4 py-3">
                    <p className="text-sm font-medium">Private by default</p>
                    <p className="text-xs text-white/80">Your files stay on your account</p>
                  </div>
                  <div className="rounded-lg bg-white/10 ring-1 ring-white/20 px-4 py-3">
                    <p className="text-sm font-medium">Export anywhere</p>
                    <p className="text-xs text-white/80">Notes & flashcards in seconds</p>
                  </div>
                  <div className="rounded-lg bg-white/10 ring-1 ring-white/20 px-4 py-3">
                    <p className="text-sm font-medium">Quick sign in</p>
                    <p className="text-xs text-white/80">Google login supported</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-300"></span> No setup needed</div>
                  <div className="hidden sm:flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-300"></span> Free forever plan</div>
                </div>
              </div>

              {/* Right: Action card */}
              <div className="md:col-span-5">
                <div className="rounded-2xl bg-white shadow-soft-lg p-6">
                  <p className="text-gray-900 text-lg font-semibold">Join Briefly free</p>
                  <p className="text-gray-600 text-sm mt-1">Summaries, notes, and flashcards included.</p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Link href="/login" className="contents">
                      <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer">Get Started Free</Button>
                    </Link>
                    <Link href="/login" className="contents">
                      <Button size="lg" variant="outline" className="w-full border-gray-300 text-gray-800 hover:bg-gray-50 cursor-pointer">Try without account</Button>
                    </Link>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>No credit card</span>
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <LogoText className="text-xl mb-4" />
              <p className="text-gray-600 text-sm mb-4 max-w-md">
                Free AI-powered study tools for students and professionals. Upload documents, generate summaries, and create flashcards.
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
              <p className="text-sm text-gray-500">© 2024 Briefly. All rights reserved.</p>
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