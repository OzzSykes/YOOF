import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export async function POST(request: NextRequest) {
  try {
    const { characterDescription } = await request.json()

    if (!characterDescription) {
      return NextResponse.json(
        { error: 'Missing character description' },
        { status: 400 }
      )
    }

    if (!process.env.REPLICATE_API_KEY) {
      return NextResponse.json(
        { error: 'Replicate API key not configured' },
        { status: 500 }
      )
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    })

    // Use a Midjourney-style model for better Disney/Pixar results
    // This model produces high-quality, artistic results similar to Midjourney
    const output = await replicate.run(
      "cjwbw/anything-v3-better-vae:09a5805203f4c12da649ec1923bb7729517ca25fcac790e640eaa9ed66573b65",
      {
        input: {
          prompt: `${characterDescription}, masterpiece, best quality, highly detailed, Pixar animation style, Disney character, 3D rendered, cinematic lighting, vibrant colors, professional art`,
          negative_prompt: "low quality, blurry, distorted, deformed, ugly, bad anatomy, watermark, signature, text, adult content, inappropriate, nsfw",
          width: 512,
          height: 768,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 28,
          scheduler: "K_EULER",
          seed: Math.floor(Math.random() * 1000000)
        }
      }
    ) as string[]

    if (output && output.length > 0) {
      return NextResponse.json({
        success: true,
        imageUrl: output[0]
      })
    } else {
      throw new Error('No image generated')
    }

  } catch (error: any) {
    console.error('Avatar generation error:', error)
    
    // Check if it's a credit issue
    if (error.message?.includes('insufficient credit') || error.message?.includes('Payment Required')) {
      return NextResponse.json(
        { 
          error: 'Replicate account needs credit. Please add credit at https://replicate.com/account/billing#billing or use the free tier (500 predictions/month).',
          needsCredit: true
        },
        { status: 402 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate avatar: ' + error.message },
      { status: 500 }
    )
  }
}
