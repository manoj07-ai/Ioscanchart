/**
 * Auth stub — mock implementation for development.
 *
 * Returns a hard-coded dev user from the DEV_USER_ID env var.
 * Every server action and API route MUST call getCurrentUser() and scope
 * all DB queries by user_id — this ensures the real-auth swap (Prompt 10)
 * is a config change, not a rewrite.
 *
 * TODO(prompt-10): Replace with Supabase Auth session check.
 *   `const { data: { user } } = await supabase.auth.getUser()`
 */

export interface AppUser {
  id: string;
  /** Display name — from profiles table */
  displayName: string | null;
}

/**
 * Get the currently authenticated user.
 *
 * @throws Error if DEV_USER_ID is not set in development.
 */
export async function getCurrentUser(): Promise<AppUser> {
  // TODO(prompt-10): swap to real Supabase Auth
  const devUserId = process.env.DEV_USER_ID;

  if (!devUserId) {
    throw new Error(
      "DEV_USER_ID env var is not set. Add it to your .env.local file. See docs/SETUP.md."
    );
  }

  return {
    id: devUserId,
    displayName: "Dev User",
  };
}
