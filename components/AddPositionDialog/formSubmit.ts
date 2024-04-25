"use server";
import { createClient } from "@/utils/supabase/server";
import { schema } from "./formSchema";
import { revalidatePath } from "next/cache";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function onSubmitAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = schema.safeParse(formData);
  console.log(prevState);
  console.log(data);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  //   if (parsed.data.email.includes("a")) {
  //     return {
  //       message: "Invalid email",
  //       fields: parsed.data,
  //     };
  //   }

  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    return {
      message: "User is not authentificated with server",
    };
  }

  let { data: dataSupabase, error } = await supabase
    .from("positions")
    .insert([
      {
        company: String(data.get("company")) || null,
        contact: String(data.get("contact")) || null,
        description: String(data.get("description")) || null,
        hourly_rate: Number(data.get("hourlyRate")) || null,
        job_title: String(data.get("jobTitle")) || null,
        location: String(data.get("location")) || null,
        position_url: String(data.get("positionUrl")) || null,
        status: String(data.get("status")) || null,
        user_id: user.data.user?.id,
      },
    ])
    .select();

  if (error) {
    console.log(error);
    return {
      message: error.toString(),
    };
  }

  if (!error) {
    revalidatePath("/positions");
  }

  return { message: "success" };
}
