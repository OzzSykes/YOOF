'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Upload, Sparkles, Wand2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { aiAvatarService } from '@/lib/ai-avatar'

interface SimpleAvatarUploadProps {
  currentAvatarUrl?: string | null
  userId: string
  onAvatarUpdated: (newAvatarUrl: string) => void
  displayName?: string
}

export function SimpleAvatarUpload({ 
  currentAvatarUrl, 
  userId, 
  onAvatarUpdated, 
  displayName 
}: SimpleAvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [error, setError] = useState<string>('')
  const [transformationProgress, setTransformationProgress] = useState<string>('')
  const [showCreditWarning, setShowCreditWarning] = useState(false)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setError('')
    setShowCreditWarning(false)

    try {
      // Create a simple filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      
      // Upload directly to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Start the magical transformation process
      setIsTransforming(true)
      setTransformationProgress('Analyzing your image...')
      
      try {
        // Step 1: Analyze the uploaded image
        setTransformationProgress('Detecting features and creating character description...')
        const analysis = await aiAvatarService.analyzeImage(publicUrl)
        
        // Step 2: Generate the Disney/Pixar transformation
        setTransformationProgress('Generating your magical Disney/Pixar character...')
        const transformation = await aiAvatarService.transformToDisneyPixar(analysis)
        
        // Step 3: Upload the transformed image
        setTransformationProgress('Saving your magical avatar...')
        const transformedFileName = `transformed-${userId}-${Date.now()}.png`
        
        // Convert base64 to blob and upload
        const response = await fetch(transformation.transformedUrl)
        const blob = await response.blob()
        
        const { error: transformedUploadError } = await supabase.storage
          .from('avatars')
          .upload(transformedFileName, blob, {
            cacheControl: '3600',
            upsert: false
          })

        if (transformedUploadError) {
          throw new Error(`Failed to save transformed image: ${transformedUploadError.message}`)
        }

        // Get the public URL of the transformed image
        const { data: { publicUrl: transformedPublicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(transformedFileName)

        // Update the profile with the transformed avatar
        onAvatarUpdated(transformedPublicUrl)
        setTransformationProgress('Transformation complete! ✨')
        
        // Show success message briefly
        setTimeout(() => {
          setTransformationProgress('')
        }, 3000)
        
      } catch (transformError: any) {
        console.error('Transformation error:', transformError)
        
        // Check if it's a credit issue
        if (transformError.message?.includes('needs credit') || transformError.message?.includes('Payment Required')) {
          setShowCreditWarning(true)
          setError('AI transformation requires Leonardo AI credit. Using original image for now.')
        } else {
          setError('Image uploaded successfully, but transformation failed. Using original image.')
        }
        
        // If transformation fails, still use the original uploaded image
        onAvatarUpdated(publicUrl)
      }
      
    } catch (err: any) {
      console.error('Avatar upload error:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
      setIsTransforming(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentAvatarUrl || ''} />
          <AvatarFallback>
            {displayName?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={isUploading || isTransforming}
            asChild
          >
            <label className="cursor-pointer">
              {isTransforming ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-pulse" />
                  Transforming...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading || isTransforming}
              />
            </label>
          </Button>
          
          {(isUploading || isTransforming) && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {isUploading ? 'Uploading image...' : transformationProgress}
              </span>
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          
          {showCreditWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">AI Transformation Unavailable</p>
                  <p className="text-amber-700 mt-1">
                    To enable Disney/Pixar character transformation, add your Leonardo AI API key to your environment variables. Get your API key at{' '}
                    <a 
                      href="https://app.leonardo.ai/settings/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-amber-900"
                    >
                      leonardo.ai/settings/api
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {transformationProgress && !isTransforming && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Sparkles className="h-4 w-4" />
              <span>{transformationProgress}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
