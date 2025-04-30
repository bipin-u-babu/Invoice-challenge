import { Button, Table } from "@mantine/core";
import clsx from "clsx";
import styles from "./Invoices.module.scss";
import { useEffect, useState } from "react";
import { Invoice } from "../Invoice.model";
import { deleteInvoice, fetchAllInvoices } from "../InvoiceApi";
import { showNotification } from "@mantine/notifications";
import useNavigateWithUserId from "../../../routes/useNavigateWithUserId";

const Invoices = (): JSX.Element => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const navigate = useNavigateWithUserId();

  useEffect(() => {
    fetchAllInvoices().then((invoices) => {
      setInvoices(invoices);
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

  const rows = invoices.map((invoice) => (
    <tr
      className={styles["invoice-table-row"]}
      key={invoice.id}
      onClick={() => {
        navigate(`/edit-invoice/${invoice.id}`);
      }}
    >
      <td>{invoice.status}</td>
      <td>{new Date(invoice.dueDate).toLocaleDateString("en-GB")}</td>
      <td>{invoice.invoiceNumber}</td>
      <td>{`${invoice.customer.givenname} ${invoice.customer.surname}`}</td>
      <td>
        {invoice.creationDate
          ? new Date(invoice.creationDate).toLocaleDateString("en-GB")
          : "-"}
      </td>
      <td>{invoice.priceNet}</td>
      <td>{invoice.priceGross}</td>
      <td>
        <Button onClick={(e: any) => handleDelete(e, invoice.id)}>
          Delete
        </Button>
      </td>
    </tr>
  ));

  return (
    <div className={clsx(styles["invoices"])}>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Status</th>
            <th>Due date</th>
            <th>Number</th>
            <th>Customer</th>
            <th>Create date</th>
            <th>Net price</th>
            <th>Gross price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};

export { Invoices };
