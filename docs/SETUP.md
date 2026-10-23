# SETUP.md — Developer Setup Guide

## Prerequisites
- Node.js 20+
- pnpm (`npm i -g pnpm`)
- Supabase account (free tier is fine for development)
- Google AI Studio API key (Gemini)

---

## 1. Clone & install

```bash
git clone <repo-url>
cd ioscanchart
pnpm install
```

---

## 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in each variable in `.env.local` (see comments in `.env.example`).

---

## 3. Supabase setup

### 3a. Create a project
1. Go to [supabase.com](https://supabase.com) → New project.
2. Note your **Project URL** and **API keys** (Settings → API).

### 3b. Run the database migration

**Option A — Supabase CLI (recommended)**
```bash
pnpm supabase login
pnpm supabase link --project-ref <your-project-ref>
pnpm supabase db push
```

**Option B — SQL Editor (quick)**
1. Open Supabase Dashboard → SQL Editor.
2. Paste the contents of `supabase/migrations/0001_init.sql` → Run.

### 3c. Seed dev data

1. Open the SQL Editor again.
2. Paste `supabase/seed.sql`.
3. **Edit the UUID** to match your `DEV_USER_ID` in `.env.local` (or leave the default and copy the default UUID into `.env.local`).
4. Run.

### 3d. Create the `charts` Storage bucket (private)

> ⚠️ The app stores uploaded chart images here. The bucket must be **private** (not public). Images are served via short-lived signed URLs generated server-side.

1. Supabase Dashboard → Storage → New bucket.
2. Name: `charts`
3. **Public bucket: OFF** (very important).
4. File size limit: `10 MB` (matches server-side validation).
5. Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`
6. Click **Create bucket**.

**Storage RLS policy** (add via Dashboard → Storage → `charts` bucket → Policies):

```sql
-- Allow users to read their own chart files
CREATE POLICY "charts: owner read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'charts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to insert their own chart files
CREATE POLICY "charts: owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'charts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

> **Dev note:** While auth is mocked (Prompts 01–09), the service-role key bypasses RLS entirely. Images are stored at `{userId}/{analysisId}/{filename}` — this path structure is already correct for when real auth is enabled in Prompt 10.

---

## 4. Run the app

```bash
pnpm dev
```

Visit `http://localhost:3000`.

---

## 5. Run checks

```bash
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
pnpm test        # vitest run
```

---

## 6. Auth & billing — current state

| Feature | Current (Prompts 01–09) | After Prompt 10 |
|---|---|---|
| Auth | `DEV_USER_ID` env var | Supabase Auth (Google + email OTP) |
| DB client | Service-role (bypasses RLS) | Per-request user JWT (RLS enforced) |
| Billing | `profiles.credits` manual seed | Stripe webhook updates `profiles` |

> 🔁 The swap in Prompt 10 is intentionally a **config change**, not a rewrite. `getCurrentUser()` and `getEntitlement()` are the only touch points.

---

## 7. Deploying to Vercel

1. Push to GitHub.
2. Import into Vercel.
3. Add all env vars from `.env.example` in Vercel project settings.
4. Deploy.

> Use Vercel's **Environment Variables** UI — never commit secrets.
