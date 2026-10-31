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
