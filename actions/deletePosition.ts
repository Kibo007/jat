"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type Response = {
  message: string;
};

export async function onDeleteAction(ids: number[]): Promise<Response> {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    return {
      message: "User is not authentificated with server",
    };
  }

  let { error } = await supabase.from("positions").delete().in("id", ids);

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
