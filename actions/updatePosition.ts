"use server";
import { PositionStatus } from "@/types/common";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type Response = {
  message: string;
};

export async function onUpdateStatus(
  id: number,
  status: PositionStatus
): Promise<Response> {
  const supabase = createClient();

  let { error } = await supabase
    .from("positions")
    .update({ status })
    .eq("id", id);

  if (error) {
    return {
      message: error.toString(),
    };
  }

  if (!error) {
    revalidatePath("/positions");
  }

  return { message: "success" };
}
