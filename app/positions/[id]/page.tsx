import PositionLink from "@/components/PositionLink";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { parseISO, formatDistance, subDays } from "date-fns";
import Link from "next/link";
import { PositionForm } from "@/components/PositionForm/PositionForm";
import { Position } from "@/types/common";
import { ExcitementRatings } from "@/components/ExcitementRatings";

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

  const position = data.find(
    (position) => position.id.toString() === params.id
  );
  const createdAt = parseFloat(position?.created_at || "");
  const date = parseISO(createdAt.toString());

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
      <div className="flex flex-col w-full m-4">
        <div className="border-b-2 pb-5 flex justify-between">
          <div className="flex flex-col ">
            <h2>{position?.job_title}</h2>
            <h3 className="text-slate-600">
              {position?.company} - {position?.location}
            </h3>
            <p>
              Saved
              <time className="ml-1 mr-1" dateTime={date.toString()}>
                {formatDistance(subDays(new Date(), 3), new Date(), {
                  addSuffix: true,
                })}
              </time>
              {position?.position_url && (
                <>
                  from
                  <Link
                    href={position?.position_url}
                    target="_blank"
                    className="ml-1"
                  >
                    {position?.position_url}
                  </Link>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col justify-between items-end">
            <PositionForm
              position={
                {
                  company: position?.company,
                  contact: position?.contact,
                  createdAt: position?.created_at,
                  description: position?.description,
                  hourlyRate: position?.hourly_rate,
                  id: position?.id,
                  jobTitle: position?.job_title,
                  location: position?.location,
                  positionUrl: position?.position_url,
                  status: position?.status,
                } as Position
              }
            />
            {position && (
              <ExcitementRatings
                rating={position.excitement || 0}
                id={position.id}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="mt-10">
            <h3>Contact:</h3>
            {position?.contact}
          </div>

          <div className="mt-10">
            <h3>Hourly rate:</h3>
            {position?.hourly_rate}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="mt-10">
            <h3>Location:</h3>
            {position?.location}
          </div>

          <div className="mt-10">
            <h3>Status of application:</h3>
            {position?.status}
          </div>
        </div>

        <div className="mt-10">
          <h3>Description:</h3>
          {position?.description}
        </div>
      </div>
    </div>
  );
}
