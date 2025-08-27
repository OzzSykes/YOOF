import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Palette, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Code, 
  Settings,
  BookOpen,
  Gamepad2,
  Paintbrush,
  Lightbulb,
  Zap,
  Target,
  Star,
  TrendingUp,
  Shield,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Component Showcase</span>
            </div>
          </div>
          <Badge variant="secondary">shadcn/ui Ecosystem</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
                     <h1 className="mb-4 text-4xl font-bold tracking-tight">
             Yoof Component Library
           </h1>
          <p className="text-xl text-muted-foreground">
            Explore the complete shadcn/ui ecosystem for building your AI education platform
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* AI Learning Components */}
          <Card className="col-span-2 row-span-2 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <CardTitle>AI Learning Modules</CardTitle>
              </div>
              <CardDescription>
                Interactive components for teaching AI concepts to children
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Core Components</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Interactive Lessons</div>
                    <div>• Progress Tracking</div>
                    <div>• Achievement Badges</div>
                    <div>• Learning Paths</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Features</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Age-appropriate content</div>
                    <div>• Visual learning aids</div>
                    <div>• Gamified experience</div>
                    <div>• Parent dashboard</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">shadcn/ui</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Play & Activities */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Play className="h-6 w-6 text-green-600" />
                <CardTitle>Learning Games</CardTitle>
              </div>
              <CardDescription>
                Interactive games and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Puzzle challenges</div>
                <div>• Memory games</div>
                <div>• Quiz components</div>
                <div>• Progress rewards</div>
              </div>
            </CardContent>
          </Card>

          {/* Art & Craft */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Paintbrush className="h-6 w-6 text-purple-600" />
                <CardTitle>Creative Tools</CardTitle>
              </div>
              <CardDescription>
                Art and craft integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Drawing canvas</div>
                <div>• Color palettes</div>
                <div>• Template library</div>
                <div>• Project gallery</div>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-orange-600" />
                <CardTitle>User Profiles</CardTitle>
              </div>
              <CardDescription>
                Child and parent accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Age-appropriate profiles</div>
                <div>• Progress tracking</div>
                <div>• Parent controls</div>
                <div>• Achievement system</div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Features */}
          <Card className="bg-gradient-to-br from-pink-50 to-rose-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-pink-600" />
                <CardTitle>Interactive Elements</CardTitle>
              </div>
              <CardDescription>
                Engaging UI components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Animated buttons</div>
                <div>• Drag & drop</div>
                <div>• Voice interactions</div>
                <div>• Haptic feedback</div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card className="col-span-2 bg-gradient-to-br from-slate-50 to-gray-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-slate-600" />
                <CardTitle>Technology Stack</CardTitle>
              </div>
                             <CardDescription>
                 Modern web technologies powering Yoof
               </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-medium">Next.js 15</div>
                  <div className="text-xs text-muted-foreground">React Framework</div>
                </div>
                <div className="text-center">
                  <Code className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-sm font-medium">TypeScript</div>
                  <div className="text-xs text-muted-foreground">Type Safety</div>
                </div>
                <div className="text-center">
                  <Palette className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-medium">shadcn/ui</div>
                  <div className="text-xs text-muted-foreground">Component Library</div>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <div className="text-sm font-medium">Tailwind CSS</div>
                  <div className="text-xs text-muted-foreground">Styling</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Workflow */}
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-indigo-600" />
                <CardTitle>Development</CardTitle>
              </div>
              <CardDescription>
                5 Day Sprint Framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Systematic approach</div>
                <div>• Component-first design</div>
                <div>• Rapid prototyping</div>
                <div>• Production ready</div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-emerald-600" />
                <CardTitle>Learning Goals</CardTitle>
              </div>
              <CardDescription>
                Educational objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• AI fundamentals</div>
                <div>• Creative thinking</div>
                <div>• Problem solving</div>
                <div>• Digital literacy</div>
              </div>
            </CardContent>
          </Card>

          {/* Performance & Security */}
          <Card className="bg-gradient-to-br from-red-50 to-orange-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-red-600" />
                <CardTitle>Security & Performance</CardTitle>
              </div>
              <CardDescription>
                Production standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Child-safe environment</div>
                <div>• Fast loading times</div>
                <div>• Secure data handling</div>
                <div>• Privacy compliance</div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-cyan-600" />
                <CardTitle>Accessibility</CardTitle>
              </div>
              <CardDescription>
                Inclusive design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Screen reader support</div>
                <div>• Keyboard navigation</div>
                <div>• High contrast mode</div>
                <div>• Multi-language</div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Experience */}
          <Card className="bg-gradient-to-br from-violet-50 to-purple-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-6 w-6 text-violet-600" />
                <CardTitle>Mobile First</CardTitle>
              </div>
              <CardDescription>
                Responsive design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Touch-friendly UI</div>
                <div>• Adaptive layouts</div>
                <div>• Offline capability</div>
                <div>• Cross-platform</div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics & Insights */}
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
                <CardTitle>Progress Tracking</CardTitle>
              </div>
              <CardDescription>
                Learning analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Learning progress</div>
                <div>• Skill assessments</div>
                <div>• Parent reports</div>
                <div>• Achievement badges</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Links */}
        <div className="mt-12 text-center">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold">Ready to Build?</h2>
              <p className="mb-6 text-muted-foreground">
                Explore the official shadcn/ui documentation to learn more about these components and start building your AI education platform.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="https://ui.shadcn.com/docs/components" target="_blank">
                  <Button variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Component Docs
                  </Button>
                </Link>
                <Link href="https://ui.shadcn.com/blocks" target="_blank">
                  <Button variant="outline">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Layout Blocks
                  </Button>
                </Link>
                <Link href="https://ui.shadcn.com/themes" target="_blank">
                  <Button variant="outline">
                    <Palette className="mr-2 h-4 w-4" />
                    Theme System
                  </Button>
                </Link>
                <Link href="/">
                  <Button>
                    <Star className="mr-2 h-4 w-4" />
                    Start Building
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
