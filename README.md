# Core Media

Live Core Media website and admin dashboard, deployed from GitHub to Vercel.

- `index.html` is the public site. `admin.html` is the protected content editor.
- `data/cms.json` is the **only** CMS data file.
- Videos are linked from YouTube playlists or individual YouTube videos, not uploaded to the repository.
- Designs must be externally hosted direct HTTPS image URLs (WebP, JPG or PNG), for example Cloudinary or ImageKit. Image files are not uploaded into GitHub. The old file uploader is intentionally disabled.
- The live version does **not** depend on Supabase or on old client-project records.

## Deployment environment

Admin access requires `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPOSITORY`, and `GITHUB_BRANCH`. `YOUTUBE_API_KEY` is optional; playlist discovery falls back to the YouTube IFrame API.

Old client media and migration/setup files were deleted from the current branch. Prior Git commits and storage at external providers are separate.
