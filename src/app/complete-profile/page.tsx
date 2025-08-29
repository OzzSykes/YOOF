'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Brain, Upload, User, Child, Parent, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

interface ProfileData {
  display_name: string
  age: number | null
  grade_level: string
  interests: string[]
  avatar_url: string | null
  bio: string
}

export default function CompleteProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profileData, setProfileData] = useState<ProfileData>({
    display_name: '',
    age: null,
    grade_level: '',
    interests: [],
    avatar_url: null,
    bio: ''
  })

  useEffect(() => {
    if (user) {
      // Pre-fill display name from email
      const emailName = user.email?.split('@')[0] || ''
      setProfileData(prev => ({
        ...prev,
        display_name: emailName
      }))
    }
  }, [user])

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: (prev.interests || []).includes(interest)
        ? (prev.interests || []).filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }))
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setLoading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setProfileData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }))
    } catch (error: any) {
      setError('Failed to upload avatar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setSaving(true)
    setError('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profileData.display_name,
          age: profileData.age,
          grade_level: profileData.grade_level,
          interests: profileData.interests,
          avatar_url: profileData.avatar_url,
          bio: profileData.bio
        })
        .eq('user_id', user.id)

      if (error) throw error

      setSuccess('Profile saved successfully!')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      setError('Failed to save profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const availableInterests = [
    'AI & Robotics', 'Art & Drawing', 'Science', 'Math', 'Reading', 
    'Music', 'Sports', 'Coding', 'Nature', 'Space', 'Animals', 'Cooking'
  ]

  const gradeLevels = [
    'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', 
    '4th Grade', '5th Grade', '6th Grade'
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Loading your profile...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Tell us about yourself to personalize your Yoof experience
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>
              Help us create the best learning experience for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="space-y-3">
              <Label>Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatar_url || ''} />
                  <AvatarFallback>
                    {profileData.display_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" disabled={loading} asChild>
                    <label>
                      <Upload className="h-4 w-4 mr-2" />
                      {loading ? 'Uploading...' : 'Upload Avatar'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Upload a profile picture (optional)
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={profileData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="6"
                  max="12"
                  value={profileData.age || ''}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || null)}
                  placeholder="Your age"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade_level">Grade Level</Label>
              <Select value={profileData.grade_level} onValueChange={(value) => handleInputChange('grade_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevels.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label>What interests you? (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableInterests.map(interest => (
                  <Button
                    key={interest}
                    variant={profileData.interests?.includes(interest) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInterestToggle(interest)}
                    className="justify-start"
                  >
                    {profileData.interests?.includes(interest) && (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {interest}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Tell us about yourself</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="What do you like to learn about? What are your favorite activities?"
                rows={3}
              />
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                {success}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving || !profileData.display_name}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Profile & Continue'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="flex-1"
              >
                Skip for Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <Badge variant="secondary">
            Step 1 of 3: Profile Setup
          </Badge>
        </div>
      </div>
    </div>
  )
}
