import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/positions");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <div className=" min-h-screen flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-10">Welcome to JobTrack!</h1>
            <p className="text-lg mb-6">
              JobTrack is your all-in-one solution for managing your job
              applications. Whether you&apos;re a freelancer, engineer,
              designer, product manager, or any other professional, JobTrack can
              help you keep track of your applications, interviews, and offers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col justify-center items-center p-6 bg-blue-500 rounded-lg text-white">
                <h2 className="text-2xl font-bold mb-2">Track Applications</h2>
                <p className="text-lg text-center">
                  Easily track all your job applications in one place.
                </p>
              </div>
              <div className="flex flex-col justify-center items-center p-6 bg-green-500 rounded-lg text-white">
                <h2 className="text-2xl font-bold mb-2">Stay Organized</h2>
                <p className="text-lg text-center">
                  Organize your applications, interviews, and offers
                  effortlessly.
                </p>
              </div>
              <div className="flex flex-col justify-center items-center p-6 bg-yellow-500 rounded-lg text-white">
                <h2 className="text-2xl font-bold mb-2">Get Insights</h2>
                <p className="text-lg text-center">
                  Gain insights into your job search progress and optimize your
                  strategy.
                </p>
              </div>
              <div className="flex flex-col justify-center items-center p-6 bg-purple-500 rounded-lg text-white">
                <h2 className="text-2xl font-bold mb-2">Customize Workflow</h2>
                <p className="text-lg text-center">
                  Tailor your workflow to suit your unique job search needs.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}
