import { useCallback, useEffect } from "react";
import { InvoiceFormState } from "./formState";
import { Invoice } from "../Invoice.model";

const LOCAL_STORAGE_KEY = "invoiceForm";

export function useInvoiceDraft() {
  const loadDraft = useCallback((): InvoiceFormState | null => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return null;

    try {
      const parsedInvoice = JSON.parse(stored) as Invoice;
      return {
        ...parsedInvoice,
        dueDate: new Date(parsedInvoice.dueDate),
      };
    } catch (error) {
      return null;
    }
  }, []);

  const saveDraft = useCallback((invoiceForm: InvoiceFormState) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(invoiceForm));
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  const hasDraft = useCallback(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
  }, []);

  return {
    loadDraft,
    clearDraft,
    hasDraft,
    saveDraft,
  };
}
