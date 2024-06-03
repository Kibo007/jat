import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "@/components/SubmitButton";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UpdatePassword() {
  const supabase = createClient();

  const forgotPassword = async (formData: FormData) => {
    "use server";

    const password = formData.get("password") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (data) {
      redirect("/");
    }

    if (!error) {
      // TODO hanle error
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 justify-center gap-2">
      <div className="flex justify-center align-middle w-full h-[100vh]">
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground sm:max-w-md">
          <label className="text-md" htmlFor="email">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />

          <SubmitButton
            formAction={forgotPassword}
            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
            pendingText="resetting password..."
          >
            Send
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
