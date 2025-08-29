'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Loader2, CheckCircle, XCircle, Database } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/protected-route'

export default function DbCheckPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profiles, setProfiles] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (user) {
      checkDatabase()
    }
  }, [user])

  const checkDatabase = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Get all profiles (for debugging)
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('*')
        .limit(10)

      if (allError) throw allError

      setProfiles(allProfiles || [])

      // Get specific user profile
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is "not found" error
          throw profileError
        }

        setUserProfile(profile)
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p>Checking database...</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Database className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Database Check</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Checking profiles table contents
            </p>
          </div>

          {/* User Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current User</CardTitle>
              <CardDescription>
                Your authentication details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>User ID:</strong> {user?.id}</div>
                <div><strong>Email:</strong> {user?.email}</div>
                <div><strong>Created:</strong> {user?.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown'}</div>
              </div>
            </CardContent>
          </Card>

          {/* User Profile */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {userProfile ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                <span>Your Profile</span>
              </CardTitle>
              <CardDescription>
                Profile record for your user ID
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Display Name:</strong> {userProfile.display_name}</div>
                    <div><strong>User Type:</strong> {userProfile.user_type}</div>
                    <div><strong>Age:</strong> {userProfile.age || 'Not set'}</div>
                    <div><strong>Grade:</strong> {userProfile.grade_level || 'Not set'}</div>
                  </div>
                  <div>
                    <strong>Bio:</strong> {userProfile.bio || 'Not set'}
                  </div>
                  <div>
                    <strong>Interests:</strong> {userProfile.interests?.length > 0 ? userProfile.interests.join(', ') : 'None'}
                  </div>
                  <div>
                    <strong>Created:</strong> {new Date(userProfile.created_at).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 font-medium">No profile found for your user ID</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This means the automatic profile creation didn't work
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Profiles */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>All Profiles in Database</CardTitle>
              <CardDescription>
                First 10 profiles (for debugging)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profiles.length > 0 ? (
                <div className="space-y-4">
                  {profiles.map((profile, index) => (
                    <div key={profile.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Profile {index + 1}</span>
                        <Badge variant={profile.user_id === user?.id ? 'default' : 'outline'}>
                          {profile.user_id === user?.id ? 'Yours' : 'Other'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>ID:</strong> {profile.id}</div>
                        <div><strong>User ID:</strong> {profile.user_id}</div>
                        <div><strong>Name:</strong> {profile.display_name}</div>
                        <div><strong>Type:</strong> {profile.user_type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No profiles found in database</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Fix profile issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Button onClick={checkDatabase} className="flex-1">
                  Refresh Data
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <a href="/create-profile">Create Profile</a>
                </Button>
              </div>
              
              {!userProfile && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">Profile Missing</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your profile doesn't exist. Click "Create Profile" to create one manually.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
