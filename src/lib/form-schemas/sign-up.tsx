import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required.")
      .max(100, "First name is too long."),
    lastName: z
      .string()
      .min(1, "Last name is required.")
      .max(100, "Last name is too long."),
    email: z.string().email("Invalid email address."),
    password: z
      .string()
      .min(6, "Password is too short.")
      .max(100, "Password is too long."),
    confirmPassword: z.string(),
    theaterName: z.string().min(1, "Theater name is required."),
    theaterType: z.string().min(1, "Theater type is required."),
    websiteUrl: z.string().url("Invalid URL."),
    street_address: z.string().trim().min(1, "Street address is required."),
    city: z.string().trim().min(1, "City is required."),
    state: z.string().trim().min(1, "State is required."),
    postal_code: z.string().trim().min(5).max(10),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
