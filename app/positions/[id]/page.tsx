import PositionLink from "@/components/PositionLink";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data } = await supabase.from("positions").select();

  if (!data) return null;

  return (
    <div className="flex justify-between">
      <div className="hidden md:flex w-[300px] border-r-2 h-[100vh]">
        <ul className="w-full">
          {data.map((positon) => {
            return (
              <li key={positon.id} className="border-b-2 w-full">
                <PositionLink
                  id={positon.id}
                  company={positon.company || ""}
                  jobTitle={positon.job_title || ""}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <div className="mt-20 flex justify-center align-middle">
          Details page for company{" "}
          {
            data?.find((position) => position.id.toString() === params.id)
              ?.company
          }{" "}
          comming soon! Stay tuned
        </div>
      </div>
    </div>
  );
}
