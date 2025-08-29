'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/protected-route'

export default function ProfileTestPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState<any>(null)
  const [testResults, setTestResults] = useState<{
    userExists: boolean
    profileExists: boolean
    profileFields: string[]
    error: string
  }>({
    userExists: false,
    profileExists: false,
    profileFields: [],
    error: ''
  })

  useEffect(() => {
    if (user) {
      testProfileLoading()
    }
  }, [user])

  const testProfileLoading = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Test 1: Check if user exists
      const userExists = !!user
      
      // Test 2: Try to load profile
      let profileExists = false
      let profileFields: string[] = []
      let profileError = ''
      
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (error) {
            profileError = error.message
          } else if (data) {
            profileExists = true
            profileFields = Object.keys(data)
            setProfileData(data)
          }
        } catch (err: any) {
          profileError = err.message
        }
      }

      setTestResults({
        userExists,
        profileExists,
        profileFields,
        error: profileError
      })

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: boolean) => {
    return status ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p>Testing profile system...</p>
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
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Profile System Test</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Debugging profile loading issues
            </p>
          </div>

          {/* Test Results */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <span>Test Results</span>
              </CardTitle>
              <CardDescription>
                Checking profile system components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Test */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(testResults.userExists)}
                  <span className="font-medium">User Authentication:</span>
                </div>
                <Badge className={getStatusColor(testResults.userExists)}>
                  {testResults.userExists ? 'Authenticated' : 'Not Authenticated'}
                </Badge>
              </div>

              {/* Profile Test */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(testResults.profileExists)}
                  <span className="font-medium">Profile Record:</span>
                </div>
                <Badge className={getStatusColor(testResults.profileExists)}>
                  {testResults.profileExists ? 'Found' : 'Not Found'}
                </Badge>
              </div>

              {/* Error Display */}
              {testResults.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">Error:</p>
                  <p className="text-sm text-red-600 mt-1">{testResults.error}</p>
                </div>
              )}

              {/* Profile Fields */}
              {testResults.profileExists && testResults.profileFields.length > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Profile Fields Found:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {testResults.profileFields.map(field => (
                      <Badge key={field} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Data Display */}
          {profileData && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Profile Data</CardTitle>
                <CardDescription>
                  Current profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(profileData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* User Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Current authentication details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>User ID:</strong> {user?.id || 'Not available'}</div>
                <div><strong>Email:</strong> {user?.email || 'Not available'}</div>
                <div><strong>Email Verified:</strong> {user?.email_confirmed_at ? 'Yes' : 'No'}</div>
                <div><strong>Created At:</strong> {user?.created_at ? new Date(user.created_at).toLocaleString() : 'Not available'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Test and fix profile issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Button onClick={testProfileLoading} className="flex-1">
                  Re-run Tests
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <a href="/profile">Try Profile Page</a>
                </Button>
              </div>
              
              {!testResults.profileExists && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">Profile Not Found</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    This usually means the database trigger didn't create a profile automatically. 
                    You may need to run the database migration scripts in Supabase.
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
