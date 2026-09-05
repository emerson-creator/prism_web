"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useApiFetch } from "@/libs/hooks/useApiFetch";
import * as api from "@/libs/api";
import {
  validateEmail,
  validateNewPassword,
  validateRequired,
} from "@/libs/validation";

export default function ProfilePage() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const authUser = useAuthStore((s) => s.user);

  const {
    data: profile,
    isLoading,
    error: loadError,
  } = useApiFetch(() => api.fetchProfile(), [authUser?.id], {
    enabled: isHydrated && !!authUser,
    fallbackError: "Could not load your profile",
  });

  if (isHydrated && !authUser) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Sign in to view your profile
        </h1>
        <Link
          href="/login"
          className="mt-6 flex h-11 items-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
        >
          Sign in
        </Link>
      </main>
    );
  }

  if (!isHydrated || isLoading) {
    return (
      <main className="container mx-auto px-4 py-16 text-center text-[13px] text-muted-foreground">
        Loading your profile…
      </main>
    );
  }

  if (loadError || !profile) {
    return (
      <main className="container mx-auto px-4 py-16 text-center text-[13px] text-red-600">
        {loadError ?? "Could not load your profile"}
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-lg px-4 py-10">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Your profile
      </h1>

      <ProfileForm
        initialName={profile.name ?? ""}
        initialLastName={profile.lastName ?? ""}
        initialEmail={profile.email}
      />

      <div className="my-10 border-t border-border" />

      <PasswordForm />
    </main>
  );
}

interface ProfileFormErrors {
  name?: string;
  lastName?: string;
  email?: string;
}

function ProfileForm({
  initialName,
  initialLastName,
  initialEmail,
}: {
  initialName: string;
  initialLastName: string;
  initialEmail: string;
}) {
  const updateUser = useAuthStore((s) => s.updateUser);
  const [name, setName] = useState(initialName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function clearError(field: keyof ProfileFormErrors) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate(): boolean {
    const next: ProfileFormErrors = {
      name: validateRequired(name, "First name") ?? undefined,
      lastName: validateRequired(lastName, "Last name") ?? undefined,
      email: validateEmail(email) ?? undefined,
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const updated = await api.updateProfile({ name, lastName, email });
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save changes",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-6 flex flex-col gap-5"
    >
      <p className="text-[13px] font-medium text-foreground">
        Personal details
      </p>

      <div className="flex gap-3">
        <Field
          label="First name"
          value={name}
          onChange={(v) => {
            setName(v);
            clearError("name");
          }}
          error={errors.name}
        />
        <Field
          label="Last name"
          value={lastName}
          onChange={(v) => {
            setLastName(v);
            clearError("lastName");
          }}
          error={errors.lastName}
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
      />

      {saveError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {saveError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="flex h-11 w-fit items-center justify-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSaving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
      </button>
    </form>
  );
}

interface PasswordFormErrors {
  currentPassword?: string;
  newPassword?: string;
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<PasswordFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function clearError(field: keyof PasswordFormErrors) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate(): boolean {
    const next: PasswordFormErrors = {
      currentPassword:
        validateRequired(currentPassword, "Current password") ?? undefined,
      newPassword: validateNewPassword(newPassword) ?? undefined,
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await api.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not change password",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <p className="text-[13px] font-medium text-foreground">Change password</p>

      <Field
        label="Current password"
        type="password"
        value={currentPassword}
        onChange={(v) => {
          setCurrentPassword(v);
          clearError("currentPassword");
        }}
        error={errors.currentPassword}
        autoComplete="current-password"
      />

      <Field
        label="New password"
        type="password"
        value={newPassword}
        onChange={(v) => {
          setNewPassword(v);
          clearError("newPassword");
        }}
        error={errors.newPassword}
        autoComplete="new-password"
      />

      {saveError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {saveError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="flex h-11 w-fit items-center justify-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSaving ? "Updating…" : saved ? "Updated ✓" : "Update password"}
      </button>
    </form>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex-1">
      <label className="mb-1.5 block text-[13px] font-medium text-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={[
          "h-11 w-full rounded-lg border bg-background px-3.5 text-[14px] text-foreground outline-none transition-colors",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-border focus:border-foreground",
        ].join(" ")}
      />
      {error && <p className="mt-1.5 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
