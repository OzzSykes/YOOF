'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <img 
              src="/yoof_1-removebg-preview.png" 
              alt="Yoof Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold">Yoof</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container px-4 py-24">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              🚀 Coming Soon
            </Badge>
            <h1 className="text-3xl font-bold mb-2">Join the Waitlist</h1>
            <p className="text-muted-foreground">
              Be the first to know when Yoof launches and get early access to our AI education platform for kids.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Stay Updated
              </CardTitle>
              <CardDescription>
                Enter your email to join our waitlist and receive updates about our launch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'success' ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-800 mb-2">You&apos;re on the list!</h3>
                  <p className="text-sm text-green-600 mb-4">{message}</p>
                  <Button onClick={() => router.push('/')} variant="outline" size="sm">
                    Return Home
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      {message}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>We respect your privacy. No spam, just updates about our launch.</p>
          </div>
        </div>
      </div>
    </div>
  )
}