import { NextResponse } from 'next/server';
import { createClient, PostgrestError } from '@supabase/supabase-js';

type CSVRecord = {
  content: string;
  type: string;
  category: string;
};

// Initialize Supabase client with service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to parse CSV text with category validation
async function parseCSV(text: string): Promise<CSVRecord[]> {
  return new Promise((resolve, reject) => {
    const records: CSVRecord[] = [];
    
    // Valid categories based on the constraint
    const validCategories = [
      'family-friends',
      'dating-relationship',
      'work-career',
      'personal-growth',
      'fun-social',
      'general'
    ];
    
    // Create a simple CSV parser
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Skip header if it exists
    const startIndex = lines[0].toLowerCase().includes('content,type,category') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      try {
        // Simple CSV parsing - split by comma, handle quoted values
        const [content = '', type = '', category = ''] = line
          .split(',')
          .map(field => field.trim().replace(/^"|"$/g, ''));
        
        // Validate category
        let validCategory = category.trim().toLowerCase();
        if (!validCategories.includes(validCategory)) {
          console.warn(`Invalid category: ${category}, using 'general' instead`);
          validCategory = 'general';
        }
        
        if (content && type) {
          records.push({
            content: content.trim(),
            type: type.trim().toLowerCase(),
            category: validCategory,
          });
        }
      } catch (error) {
        console.warn(`Skipping malformed line: ${line}`);
      }
    }
    
    if (records.length === 0) {
      reject(new Error('No valid records found in CSV'));
    } else {
      console.log(`Parsed ${records.length} valid records from CSV`);
      resolve(records);
    }
  });
}

export async function POST(request: Request) {
  try {
    // Check for API key in the environment
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server misconfiguration: Missing Supabase service role key' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const csvText = formData.get('csvText') as string | null;

    if (!file && !csvText) {
      return NextResponse.json(
        { error: 'Please provide either a file or CSV text' },
        { status: 400 }
      );
    }

    let records: CSVRecord[] = [];

    try {
      if (file) {
        // Handle file upload
        const fileContents = await file.text();
        records = await parseCSV(fileContents);
      } else if (csvText) {
        // Handle pasted text
        records = await parseCSV(csvText);
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      return NextResponse.json(
        { 
          error: 'Failed to parse CSV',
          details: error instanceof Error ? error.message : 'Unknown error' 
        },
        { status: 400 }
      );
    }

    // Check if we have any valid records
    if (records.length === 0) {
      return NextResponse.json(
        { error: 'No valid records to import' },
        { status: 400 }
      );
    }

    try {
      // Comprehensive debugging
      console.log('=== CSV Import Debug Info ===');
      console.log('Supabase URL:', supabaseUrl);
      console.log('Service Key Present:', !!supabaseServiceKey);
      console.log('Testing Supabase connection...');
      
      // Test if we can even connect to the database
      try {
        const { data: testData, error: testError } = await supabase
          .from('content')
          .select('count')
          .limit(1);
        
        console.log('Connection test result:', { data: testData, error: testError });
        
        if (testError) {
          throw new Error(`Database connection failed: ${testError.message} (${testError.code || 'no code'})`);
        }
        
        console.log('Database connection successful');
        
        // Test table structure
        console.log('Testing table structure...');
        const { data: structureData, error: structureError } = await supabase
          .from('content')
          .select('*')
          .limit(1);
        
        console.log('Table structure test:', { data: structureData, error: structureError });
        
      } catch (connError) {
        console.error('Database connection error:', connError);
        throw new Error(`Database connection failed: ${connError instanceof Error ? connError.message : 'Unknown connection error'}`);
      }
      
      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('content')
        .select('*')
        .limit(1);

      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('Supabase connection successful');
      
      // Test if the stored procedure exists
      console.log('Testing stored procedure...');
      const { data: procTest, error: procError } = await supabase.rpc('insert_content_with_rls_bypass', {
        content_text: 'Test connection',
        content_type: 'test',
        content_category: 'test'
      });
      
      if (procError) {
        console.error('Stored procedure test failed:', procError);
        throw new Error(`Stored procedure error: ${procError.message}`);
      }
      
      console.log('Stored procedure test successful:', procTest);
      
      // Use direct insertion with service role key (bypasses RLS)
      let insertedCount = 0;
      const errors: string[] = [];
      
      console.log('Attempting direct insertion with service role key...');
      
      for (const record of records) {
        try {
          console.log('Inserting record:', record);
          
          const { data, error } = await supabase
            .from('content')
            .insert({
              content: record.content,
              type: record.type,
              category: record.category
            })
            .select();
          
          console.log('Insert result:', { data, error });
          
          if (error) {
            console.error('Insert error details:', {
              message: error.message,
              code: error.code,
              details: error.details,
              hint: error.hint
            });
            throw new Error(`Insert failed: ${error.message} (${error.code || 'no code'})`);
          }
          
          insertedCount++;
          console.log(`Successfully inserted: ${record.content.substring(0, 50)}...`);
          
        } catch (error) {
          console.error('Detailed insert error:', {
            record: record,
            error: error instanceof Error ? error.message : error
          });
          errors.push(`Failed: ${record.content.substring(0, 50)}... - ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      if (errors.length > 0) {
        console.error('Some records failed to import:', errors);
        if (insertedCount === 0) {
          throw new Error(`Failed to import any records. Errors: ${errors.join('; ')}`);
        } else {
          // Some records were imported, but not all
          console.warn(`Imported ${insertedCount} records with ${errors.length} errors`);
        }
      }

      return NextResponse.json({ 
        success: true, 
        count: insertedCount,
        message: `Successfully imported ${insertedCount} records`
      });
      
    } catch (error) {
      console.error('Database operation failed:', error);
      return NextResponse.json(
        { 
          error: 'Failed to insert records into database',
          details: error instanceof Error ? error.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
