-- Add bio field to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update existing profiles to have empty bio if null
UPDATE profiles 
SET bio = '' 
WHERE bio IS NULL;
