"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/libs/validation";
import Field from "@/components/modules/auth/Field";

interface FormErrors {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const authError = useAuthStore((s) => s.error);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function clearError(field: keyof FormErrors) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {
      name: validateRequired(name, "First name") ?? undefined,
      lastName: validateRequired(lastName, "Last name") ?? undefined,
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
      confirmPassword:
        confirmPassword !== password ? "Passwords don't match" : undefined,
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const ok = await register({ name, lastName, email, password });
    if (ok) router.push("/products");
  }

  return (
    <main className="container mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Join Prism to start shopping.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 flex flex-col gap-5"
      >
        <div className="flex gap-3">
          <Field
            label="First name"
            value={name}
            onChange={(v) => {
              setName(v);
              clearError("name");
            }}
            error={errors.name}
            autoComplete="given-name"
          />
          <Field
            label="Last name"
            value={lastName}
            onChange={(v) => {
              setLastName(v);
              clearError("lastName");
            }}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            clearError("email");
          }}
          error={errors.email}
          autoComplete="email"
        />

        <Field
          label="Password"
          type="password"
          value={password}
          onChange={(v) => {
            setPassword(v);
            clearError("password");
          }}
          error={errors.password}
          autoComplete="new-password"
        />

        <Field
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(v) => {
            setConfirmPassword(v);
            clearError("confirmPassword");
          }}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {authError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
            {authError}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 flex h-11 items-center justify-center rounded-full bg-foreground text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
