// Script to insert questions into Supabase for Uncover app using admin privileges or a server function

const { createClient } = require('@supabase/supabase-js');

// Use environment variables or fallback to provided keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gdmoipkeobgdhinkavxp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkbW9pcGtlb2JnZGhpbmthdnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjI3NTksImV4cCI6MjA2NzE5ODc1OX0.dAvRRVCEXquITFPqq7wnNtk08Oq6yQ7g7jkWcUCRB9c';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase client with service role key if available, otherwise fallback to anon key
let supabase;
if (supabaseServiceRoleKey) {
  console.log('Using service role key for admin access');
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
} else {
  console.log('Service role key not provided, falling back to anon key. This might not bypass RLS.');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

const categories = [
  'family-friends',
  'dating-relationship',
  'fiction',
  'only-wrong-answers',
  'travel',
  'money',
  '18+',
  'randomized'
];

// Function to generate questions for a category
const generateQuestionsForCategory = (category) => {
  const questions = [];
  for (let i = 1; i <= 100; i++) {
    let content;
    switch(category) {
      case 'family-friends':
        content = generateFamilyFriendsQuestion(i);
        break;
      case 'dating-relationship':
        content = generateDatingRelationshipQuestion(i);
        break;
      case 'fiction':
        content = generateFictionQuestion(i);
        break;
      case 'only-wrong-answers':
        content = generateOnlyWrongAnswersQuestion(i);
        break;
      case 'travel':
        content = generateTravelQuestion(i);
        break;
      case 'money':
        content = generateMoneyQuestion(i);
        break;
      case '18+':
        content = generateAdultQuestion(i);
        break;
      case 'randomized':
        content = generateRandomizedQuestion(i);
        break;
      default:
        content = `Generic question ${i} for ${category}`;
    }
    questions.push({
      content,
      type: 'questions',
      category
    });
  }
  return questions;
};

// Specific question generators for each category
const generateFamilyFriendsQuestion = (index) => {
  const prompts = [
    `What's a family tradition that means a lot to you and why?`,
    `How has a friend influenced a major life decision you've made?`,
    `What's the most memorable family vacation you've been on?`,
    `Who's the family member you turn to for advice, and why?`,
    `What's a funny story about a family gathering that still makes you laugh?`,
    `How do you stay connected with friends who live far away?`,
    `What's a lesson about friendship you learned the hard way?`,
    `What's a small gesture from a family member that made a big impact on you?`,
    `How do you handle disagreements with close friends?`,
    `What's a childhood memory with a sibling or cousin that shaped who you are?`
  ];
  return prompts[index % 10] || `What's a meaningful memory with family or friends that you cherish (Question ${index})?`;
};

const generateDatingRelationshipQuestion = (index) => {
  const prompts = [
    `What's the most romantic gesture you've ever made or received?`,
    `How do you know when you've found 'the one'?`,
    `What's a relationship lesson you wish you learned earlier?`,
    `What's the most important quality you look for in a partner?`,
    `How do you keep the spark alive in a long-term relationship?`,
    `What's a memorable first date story you have?`,
    `How do you handle differences in communication styles with a partner?`,
    `What's something small your partner does that makes you feel loved?`,
    `How do you balance personal space and togetherness in a relationship?`,
    `What's a relationship goal you're currently working toward?`
  ];
  return prompts[index % 10] || `What's a key aspect of a healthy relationship for you (Question ${index})?`;
};

const generateFictionQuestion = (index) => {
  const prompts = [
    `If you could live in any fictional world, where would it be and why?`,
    `What's a fictional character you relate to deeply, and why?`,
    `If you could have any superpower, what would it be and how would you use it?`,
    `What's a book or movie plot twist that still amazes you?`,
    `If you could write a sequel to any story, which one would it be?`,
    `What's a fictional friendship or relationship you admire?`,
    `If you could be any mythical creature, what would you choose?`,
    `What's a fictional setting you'd love to explore in real life?`,
    `If you could meet any author or creator, who would it be and what would you ask?`,
    `What's a story that changed the way you see the world?`
  ];
  return prompts[index % 10] || `What's a fictional story or character that inspires you (Question ${index})?`;
};

const generateOnlyWrongAnswersQuestion = (index) => {
  const prompts = [
    `What's the worst advice you've ever received, and did you follow it?`,
    `What's a hilarious mistake you made that turned out okay?`,
    `What's the most ridiculous thing you've believed to be true?`,
    `What's a funny misunderstanding you've had with someone?`,
    `What's the worst gift you've ever given or received?`,
    `What's a silly rule you had to follow as a kid?`,
    `What's the most absurd trend or fad you participated in?`,
    `What's a comical failure you've had in the kitchen?`,
    `What's the weirdest thing you've done just to see what would happen?`,
    `What's a funny 'wrong answer' you've given on purpose?`
  ];
  return prompts[index % 10] || `What's a humorous blunder you've made (Question ${index})?`;
};

const generateTravelQuestion = (index) => {
  const prompts = [
    `What's the most unforgettable place you've traveled to, and why?`,
    `If you could travel anywhere in the world, where would you go?`,
    `What's a travel experience that changed your perspective?`,
    `What's the best food you've tried while traveling?`,
    `What's a travel mishap that turned into a great story?`,
    `What's a cultural tradition you discovered while traveling?`,
    `What's the most beautiful natural wonder you've seen in person?`,
    `What's a travel destination on your bucket list, and why?`,
    `What's a memorable interaction you had with a local while traveling?`,
    `What's the most adventurous thing you've done on a trip?`
  ];
  return prompts[index % 10] || `What's a travel memory that stands out to you (Question ${index})?`;
};

const generateMoneyQuestion = (index) => {
  const prompts = [
    `What's the best financial advice you've ever received?`,
    `What's a money-saving tip that has worked well for you?`,
    `What's the most valuable thing you've ever bought, and why?`,
    `How do you decide when to splurge on something expensive?`,
    `What's a financial goal you're working toward right now?`,
    `What's the most important lesson you've learned about money?`,
    `What's a creative way you've earned extra cash?`,
    `How do you budget for things you love without overspending?`,
    `What's a purchase you regretted, and what did you learn from it?`,
    `What's something you'd spend a lot of money on if you could afford it?`
  ];
  return prompts[index % 10] || `What's a money-related lesson or goal that matters to you (Question ${index})?`;
};

const generateAdultQuestion = (index) => {
  const prompts = [
    `What's something you've learned about intimacy over the years?`,
    `How do you communicate your needs in a relationship?`,
    `What's a romantic fantasy you've always wanted to explore?`,
    `What's the most important aspect of physical connection for you?`,
    `How do you keep passion alive in a long-term relationship?`,
    `What's a personal boundary you set in intimate relationships?`,
    `What's something you've discovered about your own desires?`,
    `How do you handle differences in preferences with a partner?`,
    `What's a memorable moment of connection you've shared with someone?`,
    `What's a relationship topic you wish people discussed more openly?`
  ];
  return prompts[index % 10] || `What's an aspect of deeper connection that matters to you (Question ${index})?`;
};

const generateRandomizedQuestion = (index) => {
  const prompts = [
    `What's the most unexpected thing you've learned about yourself?`,
    `If you could have any talent instantly, what would you choose?`,
    `What's a hobby you've always wanted to try, and why?`,
    `What's the most spontaneous thing you've ever done?`,
    `What's a random act of kindness that made your day?`,
    `If you could switch lives with someone for a day, who would it be?`,
    `What's a quirky habit or interest you have that surprises people?`,
    `What's the weirdest food combination you enjoy?`,
    `What's a random memory from your past that still makes you smile?`,
    `If you could time travel, would you go to the past or future, and why?`
  ];
  return prompts[index % 10] || `What's a unique or random thought about life you have (Question ${index})?`;
};

// Function to create a stored procedure or RPC for inserting content
const createInsertFunction = async () => {
  try {
    const functionSQL = `
      CREATE OR REPLACE FUNCTION insert_content(content_text TEXT, content_type TEXT, content_category TEXT)
      RETURNS UUID AS $$
      DECLARE
        new_id UUID;
      BEGIN
        INSERT INTO content (content, type, category)
        VALUES (content_text, content_type, content_category)
        RETURNING id INTO new_id;
        RETURN new_id;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    const { data, error } = await supabase.rpc('create_function', { function_definition: functionSQL });
    if (error) {
      console.error('Error creating insert function:', error);
      return false;
    }
    console.log('Insert function created:', data);
    return true;
  } catch (err) {
    console.error('Supabase connection error while creating function:', err);
    return false;
  }
};

// Function to insert questions using RPC if available, or direct insert
const insertQuestions = async (questions) => {
  try {
    // Check if we can use RPC
    const { data: rpcExists, error: rpcCheckError } = await supabase.rpc('function_exists', { function_name: 'insert_content' });
    if (rpcCheckError) {
      console.log('Could not check if RPC exists, falling back to direct insert:', rpcCheckError);
    }

    if (rpcExists) {
      console.log('Using RPC for insertion');
      for (const question of questions) {
        const { data, error } = await supabase.rpc('insert_content', {
          content_text: question.content,
          content_type: question.type,
          content_category: question.category
        });
        if (error) {
          console.error(`Error inserting question via RPC: ${question.content}`, error);
        } else {
          console.log(`Inserted question via RPC: ${question.content}`);
        }
      }
      return true;
    } else {
      console.log('RPC not available, attempting direct insert');
      const { data, error } = await supabase
        .from('content')
        .insert(questions);

      if (error) {
        console.error('Error inserting questions:', error);
        return false;
      }
      console.log('Successfully inserted questions:', data);
      return true;
    }
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
};

// Main function to run the script
const main = async () => {
  // First, attempt to create the insert function if we have privileges
  console.log('Attempting to create insert function in Supabase...');
  const functionCreated = await createInsertFunction();
  if (functionCreated) {
    console.log('Function created successfully, proceeding with insertion via RPC.');
  } else {
    console.log('Could not create function, will attempt direct insertion or RPC if it already exists.');
  }

  for (const category of categories) {
    console.log(`Generating questions for ${category}...`);
    const questions = generateQuestionsForCategory(category);
    console.log(`Inserting 100 questions for ${category}...`);
    const success = await insertQuestions(questions);
    if (success) {
      console.log(`Successfully inserted questions for ${category}`);
    } else {
      console.log(`Failed to insert questions for ${category}`);
    }
  }
};

main().catch(err => console.error('Script error:', err));
