'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Wand2, Brain, Camera, CheckCircle, Loader2 } from 'lucide-react'
import { SimpleAvatarUpload } from '@/components/simple-avatar-upload'
import { AvatarTransformationResult } from '@/lib/ai-avatar'

export default function AvatarTestPage() {
  const [transformationResult, setTransformationResult] = useState<AvatarTransformationResult | null>(null)
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null)

  const handleAvatarUpdated = (newAvatarUrl: string) => {
    setCurrentAvatarUrl(newAvatarUrl)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Magical Avatar Transformation
            </h1>
            <Wand2 className="h-8 w-8 text-pink-500" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your photo and watch it transform into a magical Disney/Pixar 3D animated character!
          </p>
        </div>

        {/* Upload Section */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-blue-500" />
              <span>Upload Your Photo</span>
            </CardTitle>
            <CardDescription>
              Select an image and our AI will transform it into a Disney/Pixar character
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleAvatarUpload
              currentAvatarUrl={currentAvatarUrl}
              userId="test-user"
              onAvatarUpdated={handleAvatarUpdated}
              displayName="Test User"
            />
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-blue-500" />
                <CardTitle>1. Upload Photo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload a clear photo of yourself or your child
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <CardTitle>2. AI Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes features and creates a character description
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-rose-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-pink-500" />
                <CardTitle>3. Magical Transformation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Transform into a Disney/Pixar 3D animated character
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Character Features */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span>Character Features</span>
            </CardTitle>
            <CardDescription>
              Our AI generates unique character traits for each transformation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-center">Hairstyles</Badge>
                <p className="text-xs text-muted-foreground text-center">40+ Options</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-center">Skin Tones</Badge>
                <p className="text-xs text-muted-foreground text-center">20+ Varieties</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-center">Outfits</Badge>
                <p className="text-xs text-muted-foreground text-center">Multiple Styles</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-center">Expressions</Badge>
                <p className="text-xs text-muted-foreground text-center">Various Moods</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Prompt */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-amber-600" />
              <span>Example Character Description</span>
            </CardTitle>
            <CardDescription>
              This is how our AI describes your character for the transformation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white/60 rounded-lg p-4 border-l-4 border-amber-500">
              <p className="text-sm italic">
                "Adventure Seeker, a 8 year old Female, with Beach Waves, Golden Blonde, Cheerful, and a Warm Beige complexion, wearing Glasses. Dressed in an outfit featuring a Blue T-shirt and White Shorts. They Exploring on a whimsical background suitable for Female, in 3D Pixar Animation Style."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
