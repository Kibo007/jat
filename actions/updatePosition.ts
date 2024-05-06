"use server";
import { PositionStatus } from "@/types/common";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type Response = {
  message: string;
};

type PositionUpdatePayload = {
  status?: PositionStatus;
  excitement?: number;
};

export async function onUpdatePosition(
  id: number,
  payload: PositionUpdatePayload
): Promise<Response> {
  const supabase = createClient();

  let { error } = await supabase
    .from("positions")
    .update(payload)
    .eq("id", id);
console.log("error");
if (error) {
  return {
    message: JSON.stringify(error),
  };
}

  if (!error) {
    revalidatePath("/positions");
  }

  return { message: "success" };
}
