'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/protected-route'

export default function CreateProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const createProfile = async () => {
    if (!user) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Create a basic profile
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          user_type: 'child', // Default to child
          display_name: user.email?.split('@')[0] || 'New User',
          bio: '',
          interests: [],
          age: null,
          grade_level: '',
          avatar_url: null
        })

      if (error) {
        // If it's a duplicate key error, the profile already exists
        if (error.code === '23505') {
          setSuccess('Profile already exists! Redirecting to profile page...')
          setTimeout(() => {
            router.push('/profile')
          }, 2000)
          return
        }
        throw error
      }

      setSuccess('Profile created successfully! Redirecting to profile page...')
      setTimeout(() => {
        router.push('/profile')
      }, 2000)

    } catch (error: any) {
      setError('Failed to create profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Create Profile</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Create your profile manually
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Profile Creation</CardTitle>
              <CardDescription>
                Create a basic profile for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium mb-2">Account Information</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Email:</strong> {user?.email}</div>
                  <div><strong>User ID:</strong> {user?.id}</div>
                </div>
              </div>

              {/* Default Profile Info */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium mb-2">Default Profile Settings</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Display Name:</strong> {user?.email?.split('@')[0] || 'New User'}</div>
                  <div><strong>User Type:</strong> Child</div>
                  <div><strong>Bio:</strong> (Empty)</div>
                  <div><strong>Interests:</strong> (Empty)</div>
                </div>
              </div>

              {/* Error & Success Messages */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  {success}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={createProfile} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating Profile...
                    </>
                  ) : (
                    'Create Profile'
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => router.push('/profile-test')}
                  className="w-full"
                >
                  Test Profile System
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="mt-6 text-center">
            <Badge variant="secondary" className="text-xs">
              🔧 Manual Profile Creation
            </Badge>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
