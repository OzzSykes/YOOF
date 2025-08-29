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

    // Check if Midjourney API key is configured
    const midjourneyApiKey = process.env.MIDJOURNEY_API_KEY
    const midjourneyApiUrl = process.env.MIDJOURNEY_API_URL || 'https://api.midjourney.com'

    if (!midjourneyApiKey) {
      return NextResponse.json(
        { error: 'Midjourney API key not configured. Add MIDJOURNEY_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    // Create Midjourney-style prompt
    const midjourneyPrompt = `${characterDescription} --ar 2:3 --v 6 --style raw --q 2 --s 750`

    // Call Midjourney API
    const response = await fetch(`${midjourneyApiUrl}/imagine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${midjourneyApiKey}`,
      },
      body: JSON.stringify({
        prompt: midjourneyPrompt,
        width: 1024,
        height: 1536,
        quality: 2,
        style: 'raw',
        version: 6,
        seed: Math.floor(Math.random() * 1000000)
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Midjourney API error: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    
    if (data.imageUrl) {
      return NextResponse.json({
        success: true,
        imageUrl: data.imageUrl
      })
    } else {
      throw new Error('No image generated from Midjourney')
    }

  } catch (error: any) {
    console.error('Midjourney generation error:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate avatar with Midjourney: ' + error.message },
      { status: 500 }
    )
  }
}
