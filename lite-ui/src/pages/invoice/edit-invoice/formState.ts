import { Invoice } from "../Invoice.model";

export type InvoiceFormState = Omit<Invoice, "dueDate"> & {
  dueDate: Date | null;
};

type NameAction = {
  type: "name";
  payload: string;
};

type SurnameAction = {
  type: "surname";
  payload: string;
};

type PriceNetAction = {
  type: "amount-net";
  payload: number;
};

type PriceGrossAction = {
  type: "amount-gross";
  payload: number;
};

type DateAction = {
  type: "date";
  payload: Date | null;
};

type FillInvoiceAction = {
  type: "fill-invoice";
  payload: Invoice;
};

export type FormStateAction =
  | NameAction
  | DateAction
  | SurnameAction
  | PriceNetAction
  | PriceGrossAction
  | FillInvoiceAction;

// Initial form state
export const initialInvoiceFormState: InvoiceFormState = {
  customer: {
    givenname: "",
    surname: "",
  },
  priceNet: 0,
  priceGross: 0,
  dueDate: null,
  status: "OPEN",
  invoiceNumber: 1337,
  quantity: 1,
};

// Reducer function to handle form state updates
export function formStateHandler(
  state: InvoiceFormState,
  action: FormStateAction
): InvoiceFormState {
  switch (action.type) {
    case "name":
      return {
        ...state,
        customer: {
          givenname: action.payload,
          surname: state.customer.surname,
        },
      };
    case "surname":
      return {
        ...state,
        customer: {
          surname: action.payload,
          givenname: state.customer.givenname,
        },
      };
    case "amount-net":
      return {
        ...state,
        priceNet: action.payload,
      };
    case "amount-gross":
      return {
        ...state,
        priceGross: action.payload,
      };
    case "date":
      return {
        ...state,
        dueDate: action.payload,
      };
    case "fill-invoice":
      return {
        customer: {
          givenname: action.payload.customer.givenname,
          surname: action.payload.customer.surname,
        },
        priceNet: action.payload.priceNet,
        priceGross: action.payload.priceGross,
        dueDate: new Date(action.payload.dueDate),
        status: action.payload.status,
        invoiceNumber: action.payload.invoiceNumber,
        quantity: action.payload.quantity,
      };
    default:
      return state;
  }
}
