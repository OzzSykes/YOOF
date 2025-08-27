import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Palette, Users, Sparkles, ArrowRight, Play } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
                         <span className="text-xl font-bold">Yoof</span>
          </div>
                     <nav className="flex items-center space-x-4">
             <Link href="/login">
               <Button variant="outline" size="sm">
                 Sign In
                 <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
             </Link>
             <Link href="/dashboard">
               <Button variant="ghost" size="sm">
                 View Components
               </Button>
             </Link>
           </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🚀 5 Day Sprint Framework
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to{' '}
                         <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
               Yoof
             </span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            A Children&apos;s AI Education Centre, allowing children aged 6-11 to learn AI through 
            the power of play along with art and craft activities.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="group">
                Explore Components
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-6xl">
                     <div className="mb-12 text-center">
             <h2 className="mb-4 text-3xl font-bold">Why Yoof?</h2>
             <p className="text-lg text-muted-foreground">
               Making AI education accessible and fun for young minds
             </p>
           </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Brain className="h-8 w-8 text-blue-600" />
                <CardTitle>AI Learning</CardTitle>
                <CardDescription>
                  Interactive lessons that make complex AI concepts simple and engaging
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Play className="h-8 w-8 text-green-600" />
                <CardTitle>Learning Through Play</CardTitle>
                <CardDescription>
                  Hands-on activities and games that reinforce AI concepts naturally
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Palette className="h-8 w-8 text-purple-600" />
                <CardTitle>Art & Craft Integration</CardTitle>
                <CardDescription>
                  Creative projects that combine AI learning with artistic expression
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-orange-600" />
                <CardTitle>Age-Appropriate</CardTitle>
                <CardDescription>
                  Specifically designed for children aged 6-11 with appropriate content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="h-8 w-8 text-pink-600" />
                <CardTitle>Interactive Experience</CardTitle>
                <CardDescription>
                  Engaging interfaces that keep children motivated and excited to learn
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                <CardTitle>Modern Technology</CardTitle>
                <CardDescription>
                  Built with the latest web technologies for smooth, responsive learning
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <h2 className="mb-4 text-3xl font-bold">Ready to Start Building?</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Explore the complete shadcn/ui component library and start creating your AI education platform.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="group">
                  View Component Showcase
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold">Yoof</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with the 5 Day Sprint Framework by Omar Choudhry
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
