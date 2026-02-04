# Supabase Setup (Cross-Device Sync)

This guide shows where to get the Supabase credentials needed for cross-device synchronization and how to wire them into the app.

## 1) Create a Supabase project
1. Go to https://app.supabase.com and sign in (GitHub or email).
2. Click **New project**.
3. Choose an organization, name the project, select a region, and create a database password.

## 2) Create the `participants` table
1. Open **Database > Table Editor**.
2. Click **New table** and name it `participants`.
3. Add the following columns:
   - `id` (text, primary key)
   - `name` (text)
   - `email` (text)
   - `day` (text)
   - `time` (text)
   - `duration` (text)
   - `sessionType` (text)
   - `learningPreferences` (text)
   - `timestamp` (timestamptz)
   - Optional fields for split sessions:
     - `numberOfSessions` (integer, nullable)
     - `sessionDuration` (integer, nullable)
     - `breakDuration` (integer, nullable)
   - `deleteToken` (text)

## 3) Get your Supabase URL + anon key
1. Open **Project Settings > API**.
2. Copy:
   - **Project URL**
   - **anon public key**

## 4) Add environment variables
Create `.env.local` in the project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 5) Configure Row Level Security (RLS)
1. Open **Authentication > Policies**.
2. Enable **RLS** on the `participants` table.
3. Add policies:
   - **Select**: allow all (read for everyone).
   - **Insert**: allow all (anyone can register).
   - **Delete**: restrict to requests that match `deleteToken` via an authenticated token.

Example policy for delete with token (requires Supabase Auth JWT with a deleteToken claim):
```sql
create policy "delete by token"
on public.participants
for delete
using (deleteToken = auth.jwt() ->> 'deleteToken');
```

If you do not plan to use authentication, do not expose delete from the client. Instead, use a secured backend endpoint or Supabase Edge Function that validates the deleteToken server-side with the service role key.

## 6) Test locally
1. Start the dev server: `npm run dev`
2. Register from one device.
3. Open the list on another device — the entry should appear.

## Troubleshooting
- **401 / 403 errors:** double-check RLS policies.
- **Missing data:** verify `NEXT_PUBLIC_SUPABASE_*` values and restart the dev server.
- **CORS errors:** confirm you are using the Project URL (not the REST endpoint).
