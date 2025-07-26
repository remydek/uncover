-- Create a simpler version of the insert function
CREATE OR REPLACE FUNCTION insert_content_with_rls_bypass(
  content_text text,
  content_type text,
  content_category text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.content (content, type, category)
  VALUES (content_text, content_type, content_category);
  
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error inserting content: %', SQLERRM;
  RETURN false;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION insert_content_with_rls_bypass(text, text, text) TO authenticated;
