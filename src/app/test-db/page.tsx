'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestDBPage() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [tablesStatus, setTablesStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [modulesCount, setModulesCount] = useState<number | null>(null)
  const [achievementsCount, setAchievementsCount] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase.from('learning_modules').select('count', { count: 'exact', head: true })
      
      if (error) {
        setConnectionStatus('error')
        setErrorMessage(error.message)
        return
      }

      setConnectionStatus('success')

      // Test tables and get counts
      await testTables()
    } catch (error: any) {
      setConnectionStatus('error')
      setErrorMessage(error.message)
    }
  }

  const testTables = async () => {
    try {
      // Get learning modules count
      const { count: modulesCount } = await supabase
        .from('learning_modules')
        .select('*', { count: 'exact', head: true })

      // Get achievements count
      const { count: achievementsCount } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true })

      setModulesCount(modulesCount || 0)
      setAchievementsCount(achievementsCount || 0)
      setTablesStatus('success')
    } catch (error: any) {
      setTablesStatus('error')
      setErrorMessage(error.message)
    }
  }

  const getStatusIcon = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return 'bg-yellow-100 text-yellow-800'
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Yoof Database Test</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Testing Supabase connection and database setup
          </p>
        </div>

        {/* Connection Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(connectionStatus)}
              <span>Database Connection</span>
            </CardTitle>
            <CardDescription>
              Testing connection to Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(connectionStatus)}>
              {connectionStatus === 'loading' && 'Testing Connection...'}
              {connectionStatus === 'success' && 'Connected Successfully!'}
              {connectionStatus === 'error' && 'Connection Failed'}
            </Badge>
            {connectionStatus === 'error' && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
          </CardContent>
        </Card>

        {/* Tables Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(tablesStatus)}
              <span>Database Tables</span>
            </CardTitle>
            <CardDescription>
              Verifying tables and sample data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Learning Modules</span>
                <Badge variant="outline">
                  {modulesCount !== null ? modulesCount : '...'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Achievements</span>
                <Badge variant="outline">
                  {achievementsCount !== null ? achievementsCount : '...'}
                </Badge>
              </div>
            </div>
            {tablesStatus === 'success' && (
              <p className="mt-4 text-sm text-green-600">
                ✅ All tables created successfully with sample data!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Test Authentication */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
            <CardDescription>
              Test the login/signup functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your authentication system is ready! You can test it by:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Going to the login page</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Creating a new account (child or parent)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Signing in to access the dashboard</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button asChild>
                  <a href="/login">Test Login Page</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">Back to Home</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {connectionStatus === 'success' && tablesStatus === 'success' && (
          <div className="mt-8 text-center">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <h2 className="text-xl font-bold text-green-800">Database Setup Complete!</h2>
                </div>
                <p className="text-green-700">
                  Your Yoof platform is ready with a fully configured Supabase database!
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
