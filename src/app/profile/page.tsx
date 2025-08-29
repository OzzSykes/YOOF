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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Upload, User, Settings, Shield, Loader2, CheckCircle, Edit3, Save, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/protected-route'
import { SimpleAvatarUpload } from '@/components/simple-avatar-upload'

interface ProfileData {
  display_name: string
  age: number | null
  grade_level: string
  interests: string[]
  avatar_url: string | null
  bio: string
  user_type: 'child' | 'parent'
  created_at: string
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [originalData, setOriginalData] = useState<ProfileData | null>(null)


  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      setProfileData(data)
      setOriginalData(data)
    } catch (error: any) {
      setError('Failed to load profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    if (!profileData) return
    setProfileData(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleInterestToggle = (interest: string) => {
    if (!profileData) return
    setProfileData(prev => prev ? {
      ...prev,
      interests: (prev.interests || []).includes(interest)
        ? (prev.interests || []).filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    } : null)
  }

  const handleAvatarUpdated = (newAvatarUrl: string) => {
    if (!profileData) return
    
    // Update profile with the new avatar URL
    setProfileData(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null)
    setSuccess('Avatar updated successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSaveProfile = async () => {
    if (!user || !profileData) return

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

      setSuccess('Profile updated successfully!')
      setOriginalData(profileData)
      setEditing(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError('Failed to save profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setProfileData(originalData)
    setEditing(false)
    setError('')
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error: any) {
      setError('Failed to sign out: ' + error.message)
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p>Loading your profile...</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  if (!profileData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <p className="text-red-600">Failed to load profile</p>
              <Button onClick={() => router.push('/dashboard')} className="mt-4">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img 
                src="/yoof_1-removebg-preview.png" 
                alt="Yoof Logo" 
                className="h-8 w-auto"
              />
              <h1 className="text-3xl font-bold">Your Profile</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Profile Information</span>
                      </CardTitle>
                      <CardDescription>
                        Update your personal information and preferences
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      {editing ? (
                        <>
                          <Button onClick={handleSaveProfile} disabled={saving} size="sm">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" size="sm">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setEditing(true)} size="sm">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                                     {/* Avatar */}
                   <div className="space-y-3">
                     <Label>Profile Picture</Label>
                     {editing ? (
                       <SimpleAvatarUpload
                         currentAvatarUrl={profileData.avatar_url}
                         userId={user.id}
                         onAvatarUpdated={handleAvatarUpdated}
                         displayName={profileData.display_name}
                       />
                     ) : (
                       <div className="flex items-center space-x-4">
                         <Avatar className="h-24 w-24">
                           <AvatarImage src={profileData.avatar_url || ''} />
                           <AvatarFallback>
                             {profileData.display_name?.charAt(0).toUpperCase() || 'U'}
                           </AvatarFallback>
                         </Avatar>
                       </div>
                     )}
                   </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={profileData.display_name}
                        onChange={(e) => handleInputChange('display_name', e.target.value)}
                        disabled={!editing}
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
                        disabled={!editing}
                        placeholder="Your age"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade_level">Grade Level</Label>
                    <Select 
                      value={profileData.grade_level} 
                      onValueChange={(value) => handleInputChange('grade_level', value)}
                      disabled={!editing}
                    >
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
                    <Label>Interests</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableInterests.map(interest => (
                        <Button
                          key={interest}
                          variant={profileData.interests?.includes(interest) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => editing && handleInterestToggle(interest)}
                          disabled={!editing}
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
                    <Label htmlFor="bio">About Me</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!editing}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  {/* Account Info */}
                  <div className="space-y-3">
                    <Label>Account Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Account Type</p>
                        <Badge variant={profileData.user_type === 'child' ? 'default' : 'secondary'}>
                          {profileData.user_type === 'child' ? 'Child' : 'Parent'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(profileData.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Account Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your account preferences and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about your learning progress
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Learning Preferences</p>
                        <p className="text-sm text-muted-foreground">
                          Customize your learning experience
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Customize
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Privacy Settings</p>
                        <p className="text-sm text-muted-foreground">
                          Control who can see your profile and progress
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and privacy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">
                          Update your account password
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Active Sessions</p>
                        <p className="text-sm text-muted-foreground">
                          View and manage your active login sessions
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <p className="font-medium text-red-800">Sign Out</p>
                        <p className="text-sm text-red-600">
                          Sign out of your account on all devices
                        </p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

                     {/* Navigation */}
           <div className="mt-8 text-center">
             <Button variant="outline" onClick={() => router.push('/dashboard')}>
               Back to Dashboard
             </Button>
           </div>
         </div>
       </div>


     </ProtectedRoute>
   )
 }
