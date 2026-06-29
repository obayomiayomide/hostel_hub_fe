"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Input, Select, Button } from "@/components/ui";

const schema = z
  .object({
    fullName: z.string().min(3, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    gender: z.enum(["MALE", "FEMALE"], {
      errorMap: () => ({ message: "Select your gender" }),
    }),
    matricNumber: z.string().optional(),
    department: z.string().optional(),
    level: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = values;
      const user = await registerUser(payload);
      toast.success(
        `Account created. Welcome, ${user.fullName.split(" ")[0]}!`,
      );
      router.push("/student/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-xl font-bold text-ink-900">
        Create your student account
      </h1>
      <p className="mt-1 text-sm text-ink-700/60">
        Apply for hostel accommodation in minutes.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
        <Input
          label="Full Name"
          placeholder="John Adeyemi"
          required
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="you@school.edu"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Gender"
            required
            placeholder="Select gender"
            error={errors.gender?.message}
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ]}
            {...register("gender")}
          />
          <Input
            label="Phone Number"
            placeholder="0801 234 5678"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Matric Number"
            placeholder="CSC/2021/001"
            error={errors.matricNumber?.message}
            {...register("matricNumber")}
          />
          <Input
            label="Level"
            placeholder="300"
            error={errors.level?.message}
            {...register("level")}
          />
        </div>

        <Input
          label="Department"
          placeholder="Computer Engineering"
          error={errors.department?.message}
          {...register("department")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            required
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <Button type="submit" className="mt-1 w-full" isLoading={submitting}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-700/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-600 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
