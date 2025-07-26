# Database Setup Instructions

To set up your Supabase database with the content schema:

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://gdmoipkeobgdhinkavxp.supabase.co
2. Navigate to the **SQL Editor** in the left sidebar
3. Copy and paste the entire contents of `supabase/schema.sql` into the editor
4. Click **Run** to execute the SQL

## Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Make sure you're in the project directory
cd /Users/billionaire/Documents/GitHub/Uncover

# Run the schema file
supabase db reset --db-url "postgresql://postgres:[YOUR_PASSWORD]@db.gdmoipkeobgdhinkavxp.supabase.co:5432/postgres"
```

## What the Schema Creates

- **content** table: Stores all questions, situations, and dilemmas
- **user_favorites** table: Stores user's favorited content
- **Sample data**: Pre-populated with content for all categories
- **Row Level Security**: Ensures data privacy
- **Indexes**: For optimal performance

## Verification

After running the schema, you should see:
- Tables created in your Supabase dashboard
- Sample content populated
- The app should now load real data from Supabase instead of sample data

## Next Steps

Once the database is set up, restart your development server:

```bash
npm run dev
```

The app will now fetch real content from your Supabase database!
