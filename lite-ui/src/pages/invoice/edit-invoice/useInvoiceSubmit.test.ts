import { describe, it, expect, vi, Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInvoiceSubmit } from "./useInvoiceSubmit";
import { showNotification } from "@mantine/notifications";
import { createInvoice } from "../InvoiceApi";
import { useNavigate } from "react-router-dom";
import { convertToDateTime } from "../../../helpers/dateHelpers";
import { InvoiceFormState } from "./formState";

vi.mock("@mantine/notifications", () => ({
  showNotification: vi.fn(),
}));

vi.mock("../InvoiceApi", () => ({
  createInvoice: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));
vi.mock("../../../helpers/dateHelpers", () => ({
  convertToDateTime: vi.fn(),
}));

describe("useInvoiceSubmit", () => {
  const mockNavigate = vi.fn();
  const mockInvoiceForm = {
    dueDate: "2023-10-01",
    otherField: "test",
  } as unknown as InvoiceFormState;

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  it("should not proceed if dueDate is missing", async () => {
    const { result } = renderHook(() =>
      useInvoiceSubmit(
        { ...mockInvoiceForm, dueDate: null } as unknown as InvoiceFormState,
        true
      )
    );

    await result.current.submitInvoice();

    expect(createInvoice).not.toHaveBeenCalled();
    expect(showNotification).not.toHaveBeenCalled();
  });

  it("should create a new invoice and show success notification", async () => {
    (createInvoice as Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() =>
      useInvoiceSubmit(mockInvoiceForm as unknown as InvoiceFormState, true)
    );

    await result.current.submitInvoice();

    expect(convertToDateTime).toHaveBeenCalledWith(mockInvoiceForm.dueDate);
    expect(createInvoice).toHaveBeenCalled();
    expect(showNotification).toHaveBeenCalledWith({
      title: "Saved",
      message: "Invoice saved successfully",
      color: "green",
    });
  });

  it("should show error notification if invoice creation fails", async () => {
    (createInvoice as Mock).mockRejectedValueOnce(new Error("Failed"));

    const { result } = renderHook(() =>
      useInvoiceSubmit(mockInvoiceForm as unknown as InvoiceFormState, true)
    );

    await result.current.submitInvoice();

    expect(showNotification).toHaveBeenCalledWith({
      title: "Error",
      message: "Failed to save invoice",
      color: "red",
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
