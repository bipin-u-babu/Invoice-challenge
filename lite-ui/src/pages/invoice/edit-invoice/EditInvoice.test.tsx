import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Mock, vi } from "vitest";
import { EditInvoice } from "./EditInvoice";
import { fetchInvoice } from "../InvoiceApi";
import { useInvoiceSubmit } from "./useInvoiceSubmit";

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
vi.mock("../InvoiceApi", () => ({
  fetchInvoice: vi.fn(),
}));
vi.mock("./useInvoiceSubmit", () => ({
  useInvoiceSubmit: vi.fn(),
}));

describe("EditInvoice", () => {
  const mockSubmitInvoice = vi.fn();
  const mockLoadDraft = vi.fn();
  const mockSaveDraft = vi.fn();
  const mockClearDraft = vi.fn();
  const mockHasDraft = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useInvoiceSubmit as Mock).mockReturnValue({
      submitInvoice: mockSubmitInvoice,
    });
  });

  it("renders the form for creating a new invoice", () => {
    render(
      <MemoryRouter initialEntries={["/invoice/edit"]}>
        <Routes>
          <Route path="/invoice/edit" element={<EditInvoice />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("CREATE_INVOICE")).toBeInTheDocument();
    expect(screen.getByText("Due date")).toBeInTheDocument();
    expect(screen.getByText("SURNAME")).toBeInTheDocument();
    expect(screen.getByText("SURNAME")).toBeInTheDocument();
    expect(screen.getByText("PRICE_NET")).toBeInTheDocument();
    expect(screen.getByText("PRICE_BRUT")).toBeInTheDocument();
  });

  it("loads an existing invoice when invoiceId is provided", async () => {
    (fetchInvoice as Mock).mockResolvedValue({
      dueDate: new Date(),
      customer: { givenname: "John", surname: "Doe" },
      priceNet: 100,
      priceGross: 120,
    });

    render(
      <MemoryRouter initialEntries={["/invoice/edit/1"]}>
        <Routes>
          <Route path="/invoice/edit/:invoiceId" element={<EditInvoice />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchInvoice).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.getByText("Due date")).toBeInTheDocument();

      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    });
  });

  it("loads an existing draft invoice when creating a new invoice", async () => {
    localStorage.setItem(
      "invoiceForm",
      JSON.stringify({
        dueDate: new Date(),
        customer: { givenname: "John", surname: "Doe" },
        priceNet: 100,
        priceGross: 120,
      })
    );

    render(
      <MemoryRouter initialEntries={["/invoice/edit"]}>
        <Routes>
          <Route path="/invoice/edit/" element={<EditInvoice />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    });
  });
});
