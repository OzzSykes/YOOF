import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { characterDescription } = await request.json()

    if (!characterDescription) {
      return NextResponse.json(
        { error: 'Missing character description' },
        { status: 400 }
      )
    }

    // Check if Leonardo AI API key is configured
    const leonardoApiKey = process.env.LEONARDO_API_KEY

    if (!leonardoApiKey) {
      return NextResponse.json(
        { error: 'Leonardo AI API key not configured. Add LEONARDO_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    // Create Leonardo AI prompt for Disney/Pixar style
    const leonardoPrompt = `${characterDescription}, masterpiece, best quality, highly detailed, Pixar animation style, Disney character, 3D rendered, cinematic lighting, vibrant colors, professional art, children's book illustration style`

    // Step 1: Create a generation
    const createResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${leonardoApiKey}`,
      },
      body: JSON.stringify({
        prompt: leonardoPrompt,
        modelId: "1e7737d7-545e-469f-857f-e4b46eaa151d", // Leonardo Creative model (more reliable)
        width: 512,
        height: 512,
        num_images: 1,
        negative_prompt: "low quality, blurry, distorted, deformed, ugly, bad anatomy, watermark, signature, text",
        guidanceScale: 7,
        initStrength: 0.35,
        scheduler: "LEONARDO"
      })
    })

    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      console.error('Leonardo AI API Error:', {
        status: createResponse.status,
        statusText: createResponse.statusText,
        errorData: errorData
      })
      throw new Error(`Leonardo AI creation error: ${errorData.message || createResponse.statusText}`)
    }

    const createData = await createResponse.json()
    const generationId = createData.sdGenerationJob.generationId

    // Step 2: Poll for completion
    let attempts = 0
    const maxAttempts = 30 // 30 seconds max wait
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      
      const statusResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${leonardoApiKey}`,
        }
      })

      if (!statusResponse.ok) {
        throw new Error('Failed to check generation status')
      }

      const statusData = await statusResponse.json()
      
      if (statusData.generations_by_pk.status === 'COMPLETE') {
        const imageUrl = statusData.generations_by_pk.generated_images[0]?.url
        if (imageUrl) {
          return NextResponse.json({
            success: true,
            imageUrl: imageUrl
          })
        }
        break
      } else if (statusData.generations_by_pk.status === 'FAILED') {
        throw new Error('Generation failed')
      }
      
      attempts++
    }

    throw new Error('Generation timed out')

  } catch (error: any) {
    console.error('Leonardo AI generation error:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate avatar with Leonardo AI: ' + error.message },
      { status: 500 }
    )
  }
}
