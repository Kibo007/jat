import { render, screen, fireEvent } from "@testing-library/react";
import { PositionForm } from "./PositionForm";
import { useFormState } from "react-dom";

let pending = false;

// Mocking the useFormState hook
vi.mock("react-dom", () => ({
  useFormState: vi.fn(() => [{}, () => {}]),
  useFormStatus: vi.fn(() => {
    return { pending };
  }),
}));

describe("PositionForm", () => {
  test("renders the form correctly", () => {
    render(<PositionForm />);

    const positionDialogButton = screen.getByTestId("positionDialogButton");
    fireEvent.click(positionDialogButton);

    // Assert that the form elements are rendered correctly
    expect(screen.getByLabelText("Company Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Job title")).toBeInTheDocument();
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Recruiter contact")).toBeInTheDocument();
    expect(screen.getByLabelText("Hourly rate")).toBeInTheDocument();
    expect(screen.getByLabelText("Status of application")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument;
  });

  test("opens the dialog when Add button is clicked", () => {
    render(<PositionForm />);

    // Assert that the dialog is initially closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Click the Add button
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    // Assert that the dialog is now open
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  test("closes the dialog when Cancel button is clicked", () => {
    render(<PositionForm />);

    // Click the Add button to open the dialog
    const positionDialogButton = screen.getByTestId("positionDialogButton");
    fireEvent.click(positionDialogButton);

    // Assert that the dialog is open
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Click the Cancel button
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    // Assert that the dialog is now closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Add more tests for other functionality as needed
});
