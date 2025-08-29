import { supabase } from './supabase'

export interface AvatarAnalysis {
  characterName: string
  characterAge: number
  characterGender: 'Female' | 'Male'
  hairstyle: string
  hairColor: string
  skinTone: string
  accessories: string
  outfitUpperBody: string
  upperClothingColor: string
  outfitLowerBody: string
  lowerClothingColor: string
  facialExpression: string
  action: string
}

export interface AvatarTransformationResult {
  originalUrl: string
  transformedUrl: string
  analysis: AvatarAnalysis
  prompt: string
}

// AI Service for avatar transformation
export class AIAvatarService {
  private static instance: AIAvatarService

  static getInstance(): AIAvatarService {
    if (!AIAvatarService.instance) {
      AIAvatarService.instance = new AIAvatarService()
    }
    return AIAvatarService.instance
  }

  // Analyze uploaded image to extract features
  async analyzeImage(imageUrl: string): Promise<AvatarAnalysis> {
    try {
      // This would integrate with an AI vision service (OpenAI Vision, Google Vision, etc.)
      // For now, returning a template analysis based on common features
      
      // Simulate AI analysis with realistic data
      const analysis: AvatarAnalysis = {
        characterName: 'Adventure Seeker',
        characterAge: Math.floor(Math.random() * 12) + 4, // Random age 4-15
        characterGender: Math.random() > 0.5 ? 'Female' : 'Male',
        hairstyle: this.getRandomHairstyle(),
        hairColor: this.getRandomHairColor(),
        skinTone: this.getRandomSkinTone(),
        accessories: Math.random() > 0.7 ? 'Glasses' : '',
        outfitUpperBody: this.getRandomUpperBody(),
        upperClothingColor: this.getRandomColor(),
        outfitLowerBody: this.getRandomLowerBody(),
        lowerClothingColor: this.getRandomColor(),
        facialExpression: this.getRandomExpression(),
        action: this.getRandomAction()
      }

      return analysis
    } catch (error) {
      console.error('Error analyzing image:', error)
      throw new Error('Failed to analyze image')
    }
  }

  // Transform to Disney/Pixar style using the analysis
  async transformToDisneyPixar(analysis: AvatarAnalysis): Promise<AvatarTransformationResult> {
    try {
      // Generate character description using the prompt template
      const characterDescription = this.generateCharacterDescription(analysis)
      
      // Try Leonardo AI first (best cost/quality ratio)
      let transformedUrl = await this.tryLeonardoGeneration(characterDescription)
      
      if (!transformedUrl) {
        // Fall back to Midjourney API
        transformedUrl = await this.tryMidjourneyGeneration(characterDescription)
      }
      
      if (!transformedUrl) {
        // Fall back to Replicate (Midjourney-style model)
        transformedUrl = await this.generatePixarCharacter(characterDescription)
      }
      
      return {
        originalUrl: '', // Will be set by the calling component
        transformedUrl,
        analysis,
        prompt: characterDescription
      }
    } catch (error) {
      console.error('Error transforming to Disney/Pixar:', error)
      throw new Error('Failed to transform to Disney/Pixar style')
    }
  }

  // Try Leonardo AI first (best cost/quality)
  private async tryLeonardoGeneration(characterDescription: string): Promise<string | null> {
    try {
      console.log('🎨 Trying Leonardo AI...')
      const response = await fetch('/api/generate-avatar-leonardo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterDescription
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.imageUrl) {
          console.log('🎨 Generated with Leonardo AI')
          return data.imageUrl
        }
      } else {
        const errorData = await response.json()
        console.log('Leonardo AI failed:', errorData)
      }
    } catch (error) {
      console.log('Leonardo AI error:', error)
    }
    
    console.log('Leonardo AI not available, trying alternatives')
    return null
  }

  // Try Midjourney API second
  private async tryMidjourneyGeneration(characterDescription: string): Promise<string | null> {
    try {
      const response = await fetch('/api/generate-avatar-midjourney', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterDescription
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.imageUrl) {
          console.log('🎨 Generated with Midjourney API')
          return data.imageUrl
        }
      }
    } catch (error) {
      console.log('Midjourney API not available, falling back to Replicate')
    }
    
    return null
  }

  // Generate Pixar character using API route (Replicate with Midjourney-style model)
  private async generatePixarCharacter(characterDescription: string): Promise<string> {
    try {
      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterDescription
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate avatar')
      }

      const data = await response.json()
      
      if (data.success && data.imageUrl) {
        console.log('🎨 Generated with Replicate (Midjourney-style model)')
        return data.imageUrl
      } else {
        throw new Error('No image generated')
      }
    } catch (error) {
      console.error('Avatar generation error:', error)
      // Fallback to placeholder if API fails
      return this.getFallbackImage()
    }
  }

  // Fallback image if API is not available
  private getFallbackImage(): string {
    return 'https://via.placeholder.com/1024x1024/FF6B9D/FFFFFF?text=Disney+Pixar+Character'
  }

  // Generate character description using the provided prompt template
  generateCharacterDescription(analysis: AvatarAnalysis): string {
    const {
      characterName,
      characterAge,
      characterGender,
      hairstyle,
      hairColor,
      skinTone,
      accessories,
      outfitUpperBody,
      upperClothingColor,
      outfitLowerBody,
      lowerClothingColor,
      facialExpression,
      action
    } = analysis

    const accessoriesText = accessories ? `wearing ${accessories}, ` : ''

    return `${characterName}, a ${characterAge} year old ${characterGender}, with ${hairstyle}, ${hairColor}, ${facialExpression}, and a ${skinTone} complexion, ${accessoriesText}. Dressed in an outfit featuring a ${upperClothingColor} ${outfitUpperBody} and ${lowerClothingColor} ${outfitLowerBody}. They ${action} on a whimsical background suitable for ${characterGender}, in 3D Pixar Animation Style.`
  }

  // Helper methods for generating random character features
  private getRandomHairstyle(): string {
    const hairstyles = [
      'Pixie Cut', 'Bob Cut', 'Beach Waves', 'Classic Braid', 'High Ponytail', 
      'Layered Cut', 'Curly Bob', 'Top Knot', 'French Braid', 'Side Ponytail'
    ]
    return hairstyles[Math.floor(Math.random() * hairstyles.length)]
  }

  private getRandomHairColor(): string {
    const hairColors = [
      'Golden Blonde', 'Strawberry Blonde', 'Light Brown', 'Dark Brown', 
      'Black', 'Auburn', 'Red', 'Platinum Blonde'
    ]
    return hairColors[Math.floor(Math.random() * hairColors.length)]
  }

  private getRandomSkinTone(): string {
    const skinTones = [
      'Fair', 'Light', 'Medium', 'Warm Beige', 'Golden', 'Caramel', 
      'Honey', 'Chestnut', 'Almond'
    ]
    return skinTones[Math.floor(Math.random() * skinTones.length)]
  }

  private getRandomUpperBody(): string {
    const upperBodies = ['T-shirt', 'Blouse', 'Sweater', 'Hoodie', 'Dress']
    return upperBodies[Math.floor(Math.random() * upperBodies.length)]
  }

  private getRandomLowerBody(): string {
    const lowerBodies = ['Shorts', 'Pants', 'Skirt', 'Jeans', 'Leggings']
    return lowerBodies[Math.floor(Math.random() * lowerBodies.length)]
  }

  private getRandomColor(): string {
    const colors = ['Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'White', 'Black']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  private getRandomExpression(): string {
    const expressions = ['Cheerful', 'Excited', 'Playful', 'Thoughtful', 'Happy', 'Curious']
    return expressions[Math.floor(Math.random() * expressions.length)]
  }

  private getRandomAction(): string {
    const actions = ['Exploring', 'Playing', 'Dancing', 'Reading', 'Jumping', 'Smiling', 'Adventuring']
    return actions[Math.floor(Math.random() * actions.length)]
  }

  // Transform image using AI image generation
  async transformToPixarStyle(imageUrl: string, characterDescription: string): Promise<string> {
    try {
      // This would integrate with AI image generation services like:
      // - OpenAI DALL-E
      // - Replicate API (Stable Diffusion)
      // - Stability AI
      // - Midjourney API

      // For now, returning a placeholder transformed URL
      // In production, this would call the actual AI service
      const transformedUrl = imageUrl // Placeholder - would be AI-generated image

      return transformedUrl
    } catch (error) {
      console.error('Error transforming image:', error)
      throw new Error('Failed to transform image to Pixar style')
    }
  }

  // Complete avatar transformation workflow
  async transformAvatar(imageUrl: string): Promise<AvatarTransformationResult> {
    try {
      // Step 1: Analyze the uploaded image
      const analysis = await this.analyzeImage(imageUrl)

      // Step 2: Generate character description using the prompt template
      const characterDescription = this.generateCharacterDescription(analysis)

      // Step 3: Transform image to Pixar style
      const transformedUrl = await this.transformToPixarStyle(imageUrl, characterDescription)

      return {
        originalUrl: imageUrl,
        transformedUrl,
        analysis,
        prompt: characterDescription
      }
    } catch (error) {
      console.error('Error in avatar transformation:', error)
      throw new Error('Failed to transform avatar')
    }
  }

  // Save transformed avatar to Supabase storage
  async saveTransformedAvatar(userId: string, transformedImageUrl: string): Promise<string> {
    try {
      // Download the transformed image
      const response = await fetch(transformedImageUrl)
      const blob = await response.blob()

      // Upload to Supabase storage
      const fileName = `transformed-avatars/${userId}-${Date.now()}.png`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error saving transformed avatar:', error)
      throw new Error('Failed to save transformed avatar')
    }
  }
}

// Export singleton instance
export const aiAvatarService = AIAvatarService.getInstance()
