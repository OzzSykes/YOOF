-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public waitlist signup)
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Create policy to prevent reading by default (admin-only view)
CREATE POLICY "No public read access" ON waitlist
  FOR SELECT USING (false);

-- Add trigger for updated_at
CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON waitlist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();