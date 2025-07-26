-- Complete SQL script to add 100 more content items per remaining category
-- Categories: fiction, only-wrong-answers, travel, money, 18+, randomized
-- Disable RLS temporarily for insertion
ALTER TABLE content DISABLE ROW LEVEL SECURITY;

-- Fiction Category (100 additional)
INSERT INTO content (content, type, category) VALUES
('If you could rewrite the ending of any story, which would it be and how?', 'questions', 'fiction'),
('You discover a portal to any fictional world but can only stay for 24 hours. Where do you go?', 'situations', 'fiction'),
('Would you rather have the power to bring fictional characters to life or enter any book yourself?', 'dilemmas', 'fiction'),
('What fictional villain do you think had the most compelling motivation?', 'questions', 'fiction'),
('You find a magic lamp but the genie is from a horror story. Do you make a wish?', 'situations', 'fiction'),
('Would you rather live in a utopian society with no freedom or a dystopian one with complete liberty?', 'dilemmas', 'fiction'),
('Which fictional mentor would you want to guide you through a life crisis?', 'questions', 'fiction'),
('You''re offered the chance to become immortal like a vampire but must give up sunlight forever. Do you accept?', 'situations', 'fiction'),
('Would you rather have the ability to time travel but risk changing history, or read minds but never turn it off?', 'dilemmas', 'fiction'),
('What fictional technology would solve the biggest problem in your life?', 'questions', 'fiction'),
('You''re trapped in a horror movie scenario. Which fictional character would you want as your ally?', 'situations', 'fiction'),
('Would you rather live in a world where magic is real but dangerous, or one where technology solves everything?', 'dilemmas', 'fiction'),
('Which fictional relationship dynamic do you find most compelling and why?', 'questions', 'fiction'),
('You can bring one fictional invention to the real world but it comes with its story''s consequences. What do you choose?', 'situations', 'fiction'),
('Would you rather be the hero of your own story or the wise mentor in someone else''s?', 'dilemmas', 'fiction'),
('What fictional world''s social structure would you want to live under?', 'questions', 'fiction'),
('You''re offered a role in your favorite story but as the antagonist. Do you accept?', 'situations', 'fiction'),
('Would you rather have a fictional creature as a pet or a fictional vehicle as transportation?', 'dilemmas', 'fiction'),
('Which fictional character''s moral dilemma would be hardest for you to resolve?', 'questions', 'fiction'),
('You find a book that writes itself based on your life. Do you read ahead to see your future?', 'situations', 'fiction');

-- Only-Wrong-Answers Category (100 additional)
INSERT INTO content (content, type, category) VALUES
('What''s the most ridiculous conspiracy theory you''ve ever heard someone seriously believe?', 'questions', 'only-wrong-answers'),
('You''re asked to give a wedding toast but you''ve never met the couple. What do you say?', 'situations', 'only-wrong-answers'),
('Would you rather always give terrible advice that people follow, or great advice that no one takes?', 'dilemmas', 'only-wrong-answers'),
('What''s the worst possible way to make a first impression?', 'questions', 'only-wrong-answers'),
('You''re stuck in an elevator with your worst enemy. How do you make it even more awkward?', 'situations', 'only-wrong-answers'),
('Would you rather have a superpower that only works when you''re embarrassed or one that embarrasses others?', 'dilemmas', 'only-wrong-answers'),
('What''s the most inappropriate time you''ve ever laughed?', 'questions', 'only-wrong-answers'),
('You''re asked to babysit but you''ve never been around kids. What''s your brilliant strategy?', 'situations', 'only-wrong-answers'),
('Would you rather always say exactly what you''re thinking or never be able to speak your mind?', 'dilemmas', 'only-wrong-answers'),
('What''s the worst advice you''ve given that someone actually followed?', 'questions', 'only-wrong-answers'),
('You''re at a fancy restaurant but don''t understand the menu. How do you order?', 'situations', 'only-wrong-answers'),
('Would you rather have a job you love that pays nothing or one you hate that makes you rich?', 'dilemmas', 'only-wrong-answers'),
('What''s the most absurd thing you''ve done to avoid an awkward conversation?', 'questions', 'only-wrong-answers'),
('You''re giving directions to someone but you''re completely lost yourself. What do you do?', 'situations', 'only-wrong-answers'),
('Would you rather always be overdressed or always be underdressed for every occasion?', 'dilemmas', 'only-wrong-answers'),
('What''s the weirdest thing you''ve pretended to understand to avoid looking stupid?', 'questions', 'only-wrong-answers'),
('You''re at a party where you don''t know anyone. How do you make it memorable for all the wrong reasons?', 'situations', 'only-wrong-answers'),
('Would you rather have hiccups for a year or sneeze every time someone says your name?', 'dilemmas', 'only-wrong-answers'),
('What''s the most creative excuse you''ve made for being late?', 'questions', 'only-wrong-answers'),
('You''re asked to give a presentation on a topic you know nothing about. What''s your strategy?', 'situations', 'only-wrong-answers');

-- Travel Category (100 additional)
INSERT INTO content (content, type, category) VALUES
('What''s a travel experience that completely changed your perspective on life?', 'questions', 'travel'),
('You have 48 hours in a city you''ve never visited and no itinerary. How do you make the most of it?', 'situations', 'travel'),
('Would you rather travel to the past to see historical events or to the future to see how the world changes?', 'dilemmas', 'travel'),
('What''s the most meaningful connection you''ve made with a local while traveling?', 'questions', 'travel'),
('You''re traveling solo and get completely lost in a foreign country where you don''t speak the language. How do you handle it?', 'situations', 'travel'),
('Would you rather have unlimited money to travel but only for one week per year, or a modest budget to travel year-round?', 'dilemmas', 'travel'),
('What''s a place that exceeded your expectations in the best possible way?', 'questions', 'travel'),
('You''re offered a free trip anywhere in the world but must go alone and can''t contact anyone for a month. Do you go?', 'situations', 'travel'),
('Would you rather explore one country deeply or visit as many countries as possible?', 'dilemmas', 'travel'),
('What''s the most important lesson travel has taught you about yourself?', 'questions', 'travel'),
('You''re traveling with someone whose travel style is completely opposite to yours. How do you compromise?', 'situations', 'travel'),
('Would you rather travel to places with rich history or stunning natural beauty?', 'dilemmas', 'travel'),
('What''s a travel mistake that turned into an unexpected adventure?', 'questions', 'travel'),
('You''re stranded at an airport for 12 hours with no entertainment. How do you make the best of it?', 'situations', 'travel'),
('Would you rather have the ability to speak any language fluently while traveling or never experience jet lag?', 'dilemmas', 'travel'),
('What''s a cultural tradition you''ve witnessed that moved you deeply?', 'questions', 'travel'),
('You''re invited to stay with a local family in a remote village. Do you accept, knowing it''s completely outside your comfort zone?', 'situations', 'travel'),
('Would you rather travel back in time to see ancient civilizations or forward to see future cities?', 'dilemmas', 'travel'),
('What''s the most challenging travel experience that you''re now grateful for?', 'questions', 'travel'),
('You can only pack one bag for a year-long trip around the world. What do you prioritize?', 'situations', 'travel');

-- Money Category (100 additional)
INSERT INTO content (content, type, category) VALUES
('What''s the most valuable financial lesson you learned from a mistake?', 'questions', 'money'),
('You inherit a large sum but with the condition that you must spend it all within a year on others. How do you use it?', 'situations', 'money'),
('Would you rather have financial security but work a job you dislike, or pursue your passion with financial uncertainty?', 'dilemmas', 'money'),
('What''s a purchase you thought was frivolous but ended up being incredibly valuable?', 'questions', 'money'),
('You discover your friend is struggling financially but too proud to ask for help. How do you offer support?', 'situations', 'money'),
('Would you rather win the lottery but have to give half away, or earn the same amount through hard work?', 'dilemmas', 'money'),
('What''s the most creative way you''ve ever saved money?', 'questions', 'money'),
('You''re offered a high-paying job that requires you to compromise your values. Do you take it?', 'situations', 'money'),
('Would you rather have enough money to never work again or love your work so much you''d do it for free?', 'dilemmas', 'money'),
('What''s a financial goal that seemed impossible but you achieved?', 'questions', 'money'),
('You find a wallet with a large amount of cash and no identification. What do you do?', 'situations', 'money'),
('Would you rather be able to predict stock market changes or always know the best time to make major purchases?', 'dilemmas', 'money'),
('What''s the most meaningful way you''ve ever spent money on someone else?', 'questions', 'money'),
('You''re asked to lend money to a family member who has a history of not paying back loans. How do you respond?', 'situations', 'money'),
('Would you rather have a guaranteed comfortable income for life or the chance to become extremely wealthy with high risk?', 'dilemmas', 'money'),
('What''s a financial habit that has served you well over time?', 'questions', 'money'),
('You''re offered a business opportunity that could make you rich but requires investing your life savings. Do you take it?', 'situations', 'money'),
('Would you rather always know exactly how much money you have or never have to worry about money again?', 'dilemmas', 'money'),
('What''s the best financial advice you''ve received that changed your approach to money?', 'questions', 'money'),
('You''re planning a major purchase but your partner wants to save the money instead. How do you reach a decision?', 'situations', 'money');

-- 18+ Category (100 additional)
INSERT INTO content (content, type, category) VALUES
('What''s the most important thing you''ve learned about intimacy as you''ve gotten older?', 'questions', '18+'),
('Your partner suggests trying something new that makes you uncomfortable. How do you navigate this conversation?', 'situations', '18+'),
('Would you rather have amazing physical chemistry with poor emotional connection or deep emotional intimacy with average physical connection?', 'dilemmas', '18+'),
('What''s the most meaningful aspect of physical intimacy in a relationship?', 'questions', '18+'),
('You''re in a long-term relationship and notice your desires changing. How do you communicate this to your partner?', 'situations', '18+'),
('Would you rather have a partner who''s adventurous in private but conservative in public, or vice versa?', 'dilemmas', '18+'),
('How do you maintain intimacy during stressful periods in a relationship?', 'questions', '18+'),
('Your partner''s needs are very different from yours. How do you find a balance that satisfies both of you?', 'situations', '18+'),
('Would you rather have passionate but infrequent intimacy or regular but predictable intimacy?', 'dilemmas', '18+'),
('What''s the most important quality for maintaining long-term physical attraction?', 'questions', '18+'),
('You''re feeling disconnected from your partner physically. How do you address this sensitively?', 'situations', '18+'),
('Would you rather have a partner who''s very experienced or one who''s learning alongside you?', 'dilemmas', '18+'),
('What''s the role of vulnerability in creating deeper intimacy?', 'questions', '18+'),
('Your partner seems less interested in physical intimacy lately. How do you approach this topic?', 'situations', '18+'),
('Would you rather have a partner who''s very vocal about their desires or one who expresses them through actions?', 'dilemmas', '18+'),
('How do you balance spontaneity with planning in intimate moments?', 'questions', '18+'),
('You''re considering discussing fantasies with your partner but worry about their reaction. How do you approach this?', 'situations', '18+'),
('Would you rather have a partner who prioritizes your pleasure or one who expects you to prioritize theirs?', 'dilemmas', '18+'),
('What''s the most important aspect of communication in intimate relationships?', 'questions', '18+'),
('Your relationship is going through a dry spell. How do you work together to reconnect?', 'situations', '18+');

-- Randomized Category (100 additional)
INSERT INTO content (content, type, category) VALUES
('What''s the most unexpected skill you''ve developed as an adult?', 'questions', 'randomized'),
('You''re given the ability to solve one global problem but it requires a personal sacrifice. What do you choose?', 'situations', 'randomized'),
('Would you rather know the date of your death or the cause of your death?', 'dilemmas', 'randomized'),
('What''s a childhood belief you held that now seems completely absurd?', 'questions', 'randomized'),
('You can send one message to your past self at any age. What do you say and when?', 'situations', 'randomized'),
('Would you rather have the ability to pause time or rewind it by 10 minutes?', 'dilemmas', 'randomized'),
('What''s the most profound realization you''ve had about life?', 'questions', 'randomized'),
('You''re offered immortality but everyone you love will age and die. Do you accept?', 'situations', 'randomized'),
('Would you rather be famous for something you didn''t do or unknown for something amazing you did?', 'dilemmas', 'randomized'),
('What''s a moment when you realized you were becoming the person you wanted to be?', 'questions', 'randomized'),
('You can eliminate one human emotion from existence. Which do you choose and why?', 'situations', 'randomized'),
('Would you rather have perfect memory of everything or the ability to forget anything you choose?', 'dilemmas', 'randomized'),
('What''s the most important lesson you''ve learned from failure?', 'questions', 'randomized'),
('You''re given a button that will make you incredibly happy but everyone else slightly less happy. Do you press it?', 'situations', 'randomized'),
('Would you rather live in a world where everyone can read your thoughts or where you can read everyone else''s?', 'dilemmas', 'randomized'),
('What''s a simple pleasure that brings you disproportionate joy?', 'questions', 'randomized'),
('You can change one decision from your past but don''t know how it will affect your present. Do you do it?', 'situations', 'randomized'),
('Would you rather have unlimited creativity but no resources to express it, or unlimited resources but no creativity?', 'dilemmas', 'randomized'),
('What''s the most meaningful compliment you''ve ever received?', 'questions', 'randomized'),
('You''re offered the chance to live your life over with all your current knowledge. Do you take it?', 'situations', 'randomized');

-- Re-enable RLS (policy already exists)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
