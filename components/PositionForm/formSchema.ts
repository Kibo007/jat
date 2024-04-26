import { z } from "zod";

export const schema = z.object({
  company: z.string().trim().min(1, {
    message: "Company name is required.",
  }),
  jobTitle: z.string().trim().min(1, {
    message: "Job title is required.",
  }),
  contact: z.string().trim().min(1, {
    message: "add contact name",
  }),
  location: z.string().trim().min(1, {
    message: "add location",
  }),
  description: z.string(),
  hourlyRate: z.coerce.number().min(0, {
    message: "add hourly rate",
  }),
  status: z.enum(["applied", "interview", "offer", "rejected", "pending"], {
    message:
      "Status must be one of: applied, interview, offer, rejected, pending.",
  }),
});
