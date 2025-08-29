import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType } = await request.json()

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'Missing fileName or fileType' },
        { status: 400 }
      )
    }

    // Generate a signed URL for uploading
    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUploadUrl(fileName)

    if (error) {
      console.error('Error creating signed URL:', error)
      return NextResponse.json(
        { error: 'Failed to create upload URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: {
        signedUrl: data.signedUrl,
        path: data.path
      }
    })

  } catch (error) {
    console.error('Error in upload-avatar API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
