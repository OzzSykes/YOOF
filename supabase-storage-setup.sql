-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Create storage policy for avatars (users can upload their own avatars)
CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR 
     name LIKE auth.uid()::text || '-%' OR
     name LIKE 'original-avatars/' || auth.uid()::text || '-%' OR
     name LIKE 'transformed-avatars/' || auth.uid()::text || '-%')
  );

-- Create storage policy for avatars (users can update their own avatars)
CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR 
     name LIKE auth.uid()::text || '-%' OR
     name LIKE 'original-avatars/' || auth.uid()::text || '-%' OR
     name LIKE 'transformed-avatars/' || auth.uid()::text || '-%')
  );

-- Create storage policy for avatars (users can delete their own avatars)
CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR 
     name LIKE auth.uid()::text || '-%' OR
     name LIKE 'original-avatars/' || auth.uid()::text || '-%' OR
     name LIKE 'transformed-avatars/' || auth.uid()::text || '-%')
  );

-- Create storage policy for avatars (public read access)
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
