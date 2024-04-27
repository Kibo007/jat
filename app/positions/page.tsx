import { PositionsTable } from "@/components/PositionsTable/PositionsTable";
import { Position } from "@/types/common";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data } = await supabase.from("positions").select();

  const positions = data?.map((position) => ({
    company: position.company,
    contact: position.contact,
    createdAt: position.created_at,
    description: position.description,
    hourlyRate: position.hourly_rate,
    id: position.id,
    jobTitle: position.job_title,
    location: position.location,
    positionUrl: position.position_url,
    status: position.status,
    excitement: position.excitement,
  }));

  return (
    <div className="m-4 md:m-10 md:mt-20">
      <PositionsTable positions={positions as Position[]} />
    </div>
  );
}
