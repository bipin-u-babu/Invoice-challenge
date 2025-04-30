import {
  NumberInput,
  SimpleGrid,
  Table,
  TextInput,
  Text,
  Title,
  Container,
  Group,
  Button,
} from "@mantine/core";
import styles from "./EditInvoice.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { DatePicker } from "@mantine/dates";
import { Customer, Invoice } from "../Invoice.model";
import { createInvoice, fetchInvoice } from "../InvoiceApi";
import {
  formStateHandler,
  initialInvoiceFormState,
  InvoiceFormState,
} from "./formState";
import { useInvoiceSubmit } from "./useInvoiceSubmit";

const EditInvoice = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();
  const isNewInvoice = params.invoiceId === undefined;
  const [invoiceForm, dispatch] = useReducer(
    formStateHandler,
    initialInvoiceFormState
  );
  const submitInvoice = useInvoiceSubmit(
    invoiceForm,
    isNewInvoice
  ).submitInvoice;

  useEffect(() => {
    if (!params.invoiceId) {
      return;
    }
    fetchInvoice(parseInt(params.invoiceId)).then((invoice) => {
      if (!invoice) {
        return;
      }
      dispatch({ type: "fill-invoice", payload: invoice });
    });
  }, []);

  function onAmountNetChange(value: number | undefined) {
    if (typeof value === "undefined") {
      return;
    }
    dispatch({ type: "amount-net", payload: value });
  }

  function onAmountGrossChange(value: number | undefined) {
    if (typeof value === "undefined") {
      return;
    }
    dispatch({ type: "amount-gross", payload: value });
  }

  return (
    <Container mt={"md"}>
      <form>
        <Title mb={"xl"} order={2}>
          {isNewInvoice
            ? "Create new invoice"
            : `Edit invoice: ${params.invoiceId}`}
        </Title>
        <div className={styles["form-section"]}>
          <SimpleGrid cols={2}>
            <div>
              <Title order={5}>Date</Title>
              <Text fz="xs" c="dimmed">
                Enter due date of the invoice
              </Text>
            </div>
            <DatePicker
              value={invoiceForm.dueDate}
              onChange={(value) => {
                dispatch({ type: "date", payload: value });
              }}
              placeholder="Select date"
              label="Due date"
              withAsterisk
            />
          </SimpleGrid>
        </div>
        <div className={styles["form-section"]}>
          <SimpleGrid cols={2}>
            <div>
              <Title order={5}>Customer</Title>
              <Text fz="xs" c="dimmed">
                Enter the name and surname of the customer the invoice belongs
                to
              </Text>
            </div>
            <div>
              <TextInput
                required={true}
                value={invoiceForm.customer.givenname}
                onChange={(e) => {
                  dispatch({ type: "name", payload: e.currentTarget.value });
                }}
                label="Name"
              />
              <TextInput
                required={true}
                value={invoiceForm.customer.surname}
                onChange={(e) => {
                  dispatch({ type: "surname", payload: e.currentTarget.value });
                }}
                label="Surname"
              />
            </div>
          </SimpleGrid>
        </div>
        <div className={styles["form-section"]}>
          <SimpleGrid cols={2}>
            <div>
              <Title order={5}>Price</Title>
            </div>
            <div>
              <NumberInput
                required={true}
                value={invoiceForm.priceNet}
                onChange={onAmountNetChange}
                precision={2}
                label="Price (Net)"
              />
              <NumberInput
                required={true}
                value={invoiceForm.priceGross}
                onChange={onAmountGrossChange}
                precision={2}
                label="Price (brut)"
              />
            </div>
          </SimpleGrid>
        </div>
        <Group position="right">
          <Button
            onClick={() => {
              submitInvoice?.();
            }}
          >
            Create invoice
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export { EditInvoice };
