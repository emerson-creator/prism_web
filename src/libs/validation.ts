/** Simple field-level validators shared by auth forms. No external deps. */

export function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "Enter a valid email address";
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required`;
  return null;
}

export function validateZipCode(value: string): string | null {
  if (!value.trim()) return "ZIP / postal code is required";
  if (value.trim().length < 3) return "Enter a valid ZIP / postal code";
  return null;
}
