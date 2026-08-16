// Supabase public config (safe to expose in frontend).
// 1) Create a Supabase project.
// 2) Copy Project URL + anon public key (Settings → API).
// 3) Paste them below, then deploy to Netlify.
//
// Notes:
// - Do NOT use the service_role key in the frontend.
// - This file is used by both `script.js` (public read) and `admin.js` (authenticated write).
window.CM_SUPABASE_URL = "https://dnrrstbdpvllyjaemhtd.supabase.co";
// Paste your Supabase "Publishable key" here (starts with: sb_publishable_)
window.CM_SUPABASE_ANON_KEY = "sb_publishable_Cp3k5sEIwOSPalLGsIecQA_9iLBYJ-l";

// Optional: the Storage bucket name used for portfolio media uploads.
window.CM_SUPABASE_BUCKET = "cm-portfolio";

