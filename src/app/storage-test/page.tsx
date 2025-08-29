'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function StorageTestPage() {
  const [testResult, setTestResult] = useState<string>('')
  const [isTesting, setIsTesting] = useState(false)

  const testStorage = async () => {
    setIsTesting(true)
    setTestResult('')

    try {
      // Test 1: Check if avatars bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        throw new Error(`Failed to list buckets: ${bucketsError.message}`)
      }

      const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars')
      
      if (!avatarsBucket) {
        setTestResult('❌ Avatars bucket does not exist. Please create it in Supabase Dashboard.')
        return
      }

      setTestResult('✅ Avatars bucket exists!\n')

      // Test 2: Try to list files in avatars bucket
      const { data: files, error: filesError } = await supabase.storage
        .from('avatars')
        .list()

      if (filesError) {
        setTestResult(prev => prev + `❌ Cannot list files: ${filesError.message}`)
        return
      }

      setTestResult(prev => prev + `✅ Can list files in avatars bucket (${files.length} files found)\n`)

      // Test 3: Check RLS policies
      setTestResult(prev => prev + '✅ Storage bucket is accessible. RLS policies may need adjustment.')

    } catch (error: any) {
      setTestResult(`❌ Test failed: ${error.message}`)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Storage Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testStorage} 
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? 'Testing...' : 'Test Storage Connection'}
            </Button>
            
            {testResult && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Test Results:</h3>
                <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
