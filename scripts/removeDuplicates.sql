-- Script to find and remove duplicate content from the content table
-- This script will keep the oldest record (earliest created_at) for each duplicate

-- First, let's check for duplicates
SELECT 
    content,
    type,
    category,
    COUNT(*) as duplicate_count
FROM content 
GROUP BY content, type, category 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Show total count before cleanup
SELECT 'Total records before cleanup:' as info, COUNT(*) as count FROM content;

-- Remove duplicates, keeping the oldest record (first created)
-- This uses a CTE (Common Table Expression) to identify duplicates
WITH duplicate_records AS (
    SELECT 
        id,
        content,
        type,
        category,
        created_at,
        ROW_NUMBER() OVER (
            PARTITION BY content, type, category 
            ORDER BY created_at ASC
        ) as row_num
    FROM content
)
DELETE FROM content 
WHERE id IN (
    SELECT id 
    FROM duplicate_records 
    WHERE row_num > 1
);

-- Show total count after cleanup
SELECT 'Total records after cleanup:' as info, COUNT(*) as count FROM content;

-- Verify no duplicates remain
SELECT 
    content,
    type,
    category,
    COUNT(*) as duplicate_count
FROM content 
GROUP BY content, type, category 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
