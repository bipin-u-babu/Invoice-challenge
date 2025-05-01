import { Modal, Button, Group } from "@mantine/core";
import React from "react";

interface ConfirmLeaveModalProps {
  opened: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmPageLeaveModal: React.FC<ConfirmLeaveModalProps> = ({
  opened,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal opened={opened} onClose={onCancel} title="Unsaved Changes" centered>
      <p>You have unsaved changes. Are you sure you want to leave this page?</p>
      <Group justify="flex-end" mt="md">
        <Button variant="subtle" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm}>
          Leave Page
        </Button>
      </Group>
    </Modal>
  );
};

export default ConfirmPageLeaveModal;
