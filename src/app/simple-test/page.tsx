'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'

export default function SimpleTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [envVars, setEnvVars] = useState<{url: string, key: string}>({url: '', key: ''})

  useEffect(() => {
    checkEnvironment()
    testBasicConnection()
  }, [])

  const checkEnvironment = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
    setEnvVars({url, key})
  }

  const testBasicConnection = async () => {
    try {
      // Test basic connection without requiring tables
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setConnectionStatus('error')
        setErrorMessage(`Auth Error: ${error.message}`)
        return
      }

      setConnectionStatus('success')
    } catch (error: any) {
      setConnectionStatus('error')
      setErrorMessage(`Connection Error: ${error.message}`)
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
            <h1 className="text-3xl font-bold">Simple Connection Test</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Basic Supabase connection test
          </p>
        </div>

        {/* Environment Variables */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <span>Environment Variables</span>
            </CardTitle>
            <CardDescription>
              Checking if Supabase credentials are loaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">SUPABASE_URL:</span>
                <Badge variant={envVars.url !== 'NOT SET' ? 'default' : 'destructive'}>
                  {envVars.url !== 'NOT SET' ? 'SET' : 'NOT SET'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">SUPABASE_ANON_KEY:</span>
                <Badge variant={envVars.key !== 'NOT SET' ? 'default' : 'destructive'}>
                  {envVars.key}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(connectionStatus)}
              <span>Basic Connection</span>
            </CardTitle>
            <CardDescription>
              Testing connection to Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(connectionStatus)}>
              {connectionStatus === 'loading' && 'Testing Connection...'}
              {connectionStatus === 'success' && 'Connected Successfully!'}
              {connectionStatus === 'error' && 'Connection Failed'}
            </Badge>
            {connectionStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-600 font-medium">Error Details:</p>
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              What to do based on the test results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectionStatus === 'success' ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>✅ Connection working - Database tables may not exist</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>✅ Need to run the SQL migration in Supabase</span>
                  </div>
                  <Button asChild className="mt-4">
                    <a href="/test-db">Test Full Database</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>❌ Connection failed - Check environment variables</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>❌ Restart the development server</span>
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                <Button variant="outline" asChild>
                  <a href="/">Back to Home</a>
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retry Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
