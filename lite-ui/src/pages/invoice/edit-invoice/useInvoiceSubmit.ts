import { showNotification } from "@mantine/notifications";
import { convertToDateTime } from "../../../helpers/dateHelpers";
import { Invoice } from "../Invoice.model";
import { createInvoice } from "../InvoiceApi";
import { InvoiceFormState } from "./formState";
import { useNavigate } from "react-router-dom";

export const useInvoiceSubmit = (
  invoiceForm: InvoiceFormState,
  isNewInvoice: boolean
) => {
  const navigate = useNavigate();
  const submitInvoice = async () => {
    if (!invoiceForm.dueDate) {
      return;
    }
    const invoicePayload: Invoice = {
      ...invoiceForm,
      dueDate: invoiceForm.dueDate
        ? convertToDateTime(invoiceForm.dueDate)
        : "",
    };
    if (!isNewInvoice) {
      return alert("Invoice editing not yet implemented on the backend!");
    }

    try {
      await createInvoice(invoicePayload);
      showNotification({
        title: "Saved",
        message: "Invoice saved successfully",
        color: "green",
      });
      navigate("/invoices");
    } catch (e) {
      console.error(e);
      showNotification({
        title: "Error",
        message: "Failed to save invoice",
        color: "red",
      });
    }
  };

  return { submitInvoice };
};
