import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  console.log(params);
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data } = await supabase
    .from("positions")
    .select()
    .eq("id", params.id);

  if (!data) return null;

  return (
    <div className="mt-20 flex justify-center align-middle">
      Details page for company {data[0].company} comming soon! Stay tuned
    </div>
  );
}
