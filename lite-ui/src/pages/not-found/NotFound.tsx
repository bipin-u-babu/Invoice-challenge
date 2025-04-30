import { Button, Title, Text, Stack, Center } from "@mantine/core";
import styles from "./NotFound.module.scss";
import useNavigateWithUserId from "../../routes/useNavigateWithUserId";

export default function NotFoundPage() {
  const navigate = useNavigateWithUserId();

  return (
    <div className={styles["not-found-page"]}>
      <Center className={styles["not-found-content"]}>
        <Stack align="center" spacing="md">
          <Title order={1} size="4rem">
            404
          </Title>
          <Text size="lg" align="center">
            The page you're looking for doesn't exist.
          </Text>
          <Button variant="filled" size="md" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Stack>
      </Center>
    </div>
  );
}
