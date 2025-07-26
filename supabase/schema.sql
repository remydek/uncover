-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('situation', 'dilemma', 'questions')),
  category TEXT NOT NULL CHECK (category IN ('family-friends', 'dating-relationship', 'fiction', 'only-wrong-answers', 'travel', 'money', '18+', 'randomized')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_type_category ON content(type, category);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at);

-- Enable Row Level Security
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for content (public read access)
CREATE POLICY "Content is publicly readable" ON content
  FOR SELECT USING (true);

-- Create policies for user_favorites (users can only access their own favorites)
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Insert sample content
INSERT INTO content (content, type, category) VALUES
-- Family & Friends - Situations
('Imagine you and your friend are out hiking in the woods when suddenly you both come across a bear. The bear runs towards you. You have no weapons or means of defending yourselves. What would you do in this situation?', 'situation', 'family-friends'),
('Your best friend asks you to lie to their parents about where they were last night. They were doing something they shouldn''t have been doing. What would you do?', 'situation', 'family-friends'),
('You discover your sibling has been secretly dating someone your parents would disapprove of. They beg you not to tell anyone. What would you do?', 'situation', 'family-friends'),

-- Dating & Relationship - Dilemmas
('Your partner insists on wearing clothes that you find really unflattering, such as crocs or a fedora. Would you try to gently suggest a different wardrobe, or would you learn to love them no matter what they wear?', 'dilemma', 'dating-relationship'),
('You discover your partner has been keeping a secret hobby that you find embarrassing. Do you confront them about it or accept it as part of who they are?', 'dilemma', 'dating-relationship'),
('Your partner wants to move to a different city for their dream job, but it would mean leaving your family and friends behind. What would you choose?', 'dilemma', 'dating-relationship'),

-- Dating & Relationship - Questions
('What''s the most important quality you look for in a romantic partner, and why does it matter so much to you?', 'questions', 'dating-relationship'),
('If you could change one thing about how you approach relationships, what would it be?', 'questions', 'dating-relationship'),
('What''s a relationship deal-breaker that others might find surprising?', 'questions', 'dating-relationship'),

-- Travel - Situations
('You''re traveling alone in a foreign country and realize you''ve lost your passport and wallet. You don''t speak the local language. What''s your first move?', 'situation', 'travel'),
('You''re on a dream vacation when you witness someone being robbed. The perpetrator notices you watching. What would you do?', 'situation', 'travel'),

-- Travel - Questions
('If you could live in any country for a year, where would you go and what would you want to experience?', 'questions', 'travel'),
('What''s the most spontaneous travel decision you''ve ever made, and how did it turn out?', 'questions', 'travel'),

-- Money - Dilemmas
('You find a wallet on the street with $500 cash and an ID. Would you return it immediately, keep the money, or try to find the owner first?', 'dilemma', 'money'),
('Your friend asks to borrow a significant amount of money for an emergency, but they have a history of not paying back loans. What would you do?', 'dilemma', 'money'),

-- Fiction - Situations
('You wake up one morning and discover you can read everyone''s thoughts. How would you use this power, and what would be your biggest concern?', 'situation', 'fiction'),
('You''re offered a pill that would make you incredibly intelligent but reduce your emotional capacity. Would you take it?', 'situation', 'fiction'),

-- Only Wrong Answers - Questions
('What''s the best way to make a first impression on a date?', 'questions', 'only-wrong-answers'),
('How should you handle a job interview?', 'questions', 'only-wrong-answers'),

-- 18+ Content
('What''s something you''ve never told anyone about your past relationships?', 'questions', '18+'),
('If you could have a completely honest conversation with your ex, what would you want to know?', 'questions', '18+');

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
