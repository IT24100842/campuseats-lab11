import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./schema.js";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

// ── Slides 26–30: React Hook Form + Zod, live ────────────────────
// Watch the console: RHF is UNCONTROLLED, so typing in a field does
// NOT re-render the page. Compare with a useState-per-field form,
// which re-renders everything on every keystroke.
export default function RegisterPage() {
  useDocumentTitle("Register");
  const [submitted, setSubmitted] = useState(null);

  console.log("render <RegisterPage> (should NOT log on every keystroke)");

  const {
    register,           // wires a field to the form (Slide 27)
    handleSubmit,       // validates, then calls our function
    control,            // needed by useFieldArray
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema), // Zod plugs in here (Slide 28)
    defaultValues: {
      hostel: "On-campus",
      dietaryPreferences: [{ value: "" }],
    },
  });

  // ── Slide 29: dynamic fields with useFieldArray ──
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dietaryPreferences",
  });

  const onSubmit = async (data) => {
    // Simulate the POST that will hit the real API in Lecture 03
    await new Promise((r) => setTimeout(r, 700));
    setSubmitted(data);
    reset();
  };

  return (
    <Card className="card form-card">
      <h2>Create your CampusEats account</h2>

      {submitted && (
        <div className="alert info">
          Registered <b>{submitted.fullName}</b> ({submitted.studentId}) —
          in Lecture 03 this data POSTs to the ASP.NET Core API.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Full name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <TextField
          label="Student ID"
          placeholder="IT22045678"
          error={errors.studentId?.message}
          {...register("studentId")}
        />
        <TextField
          label="SLIIT email"
          type="email"
          placeholder="it22045678@my.sliit.lk"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <TextField
          label="Confirm password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="field">
          <label>Accommodation</label>
          <select {...register("hostel")}>
            <option>On-campus</option>
            <option>Off-campus</option>
          </select>
        </div>

        <div className="field">
          <label>Dietary preferences (dynamic fields)</label>
          {fields.map((field, index) => (
            <div key={field.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                placeholder="e.g. vegetarian, no seafood"
                {...register(`dietaryPreferences.${index}.value`)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => remove(index)}
              >
                ✕
              </Button>
            </div>
          ))}
          {errors.dietaryPreferences && (
            <p className="error">
              {errors.dietaryPreferences.message ||
                errors.dietaryPreferences.root?.message ||
                "Check your preferences"}
            </p>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => append({ value: "" })}
          >
            + Add preference
          </Button>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering…" : "Register"}
        </Button>
      </form>
    </Card>
  );
}
