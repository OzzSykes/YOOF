'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function MinimalTestPage() {
  const [envVars, setEnvVars] = useState<{
    url: string
    anonKey: string
    serviceKey: string
  }>({ url: '', anonKey: '', serviceKey: '' })

  useEffect(() => {
    checkEnvironment()
  }, [])

  const checkEnvironment = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NOT SET'
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'NOT SET'
    
    setEnvVars({ url, anonKey, serviceKey })
  }

  const getStatusIcon = (value: string) => {
    return value !== 'NOT SET' ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (value: string) => {
    return value !== 'NOT SET' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getStatusText = (value: string) => {
    return value !== 'NOT SET' ? 'SET' : 'NOT SET'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Minimal Environment Test</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Testing environment variables without Supabase connection
          </p>
        </div>

        {/* Environment Variables */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <span>Environment Variables Status</span>
            </CardTitle>
            <CardDescription>
              Checking if Supabase credentials are loaded in the browser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(envVars.url)}
                  <span className="font-medium">SUPABASE_URL:</span>
                </div>
                <Badge className={getStatusColor(envVars.url)}>
                  {getStatusText(envVars.url)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(envVars.anonKey)}
                  <span className="font-medium">SUPABASE_ANON_KEY:</span>
                </div>
                <Badge className={getStatusColor(envVars.anonKey)}>
                  {getStatusText(envVars.anonKey)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(envVars.serviceKey)}
                  <span className="font-medium">SUPABASE_SERVICE_ROLE_KEY:</span>
                </div>
                <Badge className={getStatusColor(envVars.serviceKey)}>
                  {getStatusText(envVars.serviceKey)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URL Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>URL Details</CardTitle>
            <CardDescription>
              The actual URL value being used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-mono break-all">
                {envVars.url}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              What to do based on the environment variable status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {envVars.url !== 'NOT SET' && envVars.anonKey !== 'NOT SET' ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>✅ Environment variables are loaded correctly</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>✅ Ready to test Supabase connection</span>
                  </div>
                  <Button asChild className="mt-4">
                    <a href="/simple-test">Test Supabase Connection</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>❌ Environment variables are not loading</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>❌ Need to restart the development server</span>
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                <Button variant="outline" asChild>
                  <a href="/">Back to Home</a>
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
