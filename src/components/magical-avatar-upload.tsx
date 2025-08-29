'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, Upload, Sparkles, Wand2, Camera, CheckCircle, RefreshCw } from 'lucide-react'
import { aiAvatarService, AvatarTransformationResult } from '@/lib/ai-avatar'

interface MagicalAvatarUploadProps {
  onAvatarTransformed: (result: AvatarTransformationResult) => void
  currentAvatarUrl?: string | null
  userId: string
}

export function MagicalAvatarUpload({ onAvatarTransformed, currentAvatarUrl, userId }: MagicalAvatarUploadProps) {
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationStep, setTransformationStep] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [transformationResult, setTransformationResult] = useState<AvatarTransformationResult | null>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsTransforming(true)
    setError('')
    setShowPreview(false)
    setTransformationResult(null)

    try {
      // Step 1: Upload original image to get URL
      setTransformationStep('Uploading your photo...')
      const fileExt = file.name.split('.').pop()
      const fileName = `original-avatars/${userId}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileType: file.type })
      }).then(res => res.json())

      if (uploadError) throw new Error(uploadError)

      // Step 2: Analyze image features
      setTransformationStep('Analyzing your features...')
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate analysis

      // Step 3: Generate character description
      setTransformationStep('Creating your magical character...')
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate generation

      // Step 4: Transform to Pixar style
      setTransformationStep('Transforming into Disney/Pixar style...')
      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate transformation

      // For demo purposes, create a mock transformation result
      const mockResult: AvatarTransformationResult = {
        originalUrl: URL.createObjectURL(file),
        transformedUrl: URL.createObjectURL(file), // In real implementation, this would be AI-generated
        analysis: {
          characterName: 'Adventure Seeker',
          characterAge: 8,
          characterGender: 'Female',
          hairstyle: 'Beach Waves',
          hairColor: 'Golden Blonde',
          skinTone: 'Warm Beige',
          accessories: 'Glasses',
          outfitUpperBody: 'T-shirt',
          upperClothingColor: 'Blue',
          outfitLowerBody: 'Shorts',
          lowerClothingColor: 'White',
          facialExpression: 'Cheerful',
          action: 'Exploring'
        },
        prompt: 'Adventure Seeker, a 8 year old Female, with Beach Waves, Golden Blonde, Cheerful, and a Warm Beige complexion, wearing Glasses. Dressed in an outfit featuring a Blue T-shirt and White Shorts. They Exploring on a whimsical background suitable for Female, in 3D Pixar Animation Style.'
      }

      setTransformationResult(mockResult)
      setShowPreview(true)
      onAvatarTransformed(mockResult)

    } catch (error: any) {
      setError('Failed to transform avatar: ' + error.message)
    } finally {
      setIsTransforming(false)
      setTransformationStep('')
    }
  }

  const handleRetry = () => {
    setError('')
    setShowPreview(false)
    setTransformationResult(null)
  }

  const handleAcceptTransformation = async () => {
    if (!transformationResult) return

    try {
      setIsTransforming(true)
      setTransformationStep('Saving your magical avatar...')

      // Save the transformed avatar
      const savedUrl = await aiAvatarService.saveTransformedAvatar(userId, transformationResult.transformedUrl)
      
      // Update the result with the saved URL
      const finalResult = { ...transformationResult, transformedUrl: savedUrl }
      onAvatarTransformed(finalResult)

    } catch (error: any) {
      setError('Failed to save avatar: ' + error.message)
    } finally {
      setIsTransforming(false)
      setTransformationStep('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>Magical Avatar Transformation</span>
          </CardTitle>
          <CardDescription>
            Upload your photo and watch it transform into a Disney/Pixar character!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Avatar Display */}
          {currentAvatarUrl && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Current Avatar:</p>
              <Avatar className="h-16 w-16 mx-auto">
                <AvatarImage src={currentAvatarUrl} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Upload Button */}
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg" 
              disabled={isTransforming}
              asChild
              className="relative overflow-hidden"
            >
              <label>
                {isTransforming ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    {transformationStep}
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Upload Photo for Magic
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isTransforming}
                />
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Upload a clear photo of your face for the best transformation
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
              <Button variant="outline" size="sm" onClick={handleRetry} className="ml-2">
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transformation Preview */}
      {showPreview && transformationResult && (
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700">
              <Sparkles className="h-5 w-5" />
              <span>Your Magical Character!</span>
            </CardTitle>
            <CardDescription>
              Here's your Disney/Pixar transformation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Before and After */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Original Photo</p>
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarImage src={transformationResult.originalUrl} />
                  <AvatarFallback>O</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Magical Character</p>
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarImage src={transformationResult.transformedUrl} />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Character Details */}
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium mb-2">Character Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Name:</span> {transformationResult.analysis.characterName}</div>
                <div><span className="font-medium">Age:</span> {transformationResult.analysis.characterAge}</div>
                <div><span className="font-medium">Hair:</span> {transformationResult.analysis.hairColor} {transformationResult.analysis.hairstyle}</div>
                <div><span className="font-medium">Expression:</span> {transformationResult.analysis.facialExpression}</div>
                <div><span className="font-medium">Outfit:</span> {transformationResult.analysis.upperClothingColor} {transformationResult.analysis.outfitUpperBody}</div>
                <div><span className="font-medium">Action:</span> {transformationResult.analysis.action}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                onClick={handleAcceptTransformation}
                disabled={isTransforming}
                className="flex-1"
              >
                {isTransforming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Use This Avatar
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRetry}
                disabled={isTransforming}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
