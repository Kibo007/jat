import { render, screen } from "@testing-library/react";
import { SubmitButton } from "./SubmitButton";
import { vi } from "vitest";

let pending = false;

vi.mock("react-dom", () => ({
  useFormStatus: vi.fn(() => {
    return { pending };
  }),
}));

describe("SubmitButton", () => {
  test("renders submit button", () => {
    render(<SubmitButton />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeInTheDocument;
  });

  test("disables button when pending is true", () => {
    pending = true;
    render(<SubmitButton />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  test("shows loader when pending is true", () => {
    pending = true;
    render(<SubmitButton />);
    const loader = screen.getByTestId("loader");
    expect(loader).toBeInTheDocument();
  });

  test("does not show loader when pending is false", () => {
    pending = false;
    render(<SubmitButton />);
    const loader = screen.queryByTestId("loader");
    expect(loader).toBeNull();
  });
});
