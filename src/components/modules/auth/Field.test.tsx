import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Field from "./Field";

describe("Field", () => {
  it("renders the label and current value", () => {
    render(<Field label="Email" value="user@example.com" onChange={vi.fn()} />);

    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByDisplayValue("user@example.com")).toBeTruthy();
  });

  it("uses text as the default input type", () => {
    render(<Field label="Name" value="" onChange={vi.fn()} />);

    expect(screen.getByRole("textbox").getAttribute("type")).toBe("text");
  });

  it("renders the specified input type", () => {
    const { container } = render(
      <Field label="Password" type="password" value="" onChange={vi.fn()} />,
    );

    expect(container.querySelector("input")?.getAttribute("type")).toBe(
      "password",
    );
  });

  it("calls onChange with the updated value", () => {
    const onChange = vi.fn();

    render(<Field label="Name" value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Emerson" },
    });

    expect(onChange).toHaveBeenCalledWith("Emerson");
  });

  it("sets aria-invalid when an error is present", () => {
    render(
      <Field
        label="Email"
        value="invalid"
        onChange={vi.fn()}
        error="Enter a valid email"
      />,
    );

    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(screen.getByText("Enter a valid email")).toBeTruthy();
  });

  it("does not show an error when none is provided", () => {
    render(<Field label="Email" value="" onChange={vi.fn()} />);

    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe(
      "false",
    );
  });

  it("passes autocomplete and custom className to the component", () => {
    const { container } = render(
      <Field
        label="Email"
        value=""
        onChange={vi.fn()}
        autoComplete="email"
        className="custom-field"
      />,
    );

    expect(screen.getByRole("textbox").getAttribute("autocomplete")).toBe(
      "email",
    );
    expect(container.firstElementChild?.className).toBe("custom-field");
  });
});
