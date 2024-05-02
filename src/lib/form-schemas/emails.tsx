import { z } from "zod";

export const contactEmailSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  message: z.string().trim().min(1, "Message is required."),
});

export type ContactEmailSchema = z.infer<typeof contactEmailSchema>;
