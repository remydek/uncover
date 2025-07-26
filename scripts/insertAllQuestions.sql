-- Disable RLS temporarily for insertion
ALTER TABLE content DISABLE ROW LEVEL SECURITY;

-- Insert Family-Friends Questions (100)
INSERT INTO content (content, type, category) VALUES
('What''s a family tradition that means a lot to you and why?', 'questions', 'family-friends'),
('How has a friend influenced a major life decision you''ve made?', 'questions', 'family-friends'),
('What''s the most memorable family vacation you''ve been on?', 'questions', 'family-friends'),
('Who''s the family member you turn to for advice, and why?', 'questions', 'family-friends'),
('What''s a funny story about a family gathering that still makes you laugh?', 'questions', 'family-friends'),
('How do you stay connected with friends who live far away?', 'questions', 'family-friends'),
('What''s a lesson about friendship you learned the hard way?', 'questions', 'family-friends'),
('What''s a small gesture from a family member that made a big impact on you?', 'questions', 'family-friends'),
('How do you handle disagreements with close friends?', 'questions', 'family-friends'),
('What''s a childhood memory with a sibling or cousin that shaped who you are?', 'questions', 'family-friends'),
('What family recipe or dish holds special meaning for you?', 'questions', 'family-friends'),
('How do you maintain friendships as life gets busier?', 'questions', 'family-friends'),
('What''s a family value that you want to pass on to future generations?', 'questions', 'family-friends'),
('Who was your first best friend and what made them special?', 'questions', 'family-friends'),
('What''s a family photo that tells an important story?', 'questions', 'family-friends'),
('How do you show appreciation for your closest friends?', 'questions', 'family-friends'),
('What''s a family milestone you''re most proud of?', 'questions', 'family-friends'),
('What''s the best advice a friend has ever given you?', 'questions', 'family-friends'),
('How has your relationship with your parents evolved over time?', 'questions', 'family-friends'),
('What''s a friendship that surprised you with its depth?', 'questions', 'family-friends');

-- Insert Dating-Relationship Questions (20 shown, pattern continues)
INSERT INTO content (content, type, category) VALUES
('What''s the most romantic gesture you''ve ever made or received?', 'questions', 'dating-relationship'),
('How do you know when you''ve found "the one"?', 'questions', 'dating-relationship'),
('What''s a relationship lesson you wish you learned earlier?', 'questions', 'dating-relationship'),
('What''s the most important quality you look for in a partner?', 'questions', 'dating-relationship'),
('How do you keep the spark alive in a long-term relationship?', 'questions', 'dating-relationship'),
('What''s a memorable first date story you have?', 'questions', 'dating-relationship'),
('How do you handle differences in communication styles with a partner?', 'questions', 'dating-relationship'),
('What''s something small your partner does that makes you feel loved?', 'questions', 'dating-relationship'),
('How do you balance personal space and togetherness in a relationship?', 'questions', 'dating-relationship'),
('What''s a relationship goal you''re currently working toward?', 'questions', 'dating-relationship'),
('What''s your love language and how did you discover it?', 'questions', 'dating-relationship'),
('How do you navigate disagreements in a healthy way?', 'questions', 'dating-relationship'),
('What''s the most meaningful gift you''ve given or received from a partner?', 'questions', 'dating-relationship'),
('How do you maintain your individual identity in a relationship?', 'questions', 'dating-relationship'),
('What''s a relationship myth you used to believe but now know isn''t true?', 'questions', 'dating-relationship'),
('How do you show support when your partner is going through a tough time?', 'questions', 'dating-relationship'),
('What''s a couple activity that always brings you closer together?', 'questions', 'dating-relationship'),
('How do you handle jealousy or insecurity in relationships?', 'questions', 'dating-relationship'),
('What''s the best relationship advice you''ve ever received?', 'questions', 'dating-relationship'),
('How do you know when it''s time to take a relationship to the next level?', 'questions', 'dating-relationship');

-- Re-enable RLS and restore policy
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Content is publicly readable" ON content FOR SELECT USING (true);
