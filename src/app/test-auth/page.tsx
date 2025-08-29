'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Brain, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function TestAuthPage() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('testpassword123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleTestSignUp = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await signUp(email, password, 'child')
      setSuccess('Test account created! Check your email for verification link.')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTestSignIn = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await signIn(email, password)
      setSuccess('Sign in successful! Redirecting to dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSkipVerification = () => {
    setSuccess('For testing: You can manually verify the email in Supabase dashboard or use a real email address.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-primary hover:opacity-80">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Test Auth Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Test Authentication</CardTitle>
            <CardDescription>
              Test the authentication system with pre-filled credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Pre-filled Credentials */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Test Credentials:</span>
                </div>
                <div className="text-sm space-y-1">
                  <div><strong>Email:</strong> test@example.com</div>
                  <div><strong>Password:</strong> testpassword123</div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="testpassword123"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  {success}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleTestSignUp} 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Test Account'}
                </Button>

                <Button 
                  onClick={handleTestSignIn} 
                  variant="outline" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In with Test Account'}
                </Button>

                <Button 
                  onClick={handleSkipVerification} 
                  variant="ghost" 
                  className="w-full text-sm"
                >
                  Skip Email Verification (Testing)
                </Button>
              </div>

              {/* Email Verification Info */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Email Verification Required</p>
                    <p className="mt-1">After creating an account, check your email for the verification link. If the link doesn't work, try using a real email address or check your spam folder.</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex space-x-4">
                <Button variant="outline" asChild className="flex-1">
                  <a href="/login">Go to Login Page</a>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <a href="/dashboard">Try Dashboard</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Badge */}
        <div className="mt-6 text-center">
          <Badge variant="secondary" className="text-xs">
            🔒 Test Environment - Safe for Development
          </Badge>
        </div>
      </div>
    </div>
  )
}
