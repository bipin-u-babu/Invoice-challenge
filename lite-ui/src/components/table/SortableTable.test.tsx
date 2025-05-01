import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SortableTable, Column } from "./SortableTable";

type InvoiceData = {
  id: number;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
};

const testData: InvoiceData[] = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    customerName: "Alice",
    amount: 500,
    dueDate: "2023-10-01",
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    customerName: "Bob",
    amount: 300,
    dueDate: "2023-09-15",
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    customerName: "Charlie",
    amount: 700,
    dueDate: "2023-11-01",
  },
];

const columns: Column<InvoiceData>[] = [
  { label: "Invoice Number", accessor: "invoiceNumber" },
  { label: "Customer Name", accessor: "customerName" },
  { label: "Amount", accessor: "amount" },
  { label: "Due Date", accessor: "dueDate" },
];

describe("SortableTable", () => {
  it("renders table with invoice data", () => {
    render(
      <SortableTable
        data={testData}
        columns={columns}
        intialSortBy={null}
        rowKey={(row) => row.id}
      />
    );

    expect(screen.getByText(/Invoice Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("2023-10-01")).toBeInTheDocument();
  });

  it("sorts invoice data by column when header is clicked", () => {
    render(
      <SortableTable
        data={testData}
        columns={columns}
        intialSortBy={null}
        rowKey={(row) => row.id}
      />
    );

    const amountHeader = screen.getByText(/Amount/i);
    fireEvent.click(amountHeader);

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Bob");
    expect(rows[2]).toHaveTextContent("Alice");
    expect(rows[3]).toHaveTextContent("Charlie");
  });

  it("calls onRowClick when an invoice row is clicked", () => {
    const onRowClick = vi.fn();
    render(
      <SortableTable
        data={testData}
        columns={columns}
        intialSortBy={null}
        rowKey={(row) => row.id}
        onRowClick={onRowClick}
      />
    );

    const row = screen.getByText("Alice").closest("tr");
    fireEvent.click(row!);

    expect(onRowClick).toHaveBeenCalledWith(testData[0]);
  });

  it("renders custom cell content if render function is provided", () => {
    const customColumns: Column<InvoiceData>[] = [
      {
        label: "Customer Name",
        accessor: "customerName",
        render: (row) => <strong>{row.customerName}</strong>,
      },
    ];

    render(
      <SortableTable
        data={testData}
        columns={customColumns}
        intialSortBy={null}
        rowKey={(row) => row.id}
      />
    );

    expect(screen.getByText("Alice").tagName).toBe("STRONG");
  });
});
