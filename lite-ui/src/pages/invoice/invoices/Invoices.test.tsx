import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, Mock } from "vitest";
import { Invoices } from "./Invoices";
import * as InvoiceApi from "../InvoiceApi";
import { act } from "react-dom/test-utils";

vi.mock("../InvoiceApi", () => ({
  fetchAllInvoices: vi.fn(),
  deleteInvoice: vi.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Invoices Component", () => {
  const mockInvoices = [
    {
      id: 1,
      status: "Paid",
      dueDate: "2023-10-01",
      invoiceNumber: "INV-001",
      customer: { givenname: "John", surname: "Doe" },
      creationDate: "2023-09-01",
      priceNet: 100,
      priceGross: 120,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (InvoiceApi.fetchAllInvoices as Mock).mockResolvedValue(mockInvoices);
  });

  it("should render invoices table", async () => {
    render(
      <MemoryRouter>
        <Invoices />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("INV-001")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("should call delete  when delete button is clicked", async () => {
    (InvoiceApi.deleteInvoice as Mock).mockResolvedValue({});

    render(
      <MemoryRouter>
        <Invoices />
      </MemoryRouter>
    );

    const deleteButton = await screen.findByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
    });
    await waitFor(() => {
      expect(InvoiceApi.deleteInvoice).toHaveBeenCalledWith(1);
    });
  });
});
