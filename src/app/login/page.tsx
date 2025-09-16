'use client'

import { LogoText } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { Check, Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AiOutlineBulb, AiOutlineFileText, AiOutlineRead } from 'react-icons/ai'
import { GoBook, GoChecklist, GoGraph } from 'react-icons/go'
import { PiBrainDuotone, PiHighlighterCircleDuotone } from 'react-icons/pi'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [school, setSchool] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [signInSuccess, setSignInSuccess] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [signInErrorShake, setSignInErrorShake] = useState(false)
  const [signUpErrorShake, setSignUpErrorShake] = useState(false)
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        setSignInErrorShake(true)
        setTimeout(() => setSignInErrorShake(false), 350)
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully!",
          variant: "success",
        })
        setSignInSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 450)
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: 'Enter your email', description: 'Provide the email you used to sign up.', variant: 'destructive' })
      return
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' })
      } else {
        toast({ title: 'Check your email', description: 'Password reset link sent.', variant: 'success' })
      }
    } catch {
      toast({ title: 'Error', description: 'Could not send reset link.', variant: 'destructive' })
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signUp(email, password, {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        school: school || undefined,
      })
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        setSignUpErrorShake(true)
        setTimeout(() => setSignUpErrorShake(false), 350)
      } else {
        toast({
          title: "Success",
          description: "Check your email for the confirmation link!",
          variant: "success",
        })
        setSignUpSuccess(true)
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive"
      })
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-80px] -right-24 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-200/20 blur-[100px]" />

      {/* Floating study-related icon clusters */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Cluster A - Book */}
        <div className="absolute left-[12%] top-[26%] will-change-transform" style={{ animation: 'float-y 12s ease-in-out infinite 1s' }}>
          <div className="will-change-transform" style={{ animation: 'drift-x 16s ease-in-out infinite 0s' }}>
            <div className="relative h-10 w-10 rounded-full bg-white/50 backdrop-blur border border-white/60 shadow-soft flex items-center justify-center animate-soft-pulse">
              <GoBook className="h-5 w-5 text-purple-700/80" />
              <span className="absolute inset-[-4px] rounded-full border border-purple-300/50 animate-slow-spin"></span>
            </div>
          </div>
        </div>

        {/* Cluster B - Brain */}
        <div className="absolute right-[14%] top-[22%] will-change-transform" style={{ animation: 'float-y 14s ease-in-out infinite 3s' }}>
          <div className="will-change-transform" style={{ animation: 'drift-x 20s ease-in-out infinite 0s' }}>
            <div className="relative h-12 w-12 rounded-full bg-white/50 backdrop-blur border border-white/60 shadow-soft flex items-center justify-center animate-soft-pulse">
              <PiBrainDuotone className="h-6 w-6 text-indigo-700/80" />
              <span className="absolute inset-[-5px] rounded-full border border-indigo-300/50 animate-slow-spin"></span>
            </div>
          </div>
        </div>

        {/* Cluster C - Checklist */}
        <div className="absolute left-[18%] bottom-[20%] will-change-transform" style={{ animation: 'float-y 10s ease-in-out infinite 5s' }}>
          <div className="will-change-transform" style={{ animation: 'drift-x 16s ease-in-out infinite 0s' }}>
            <div className="relative h-9 w-9 rounded-full bg-white/50 backdrop-blur border border-white/60 shadow-soft flex items-center justify-center animate-soft-pulse">
              <GoChecklist className="h-4 w-4 text-fuchsia-700/80" />
              <span className="absolute inset-[-3px] rounded-full border border-fuchsia-300/50 animate-slow-spin"></span>
            </div>
          </div>
        </div>

        {/* Cluster D - Read */}
        <div className="absolute right-[20%] bottom-[26%] will-change-transform" style={{ animation: 'float-y 14s ease-in-out infinite 7s' }}>
          <div className="will-change-transform" style={{ animation: 'drift-x 20s ease-in-out infinite 0s' }}>
            <div className="relative h-9 w-9 rounded-full bg-white/50 backdrop-blur border border-white/60 shadow-soft flex items-center justify-center rotate-12 animate-soft-pulse">
              <AiOutlineRead className="h-4 w-4 text-purple-800/80" />
              <span className="absolute inset-[-3px] rounded-full border border-purple-300/50 animate-slow-spin"></span>
            </div>
          </div>
        </div>

        {/* Cluster E */}
        <div className="absolute left-[8%] top-[50%] will-change-transform" style={{ animation: 'float-y 11s ease-in-out infinite 2s' }}>
          <div className="will-change-transform" style={{ animation: 'drift-x 18s ease-in-out infinite 0s' }}>
            <div className="relative h-8 w-8 rounded-full bg-white/50 backdrop-blur border border-white/60 shadow-soft flex items-center justify-center animate-soft-pulse">
              <GoGraph className="h-4 w-4 text-indigo-700/80" />
              <span className="absolute inset-[-3px] rounded-full border border-indigo-300/50 animate-slow-spin"></span>
            </div>
          </div>
        </div>

        {/* Cluster F */}
        <div className="absolute right-[10%] top-[55%] will-change-transform" style={{ animation: 'float-y 12s ease-in-out infinite 4s' }}>
          <div className="will-change-transform" style={{ animation: 'drift-x 16s ease-in-out infinite 0s' }}>
            <div className="relative h-8 w-8 rounded-full bg-white/50 backdrop-blur border border-white/60 shadow-soft flex items-center justify-center animate-soft-pulse">
              <PiHighlighterCircleDuotone className="h-4 w-4 text-fuchsia-700/80" />
              <span className="absolute inset-[-3px] rounded-full border border-fuchsia-300/50 animate-slow-spin"></span>
            </div>
          </div>
        </div>

        {/* Cluster G - File */}
        <div className="absolute left-[28%] top-[18%] will-change-transform" style={{ animation: 'float-y 13s ease-in-out infinite 1.5s' }}>
          <div className="will-change-transform" style={{ animation: 'drift-x 19s ease-in-out infinite 0s' }}>
            <div className="relative h-7 w-7 rounded-full bg-white/50 backdrop-blur border border-white/60 shadow-soft flex items-center justify-center animate-soft-pulse">
              <AiOutlineFileText className="h-3.5 w-3.5 text-purple-700/80" />
              <span className="absolute inset-[-2px] rounded-full border border-purple-300/50 animate-slow-spin"></span>
            </div>
          </div>
        </div>

        {/* Cluster H - Idea */}
        <div className="absolute right-[28%] bottom-[14%] will-change-transform" style={{ animation: 'float-y 10s ease-in-out infinite 6s' }}>
          <div className="will-change-transform" style={{ animation: 'drift-x 15s ease-in-out infinite 0s' }}>
            <div className="relative h-7 w-7 rounded-full bg-white/50 backdrop-blur border border-white/60 shadow-soft flex items-center justify-center animate-soft-pulse">
              <AiOutlineBulb className="h-3.5 w-3.5 text-fuchsia-700/80" />
              <span className="absolute inset-[-2px] rounded-full border border-fuchsia-300/50 animate-slow-spin"></span>
            </div>
          </div>
        </div>

        {/* Dotted connectors for depth */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden>
          <path d="M16% 30% C 26% 20%, 38% 24%, 48% 18%" className="stroke-purple-400/30 animate-dash" fill="none" strokeWidth="1" />
          <path d="M20% 78% C 30% 70%, 44% 68%, 62% 74%" className="stroke-fuchsia-400/25 animate-dash" fill="none" strokeWidth="1" />
          <path d="M76% 28% C 66% 36%, 58% 42%, 50% 40%" className="stroke-indigo-400/25 animate-dash" fill="none" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <LogoText className="text-2xl sm:text-3xl cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
          </div>
          <p className="mt-2 text-sm text-gray-600">Free AI Study Tools</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-full bg-white/60 backdrop-blur p-1 shadow-soft border border-white/50">
            <TabsTrigger value="signin" className="rounded-full text-gray-700 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 transition-colors">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-full text-gray-700 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 transition-colors">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="shadow-soft-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your email and password to sign in to your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="sr-only" htmlFor="signin-email">Email</label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-purple-400 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                    />
                  </div>
                  <div className="relative">
                    <label className="sr-only" htmlFor="signin-password">Password</label>
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10 border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-purple-400 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute inset-y-0 right-2 flex items-center rounded-md px-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100/60"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Lock className="h-3.5 w-3.5" /> Secure by Supabase Auth
                    </div>
                    <button type="button" onClick={handleForgotPassword} className="text-purple-700 hover:underline">Forgot password?</button>
                  </div>
                  <div className={`relative group ${signInErrorShake ? 'animate-shake' : ''}`}>
                    <div className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-purple-500/60 via-fuchsia-500/60 to-indigo-500/60 blur-md opacity-60 transition-opacity duration-300 group-hover:opacity-80 group-active:opacity-90 animate-pulse"></div>
                    <Button
                      type="submit"
                      className="relative w-full gradient-primary text-white hover:opacity-90 shadow-soft cursor-pointer transition-transform duration-200 active:scale-[0.98]"
                      disabled={loading}
                    >
                      <span className={`relative z-[1] flex items-center justify-center gap-2 transition-opacity ${signInSuccess ? 'opacity-0' : 'opacity-100'}`}>
                        {loading ? 'Signing in...' : 'Sign In'}
                      </span>
                      {/* success check overlay */}
                      <span aria-hidden className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${signInSuccess ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="flex items-center gap-2 text-white">
                          <Check className="h-4 w-4" />
                          <span>Success</span>
                        </span>
                      </span>
                      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
                        <span className="absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent transform translate-x-0 transition-transform duration-700 ease-out group-hover:translate-x-[200%]"></span>
                      </span>
                    </Button>
                  </div>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="group w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-purple-300 cursor-pointer transition"
                  >
                    {googleLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    ) : (
                      <svg className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-0.5" viewBox="0 0 24 24" aria-hidden>
                        <path fill="#4285F4" d="M23.49 12.27c0-.85-.08-1.67-.23-2.47H12v4.68h6.43a5.51 5.51 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.58-5.14 3.58-8.82z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.87-3c-1.08.72-2.46 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.94H1.24v3.11A12 12 0 0 0 12 24z"/>
                        <path fill="#FBBC05" d="M5.27 14.3A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.58.38-2.3V6.59H1.24A12 12 0 0 0 0 12c0 1.94.47 3.77 1.24 5.41l4.03-3.11z"/>
                        <path fill="#EA4335" d="M12 4.73c1.76 0 3.34.61 4.59 1.81l3.43-3.43C17.95 1.2 15.23 0 12 0 7.36 0 3.34 2.66 1.24 6.59l4.03 3.11C6.22 6.87 8.87 4.73 12 4.73z"/>
                        <path fill="none" d="M0 0h24v24H0z"/>
                      </svg>
                    )}
                    {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="shadow-soft-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create a new account to get started with Briefly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                    <Input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="School (optional)"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-purple-400 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-purple-400 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10 border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-purple-400 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute inset-y-0 right-2 flex items-center rounded-md px-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100/60"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500">Use 8+ characters with a mix of letters and numbers.</p>
                  <div className={`relative group ${signUpErrorShake ? 'animate-shake' : ''}`}>
                    <div className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-purple-500/60 via-fuchsia-500/60 to-indigo-500/60 blur-md opacity-60 transition-opacity duration-300 group-hover:opacity-80 group-active:opacity-90 animate-pulse"></div>
                    <Button type="submit" className="relative w-full gradient-primary text-white hover:opacity-90 shadow-soft cursor-pointer transition-transform duration-200 active:scale-[0.98]" disabled={loading}>
                      <span className={`relative z-[1] flex items-center justify-center gap-2 transition-opacity ${signUpSuccess ? 'opacity-0' : 'opacity-100'}`}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                      </span>
                      {/* success check overlay */}
                      <span aria-hidden className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${signUpSuccess ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="flex items-center gap-2 text-white">
                          <Check className="h-4 w-4" />
                          <span>Check email</span>
                        </span>
                      </span>
                      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
                        <span className="absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent transform translate-x-0 transition-transform duration-700 ease-out group-hover:translate-x-[200%]"></span>
                      </span>
                    </Button>
                  </div>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    {googleLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    ) : (
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" aria-hidden>
                        <path fill="#4285F4" d="M23.49 12.27c0-.85-.08-1.67-.23-2.47H12v4.68h6.43a5.51 5.51 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.58-5.14 3.58-8.82z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.87-3c-1.08.72-2.46 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.94H1.24v3.11A12 12 0 0 0 12 24z"/>
                        <path fill="#FBBC05" d="M5.27 14.3A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.58.38-2.3V6.59H1.24A12 12 0 0 0 0 12c0 1.94.47 3.77 1.24 5.41l4.03-3.11z"/>
                        <path fill="#EA4335" d="M12 4.73c1.76 0 3.34.61 4.59 1.81l3.43-3.43C17.95 1.2 15.23 0 12 0 7.36 0 3.34 2.66 1.24 6.59l4.03 3.11C6.22 6.87 8.87 4.73 12 4.73z"/>
                        <path fill="none" d="M0 0h24v24H0z"/>
                      </svg>
                    )}
                    {googleLoading ? 'Signing in...' : 'Sign up with Google'}
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
