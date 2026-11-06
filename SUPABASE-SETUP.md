# Supabase setup (5 minutes, free)

1. Go to supabase.com → sign up → **New project** (any name, save the database password, pick the nearest region).
2. Left menu → **SQL Editor** → **New query** → paste this → **Run**:

```sql
create table reports (
  id text primary key,
  user_id uuid not null default auth.uid(),
  data jsonb not null,
  updated bigint
);
alter table reports enable row level security;
create policy "owner only" on reports for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

3. **Authentication → Users → Add user → Create new user**: enter your email + a password, tick *Auto confirm user*.
4. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up" (so only you can log in).
5. **Project Settings → API**: copy the **Project URL** and the **anon public** key.
6. In the tool: **Reports → ☁️ Cloud sync**, paste URL + key, enter your email + password, tap **Sign in**. Do the same on each device.

Only your login can read or write the reports; the anon key alone is useless.

---

## LessonStage library (PDF, PowerPoint, links and edits — files up to 100 MB)

Everything is saved in your Supabase project and shows up in **📚 Library** on every device where you are signed in (**Reports → ☁️ Cloud sync**, step 6).

### One-time Storage setup (needed for files bigger than 12 MB)

**SQL Editor → New query → paste this → Run** (safe to run again):

```sql
-- Run once in Supabase SQL Editor to enable larger LessonStage file uploads.
-- Creates a private bucket with a 100 MB per-file cap.
insert into storage.buckets (id, name, public, file_size_limit)
values ('lessonstage-library', 'lessonstage-library', false, 104857600)
on conflict (id) do update set public = false, file_size_limit = 104857600;

drop policy if exists "LessonStage users upload own files" on storage.objects;
drop policy if exists "LessonStage users read own files" on storage.objects;
drop policy if exists "LessonStage users update own files" on storage.objects;
drop policy if exists "LessonStage users delete own files" on storage.objects;

create policy "LessonStage users upload own files"
on storage.objects for insert to authenticated
with check (bucket_id = 'lessonstage-library' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "LessonStage users read own files"
on storage.objects for select to authenticated
using (bucket_id = 'lessonstage-library' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "LessonStage users update own files"
on storage.objects for update to authenticated
using (bucket_id = 'lessonstage-library' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'lessonstage-library' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "LessonStage users delete own files"
on storage.objects for delete to authenticated
using (bucket_id = 'lessonstage-library' and (storage.foldername(name))[1] = auth.uid()::text);
```

This creates a **private** bucket `lessonstage-library` (100 MB per file). Each signed-in user can only read and write files inside their own folder.

### What gets stored

| What | Where | Notes |
| --- | --- | --- |
| PDF / PowerPoint / image file | Storage bucket `lessonstage-library`, folder = your user id | up to **100 MB**; a small row `stage:<file name>\|<size>` in `reports` points to it |
| Website / YouTube link | `reports` row `stage:link\|<url>` | link only |
| Your edits for a file (drawings, slide notes, words, study cards) | `reports` row `stage:meta:<file name>\|<size>` | saved a few seconds after each change and when you switch tabs; loaded automatically when you open the same file again |

- Rows whose `id` starts with `stage:` are ignored by the Reports list.
- If the Storage SQL has **not** been run, files up to 12 MB still sync the old way (inside the `reports` table); bigger files stay on that device only and Stage tells you to run the SQL.
- Files saved earlier in the old format keep opening normally.
- Deleting an item in the Library removes the file, its link row and its saved edits.
- Without sign-in, everything still saves in the browser and uploads the next time you sign in and open the Library.
