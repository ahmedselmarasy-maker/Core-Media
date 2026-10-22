-- Run in the OLD Supabase SQL Editor only if it is available.
-- READ ONLY: does not insert, update, or delete anything.
-- Copy the value of cms_json into data/cms.json on the STAGING branch.
-- NOTE: If the current DB is incomplete, do not publish an empty result.
SELECT jsonb_pretty(
  jsonb_build_object(
    'version', 1,
    'updatedAt', now()::text,
    'brands', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', id,
          'name', name,
          'market', market,
          'egyptCategory', egypt_category,
          'media', COALESCE(media, '[]'::jsonb),
          'coverUrl', COALESCE(cover_url, ''),
          'sortOrder', COALESCE(sort_order, 0)
        ) ORDER BY sort_order
      )
      FROM public.cm_brands
    ), '[]'::jsonb),
    'site', COALESCE((
      SELECT content FROM public.cm_site_settings WHERE id = 1 LIMIT 1
    ), '{}'::jsonb)
  )
) AS cms_json;
