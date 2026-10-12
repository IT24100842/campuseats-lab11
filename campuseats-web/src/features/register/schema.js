import { z } from "zod";

// ── Slide 28: Zod SCHEMA = validation as data ────────────────────
// One declarative source of truth for the whole form's rules.
// Bonus teaching point: the SAME kind of schema validates again on
// the backend in Lecture 03 – never trust the client alone.
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters"),
    studentId: z
      .string()
      .regex(/^IT\d{8}$/, "Student ID must look like IT22045678"),
    email: z
      .string()
      .email("Enter a valid email")
      .refine((v) => v.endsWith("@my.sliit.lk"), {
        message: "Use your SLIIT email (…@my.sliit.lk)",
      }),
    password: z.string().min(8, "Password needs at least 8 characters"),
    confirmPassword: z.string(),
    hostel: z.enum(["On-campus", "Off-campus"]),
    // ── Slide 29: DYNAMIC FIELDS validated as an array ──
    dietaryPreferences: z
      .array(
        z.object({
          value: z.string().min(2, "Preference too short"),
        })
      )
      .max(5, "Maximum 5 preferences"),
  })
  // Cross-field rule: schema-level refine
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
