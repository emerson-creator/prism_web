import { describe, expect, it } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateZipCode,
  validateNewPassword,
} from "./validation";

describe("validateEmail", () => {
  it("accepts a valid email", () => {
    expect(validateEmail("user@example.com")).toBeNull();
  });

  it("rejects an empty email", () => {
    expect(validateEmail("")).toBe("Email is required");
  });

  it("rejects whitespace-only input", () => {
    expect(validateEmail("   ")).toBe("Email is required");
  });

  it("rejects an invalid email format", () => {
    expect(validateEmail("invalid-email")).toBe(
      "Enter a valid email address",
    );
  });
});

describe("validatePassword", () => {
  it("accepts a password with at least 8 characters", () => {
    expect(validatePassword("password123")).toBeNull();
  });

  it("rejects an empty password", () => {
    expect(validatePassword("")).toBe("Password is required");
  });

  it("rejects passwords shorter than 8 characters", () => {
    expect(validatePassword("1234567")).toBe(
      "Password must be at least 8 characters",
    );
  });

  it("accepts exactly 8 characters", () => {
    expect(validatePassword("12345678")).toBeNull();
  });
});

describe("validateRequired", () => {
  it("accepts a non-empty value", () => {
    expect(validateRequired("Emerson", "Name")).toBeNull();
  });

  it("rejects an empty value", () => {
    expect(validateRequired("", "Name")).toBe("Name is required");
  });

  it("rejects whitespace-only input", () => {
    expect(validateRequired("   ", "Address")).toBe(
      "Address is required",
    );
  });
});

describe("validateZipCode", () => {
  it("accepts a postal code with at least 3 characters", () => {
    expect(validateZipCode("123")).toBeNull();
  });

  it("rejects an empty postal code", () => {
    expect(validateZipCode("")).toBe("ZIP / postal code is required");
  });

  it("rejects a postal code shorter than 3 characters", () => {
    expect(validateZipCode("12")).toBe("Enter a valid ZIP / postal code");
  });

  it("accepts surrounding whitespace when the trimmed value is valid", () => {
    expect(validateZipCode(" 123 ")).toBeNull();
  });
});

describe("validateNewPassword", () => {
  it("accepts a password with at least 6 characters", () => {
    expect(validateNewPassword("secret")).toBeNull();
  });

  it("rejects an empty password", () => {
    expect(validateNewPassword("")).toBe("New password is required");
  });

  it("rejects passwords shorter than 6 characters", () => {
    expect(validateNewPassword("12345")).toBe(
      "Password must be at least 6 characters",
    );
  });

  it("accepts exactly 6 characters", () => {
    expect(validateNewPassword("123456")).toBeNull();
  });
});
