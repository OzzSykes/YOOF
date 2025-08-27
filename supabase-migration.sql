-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_type TEXT CHECK (user_type IN ('child', 'parent')) NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  age INTEGER CHECK (age >= 0 AND age <= 120),
  grade_level TEXT,
  interests TEXT[],
  parent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning_modules table
CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  age_range TEXT NOT NULL,
  category TEXT CHECK (category IN ('ai_basics', 'machine_learning', 'creative_ai', 'ethics')) NOT NULL,
  estimated_duration INTEGER CHECK (estimated_duration > 0) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100) DEFAULT 0,
  time_spent INTEGER CHECK (time_spent >= 0) DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  points INTEGER CHECK (points >= 0) DEFAULT 0,
  category TEXT CHECK (category IN ('learning', 'creativity', 'participation', 'milestone')) NOT NULL,
  criteria TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create learning_sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES learning_modules(id) ON DELETE SET NULL,
  session_type TEXT CHECK (session_type IN ('learning', 'game', 'creative')) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER CHECK (duration >= 0),
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_parent_id ON profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_start_time ON learning_sessions(start_time);

-- Create RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Parents can view their children's profiles
CREATE POLICY "Parents can view children profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.user_type = 'parent' 
      AND p.id = profiles.parent_id
    )
  );

-- Learning modules policies (public read, admin write)
CREATE POLICY "Anyone can view active learning modules" ON learning_modules
  FOR SELECT USING (is_active = true);

-- User progress policies
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Parents can view their children's progress
CREATE POLICY "Parents can view children progress" ON user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.user_type = 'parent' 
      AND p.id = (
        SELECT parent_id FROM profiles WHERE user_id = user_progress.user_id
      )
    )
  );

-- Achievements policies (public read)
CREATE POLICY "Anyone can view active achievements" ON achievements
  FOR SELECT USING (is_active = true);

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Parents can view their children's achievements
CREATE POLICY "Parents can view children achievements" ON user_achievements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.user_type = 'parent' 
      AND p.id = (
        SELECT parent_id FROM profiles WHERE user_id = user_achievements.user_id
      )
    )
  );

-- Learning sessions policies
CREATE POLICY "Users can view their own sessions" ON learning_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON learning_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON learning_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Parents can view their children's sessions
CREATE POLICY "Parents can view children sessions" ON learning_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.user_type = 'parent' 
      AND p.id = (
        SELECT parent_id FROM profiles WHERE user_id = learning_sessions.user_id
      )
    )
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, user_type, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'child'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'New User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample learning modules
INSERT INTO learning_modules (title, description, content, difficulty_level, age_range, category, estimated_duration) VALUES
('What is AI?', 'Learn the basics of artificial intelligence in a fun way!', 'AI is like having a very smart friend who can help us solve problems...', 'beginner', '6-8', 'ai_basics', 15),
('How AI Sees the World', 'Discover how AI can recognize images and objects', 'Just like you can see and recognize things, AI can too!...', 'beginner', '6-8', 'ai_basics', 20),
('AI and Patterns', 'Learn how AI finds patterns in information', 'AI is really good at finding patterns, just like when you notice...', 'beginner', '7-9', 'machine_learning', 25),
('Creative AI Art', 'Create amazing art with the help of AI', 'Let''s use AI to make beautiful pictures and drawings...', 'intermediate', '8-11', 'creative_ai', 30),
('AI Ethics for Kids', 'Learn about being responsible with AI', 'It''s important to use AI in good ways and be kind...', 'beginner', '9-11', 'ethics', 20);

-- Insert sample achievements
INSERT INTO achievements (title, description, icon_url, points, category, criteria) VALUES
('First Steps', 'Complete your first learning module', '🎯', 10, 'learning', 'Complete 1 module'),
('AI Explorer', 'Complete 5 learning modules', '🚀', 50, 'learning', 'Complete 5 modules'),
('Creative Mind', 'Create your first AI art project', '🎨', 25, 'creativity', 'Complete 1 creative project'),
('Dedicated Learner', 'Spend 1 hour learning', '⏰', 30, 'participation', 'Accumulate 60 minutes of learning time'),
('Pattern Master', 'Complete the AI and Patterns module', '🔍', 20, 'milestone', 'Complete specific module'),
('Ethics Champion', 'Learn about AI ethics', '🤝', 15, 'milestone', 'Complete ethics module');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_modules_updated_at BEFORE UPDATE ON learning_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
