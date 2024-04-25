"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function onDeleteAction(ids: number[]): Promise<FormState> {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    return {
      message: "User is not authentificated with server",
    };
  }

  let { data: dataSupabase, error } = await supabase
    .from("positions")
    .delete()
    .in("id", ids);

  console.log(error);
  console.log(ids);

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
