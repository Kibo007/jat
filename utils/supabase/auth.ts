import { createClient } from "@/utils/supabase/client";
export async function loginWithExternalProvider(
  provider: "google" | "github" | "linkedin"
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  return { data, error };
}

export async function logOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return {
    error,
  };
}
