-- Create a function to insert content with RLS bypass
create or replace function insert_content_with_rls_bypass(
  content_text text,
  content_type text,
  content_category text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.content (content, type, category)
  values (content_text, content_type, content_category)
  returning to_jsonb(public.content.*);
  
  return jsonb_build_object('success', true);
exception when others then
  return jsonb_build_object(
    'success', false,
    'error', sqlerrm,
    'error_detail', sqlstate
  );
end;
$$;

-- Grant execute permission to authenticated users
revoke all on function insert_content_with_rls_bypass from public;
grant execute on function insert_content_with_rls_bypass to authenticated;
