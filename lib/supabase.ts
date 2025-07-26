import { createClient } from '@supabase/supabase-js'

// Use hardcoded demo values if environment variables are not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-key-for-fallback-only'

// Create the Supabase client with proper OAuth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Always use mock data since we don't have valid Supabase credentials
const mockContent: ContentItem[] = [
  {
    id: '1',
    content: 'Your partner insists on wearing clothes that you find really unflattering, such as crocs or a fedora. Would you try to gently suggest a different wardrobe, or would you learn to love them no matter what they wear?',
    type: 'dilemma',
    category: 'dating-relationship',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    content: 'You discover your best friend has been talking behind your back to mutual friends. What would you do?',
    type: 'situation',
    category: 'family-friends',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    content: 'What is the most embarrassing thing that has ever happened to you in public?',
    type: 'questions',
    category: 'randomized',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    content: 'You find a wallet on the ground with $500 cash and no ID. What do you do?',
    type: 'dilemma',
    category: 'money',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    content: 'Your flight gets cancelled and you\'re stuck at the airport overnight. How do you make the best of it?',
    type: 'situation',
    category: 'travel',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Check if we have valid Supabase credentials
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  // Check if we have valid-looking credentials
  return url.startsWith('http') && key.startsWith('eyJ')
}

// Generate additional mock content based on type and category
function generateMockContentForTypeAndCategory(type: ContentType, category: Category): ContentItem[] {
  const mockItems: ContentItem[] = [];
  
  // Generate different content based on type
  if (type === 'questions') {
    mockItems.push(
      {
        id: `q-${category}-1`,
        content: `What's your favorite memory related to ${getCategoryDisplayName(category)}?`,
        type: 'questions',
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `q-${category}-2`,
        content: `If you could change one thing about ${getCategoryDisplayName(category)}, what would it be?`,
        type: 'questions',
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `q-${category}-3`,
        content: `What's something about ${getCategoryDisplayName(category)} that most people don't know?`,
        type: 'questions',
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );
  } else if (type === 'dilemma') {
    mockItems.push(
      {
        id: `d-${category}-1`,
        content: `Would you rather give up ${getCategoryDisplayName(category)} for a year or lose your phone for a month?`,
        type: 'dilemma',
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `d-${category}-2`,
        content: `If you had to choose between being famous for ${getCategoryDisplayName(category)} or being wealthy but unknown, which would you pick?`,
        type: 'dilemma',
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );
  } else if (type === 'situation') {
    mockItems.push(
      {
        id: `s-${category}-1`,
        content: `You're offered a dream opportunity related to ${getCategoryDisplayName(category)}, but it requires moving to another country. What would you do?`,
        type: 'situation',
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `s-${category}-2`,
        content: `You discover a secret about ${getCategoryDisplayName(category)} that could change everything. How do you handle it?`,
        type: 'situation',
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );
  }
  
  return mockItems;
}

// Helper function to get display name for categories
function getCategoryDisplayName(categoryId: string): string {
  const categoryMap: { [key: string]: string } = {
    'family-friends': 'Family & Friends',
    'dating-relationship': 'Dating & Relationships',
    'fiction': 'Fiction',
    'only-wrong-answers': 'Only Wrong Answers',
    'travel': 'Travel',
    'money': 'Money',
    '18+': 'Adult Content',
    'randomized': 'Random Topics'
  };
  return categoryMap[categoryId] || categoryId;
}

export type ContentType = 'situation' | 'dilemma' | 'questions'
export type Category = 'family-friends' | 'dating-relationship' | 'fiction' | 'only-wrong-answers' | 'travel' | 'money' | '18+' | 'randomized'

export interface ContentItem {
  id: string
  content: string
  type: ContentType
  category: Category
  created_at: string
  updated_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  content_id: string
  created_at: string
}

// Database functions
export async function getContentByTypeAndCategory(type: ContentType, category: Category): Promise<ContentItem[]> {
  console.log(`Getting content for type: ${type}, category: ${category}`)
  
  // Generate more mock data for the specific type and category
  const specificMockData = generateMockContentForTypeAndCategory(type, category)
  
  // Combine with general mock data that matches the criteria
  const filteredMockData = mockContent.filter(item => 
    item.type === type && (item.category === category || item.category === 'randomized')
  )
  
  // Combine and return both sets of data
  const combinedData = [...specificMockData, ...filteredMockData]
  
  // Simulate network delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log(`Returning ${combinedData.length} items for ${type}/${category}`)
  return combinedData
}

export async function getRandomContent(limit: number = 10): Promise<ContentItem[]> {
  console.log(`Getting random content, limit: ${limit}`)
  
  // Get all available mock data
  const allMockData = [
    ...mockContent,
    ...generateMockContentForTypeAndCategory('questions', 'randomized'),
    ...generateMockContentForTypeAndCategory('dilemma', 'randomized'),
    ...generateMockContentForTypeAndCategory('situation', 'randomized')
  ]
  
  // Shuffle the data
  const shuffled = [...allMockData].sort(() => Math.random() - 0.5)
  
  // Simulate network delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log(`Returning ${Math.min(shuffled.length, limit)} random items`)
  return shuffled.slice(0, limit)
}

export async function addToFavorites(userId: string, contentId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    // Mock implementation - just return true for demo purposes
    console.log('Mock: Adding to favorites:', contentId)
    return true
  }

  try {
    const { error } = await supabase
      .from('user_favorites')
      .insert([
        { user_id: userId, content_id: contentId }
      ])

    if (error) {
      console.error('Error adding to favorites:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Supabase connection error:', err)
    return false
  }
}

export async function removeFromFavorites(userId: string, contentId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    // Mock implementation - just return true for demo purposes
    console.log('Mock: Removing from favorites:', contentId)
    return true
  }

  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', contentId)

    if (error) {
      console.error('Error removing from favorites:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Supabase connection error:', err)
    return false
  }
}

export async function getUserFavorites(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    // Mock implementation - return empty array for demo purposes
    console.log('Mock: Getting user favorites for:', userId)
    return []
  }

  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('content_id')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user favorites:', error)
      return []
    }

    return data?.map(item => item.content_id) || []
  } catch (err) {
    console.error('Supabase connection error:', err)
    return []
  }
}
