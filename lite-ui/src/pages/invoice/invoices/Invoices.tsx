import { Button, Tooltip } from "@mantine/core";
import clsx from "clsx";
import styles from "./Invoices.module.scss";
import { useEffect, useState } from "react";
import { Invoice, InvoiceStatus } from "../Invoice.model";
import { deleteInvoice, fetchAllInvoices } from "../InvoiceApi";
import { showNotification } from "@mantine/notifications";
import useNavigateWithUserId from "../../../routes/useNavigateWithUserId";
import { Column, SortableTable } from "../../../components/table/SortableTable";
import {
  IconBan,
  IconCurrencyEuro,
  IconFilePencil,
  IconFolder,
} from "@tabler/icons";

const statusIcons = {
  DRAFT: <IconFilePencil size={24} />,
  OPEN: <IconFolder size={24} />,
  PAID: <IconCurrencyEuro size={24} />,
  CANCELLED: <IconBan size={24} />,
};

const Invoices = (): JSX.Element => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const navigate = useNavigateWithUserId();

  useEffect(() => {
    fetchAllInvoices().then((data) => {
      setInvoices(data);
    });
  }, []);

  const handleDelete = async (e: React.MouseEvent, invoiceId?: number) => {
    e.stopPropagation();
    try {
      if (invoiceId) {
        await deleteInvoice(invoiceId);
        setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to delete invoice",
        color: "red",
      });
    }
  };

  const columns: Column<Invoice>[] = [
    {
      label: "Status",
      accessor: "status",
      render: (i) => {
        return (
          <Tooltip label={i.status}>
            <span
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ cursor: "default" }}
            >
              {statusIcons[i.status]}
            </span>
          </Tooltip>
        );
      },
    },
    {
      label: "Due date",
      accessor: "dueDate",
      render: (i) => new Date(i.dueDate).toLocaleDateString("en-GB"),
    },
    { label: "Number", accessor: "invoiceNumber" },
    {
      label: "Customer",
      accessor: "customer.givenname",
      render: (i) => `${i.customer.givenname} ${i.customer.surname}`,
    },
    {
      label: "Create date",
      accessor: "creationDate",
      render: (i) =>
        i.creationDate
          ? new Date(i.creationDate).toLocaleDateString("en-GB")
          : "-",
    },
    { label: "Net price", accessor: "priceNet" },
    { label: "Gross price", accessor: "priceGross" },
    {
      label: "Actions",
      accessor: "actions",
      render: (i) => (
        <Tooltip label="delete">
          <Button onClick={(e: any) => handleDelete(e, i.id)}>Delete</Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className={clsx(styles["invoices"])}>
      <SortableTable
        intialSortBy="dueDate"
        data={invoices}
        columns={columns}
        rowKey={(i) => i.id || ""}
        onRowClick={(i) => navigate(`/edit-invoice/${i.id}`)}
      />
    </div>
  );
};

export { Invoices };
