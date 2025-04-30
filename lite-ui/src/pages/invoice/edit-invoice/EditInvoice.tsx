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
import { useEffect, useReducer } from "react";
import { DatePicker } from "@mantine/dates";
import { fetchInvoice } from "../InvoiceApi";
import { formStateHandler, initialInvoiceFormState } from "./formState";
import { useInvoiceSubmit } from "./useInvoiceSubmit";
import { useTranslation } from "react-i18next";

const EditInvoice = (): JSX.Element => {
  const params = useParams();
  const { t } = useTranslation();
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
            ? t("CREATE_INVOICE")
            : `${t("EDIT_INVOICE")}: ${params.invoiceId}`}
        </Title>
        <div className={styles["form-section"]}>
          <SimpleGrid cols={2}>
            <div>
              <Title order={5}>{t("DATE")}</Title>
              <Text fz="xs" c="dimmed">
                {t("INVOICE_FORM_DATE_LABEL")}
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
              <Title order={5}>{t("CUSTOMER")}</Title>
              <Text fz="xs" c="dimmed">
                {t("INVOICE_FORM_CUSTOMER_LABEL")}
              </Text>
            </div>
            <div>
              <TextInput
                required={true}
                value={invoiceForm.customer.givenname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  dispatch({ type: "name", payload: e.currentTarget.value });
                }}
                label={t("NAME")}
              />
              <TextInput
                required={true}
                value={invoiceForm.customer.surname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  dispatch({ type: "surname", payload: e.currentTarget.value });
                }}
                label={t("SURNAME")}
              />
            </div>
          </SimpleGrid>
        </div>
        <div className={styles["form-section"]}>
          <SimpleGrid cols={2}>
            <div>
              <Title order={5}>{t("PRICE")}</Title>
            </div>
            <div>
              <NumberInput
                required={true}
                value={invoiceForm.priceNet}
                onChange={onAmountNetChange}
                precision={2}
                label={t("PRICE_NET")}
              />
              <NumberInput
                required={true}
                value={invoiceForm.priceGross}
                onChange={onAmountGrossChange}
                precision={2}
                label={t("PRICE_BRUT")}
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
