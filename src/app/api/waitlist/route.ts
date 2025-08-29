import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validatedData = waitlistSchema.parse(body)
    const { email } = validatedData

    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }])
      .select()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on our waitlist!' },
          { status: 409 }
        )
      }
      
      console.error('Waitlist submission error:', error)
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Successfully joined the waitlist!',
        data: data[0]
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}