"use server";
import { createClient } from "@/utils/supabase/server";
import { schema } from "../components/PositionForm/formSchema";
import { revalidatePath } from "next/cache";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function onSubmitAction(
  prevState: FormState,
  data: FormData,
  positionId?: number
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = schema.safeParse(formData);
  console.log(parsed);

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

  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    return {
      message: "User is not authentificated with server",
    };
  }

  const payload = {
    company: String(data.get("company")) || null,
    contact: String(data.get("contact")) || null,
    description: String(data.get("description")) || null,
    hourly_rate: Number(data.get("hourlyRate")) || null,
    job_title: String(data.get("jobTitle")) || null,
    location: String(data.get("location")) || null,
    position_url: String(data.get("positionUrl")) || null,
    status: String(data.get("status")) || null,
    user_id: user.data.user?.id,
  };

  let response

  if (positionId) {
    response = await supabase
      .from("positions")
      .update(payload)
      .eq("id", positionId);
      
  } else {
    response = await supabase.from("positions").insert([payload]).select();
  }

  if (response.error) {
    return {
      message: response.error.toString(),
    };
  }

  if (!response.error) {
    revalidatePath("/positions");
  }

  return { message: "success" };
}
