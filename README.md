# Uncover - Deep Conversations

A Tinder-style card interface for thought-provoking content designed to spark deep conversations and help people discover more about themselves and others.

## Features

- **Card Interface**: Full-screen cards with swipe gestures for navigation
- **Content Types**: 
  - **Dilemma**: Moral/ethical choice scenarios
  - **Situations**: "What would you do if..." scenarios  
  - **Questions**: Personal discovery prompts
- **Categories**: Family & Friends, Dating & Relationship, Fiction, Only wrong answers, Travel, Money, 18+, Randomized
- **Interactive Elements**: Heart (favorite/save), Refresh (skip/next), Swipe gestures
- **Authentication**: OAuth prompts after swiping (Google/Email)
- **Responsive Design**: Mobile-first with clean typography and gradient backgrounds

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom gradients
- **Animations**: React Spring + Use-Gesture for swipe interactions
- **Icons**: Lucide React
- **Database**: Supabase (ready for integration)
- **PWA**: Manifest.json for mobile app experience

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page (category selection)
│   ├── content-type/        # Content type selection page
│   └── cards/               # Card interface page
├── components/
│   ├── CategorySelection.tsx # Category selection screen
│   └── CardInterface.tsx    # Main card interface with swipe
├── public/
│   └── manifest.json        # PWA manifest
└── README.md
```

## Usage

1. **Select Category**: Choose from 8 different categories
2. **Choose Content Type**: Pick between Situation, Dilemma, or Questions
3. **Swipe Cards**: Swipe left/right or use action buttons
4. **Favorite Content**: Heart icon to save interesting cards
5. **Authentication**: Sign in after 3 swipes to continue

## Customization

- **Content**: Add your own questions in `CardInterface.tsx` or integrate with Supabase
- **Styling**: Modify colors and gradients in `tailwind.config.js`
- **Categories**: Add/remove categories in `CategorySelection.tsx`

## Deployment

The app is ready for deployment on Vercel, Netlify, or any Next.js hosting platform.

## Future Enhancements

- Supabase integration for dynamic content
- User profiles and saved favorites
- Social sharing features
- Offline mode with cached content
- Analytics and usage tracking
