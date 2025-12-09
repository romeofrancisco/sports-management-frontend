import React from "react";
import CoachForm from "../forms/CoachForm";
import Modal from "../common/Modal";
import { User } from "lucide-react";  

const CoachModal = ({ isOpen, onClose, coach }) => {
  const isEdit = !!coach;

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title={isEdit ? "Update Coach" : "Register New Coach"}
      description={
        isEdit
          ? "Update the details of the coach."
          : "Fill in the details to register a new coach."
      }
      icon={User}
      size="md"
    >
      <CoachForm onClose={onClose} coach={coach} />
    </Modal>
  );
};

export default CoachModal;
