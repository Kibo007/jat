import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "@/components/SubmitButton";
import { headers } from "next/headers";

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const forgotPassword = async (formData: FormData) => {
    "use server";

    const headersList = headers();
    const domain = headersList.get("host");
    const email = formData.get("email") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:3000/update-password`,
    });

    if (!error) {
      // TODO when no error show user message to check email
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 justify-center gap-2">
      <Link
        href="/login"
        className="absolute left-8 top-4 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <div className="flex justify-center align-middle w-full h-[100vh]">
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground sm:max-w-md">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}

          <SubmitButton
            formAction={forgotPassword}
            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
            pendingText="Sending email..."
          >
            Send
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
