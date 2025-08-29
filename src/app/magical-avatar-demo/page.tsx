'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Wand2, Brain, Camera, CheckCircle, Loader2 } from 'lucide-react'
import { MagicalAvatarUpload } from '@/components/magical-avatar-upload'
import { AvatarTransformationResult } from '@/lib/ai-avatar'

export default function MagicalAvatarDemoPage() {
  const [transformationResult, setTransformationResult] = useState<AvatarTransformationResult | null>(null)

  const handleAvatarTransformed = (result: AvatarTransformationResult) => {
    setTransformationResult(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Magical Avatar Transformation</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Experience the magic of AI-powered Disney/Pixar character transformations!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="h-5 w-5 text-purple-500" />
                  <span>Try the Magic!</span>
                </CardTitle>
                <CardDescription>
                  Upload your photo and watch it transform into a Disney/Pixar character
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MagicalAvatarUpload
                  onAvatarTransformed={handleAvatarTransformed}
                  userId="demo-user"
                />
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <span>How It Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-1">1</Badge>
                    <div>
                      <h4 className="font-medium">Image Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        AI analyzes your photo to extract features like hair color, style, facial expression, and clothing
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-1">2</Badge>
                    <div>
                      <h4 className="font-medium">Character Generation</h4>
                      <p className="text-sm text-muted-foreground">
                        Creates a detailed character description using our magical prompt template
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-1">3</Badge>
                    <div>
                      <h4 className="font-medium">Pixar Transformation</h4>
                      <p className="text-sm text-muted-foreground">
                        AI transforms your photo into a 3D Pixar animation style character
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prompt Template Showcase */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-green-500" />
                  <span>Magical Prompt Template</span>
                </CardTitle>
                <CardDescription>
                  Our detailed prompt ensures perfect character transformations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Character Analysis Parameters:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Character Name & Age</li>
                    <li>• Hair Style & Color (40+ options)</li>
                    <li>• Skin Tone (20+ options)</li>
                    <li>• Accessories & Clothing</li>
                    <li>• Facial Expression & Action</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Generated Character Description:</h4>
                  <p className="text-sm italic">
                    "[Character Name], a [Age] year old [Gender], with [Hairstyle], [Hair Color], [Expression], and a [Skin Tone] complexion, wearing [Accessories]. Dressed in [Clothing]. They [Action] on a whimsical background suitable for [Gender], in 3D Pixar Animation Style."
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Example Output:</h4>
                  <p className="text-sm">
                    "Adventure Seeker, a 8 year old Female, with Beach Waves, Golden Blonde, Cheerful, and a Warm Beige complexion, wearing Glasses. Dressed in an outfit featuring a Blue T-shirt and White Shorts. They Exploring on a whimsical background suitable for Female, in 3D Pixar Animation Style."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Magical Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">40+ Hair Styles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">20+ Skin Tones</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Pixar Quality</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Age Appropriate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Custom Outfits</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Magical Backgrounds</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transformation Result */}
        {transformationResult && (
          <Card className="mt-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-700">
                <Sparkles className="h-5 w-5" />
                <span>Transformation Complete!</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Generated Prompt:</h4>
                <p className="text-sm bg-gray-50 p-3 rounded border">
                  {transformationResult.prompt}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Previous Page
          </Button>
        </div>
      </div>
    </div>
  )
}
