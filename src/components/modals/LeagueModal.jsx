import React from "react";
import { useSports } from "@/hooks/useSports";
import LeagueForm from "../forms/LeagueForm";
import Modal from "../common/Modal";
import { Trophy } from "lucide-react";

const LeagueModal = ({ isOpen, onClose, league = null }) => {
  const isEdit = !!league;
  const {
    data: sports,
    isLoading: isSportsLoading,
    isError: isSportsError,
  } = useSports(isOpen);

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title={isEdit ? "Update League" : "Create League"}
      description={
        isEdit
          ? "Update league details."
          : "Create a new league."
      }
      size="sm"
      icon={Trophy}
    >
      <LeagueForm sports={sports} onClose={onClose} league={league} />
    </Modal>
  );
};

export default LeagueModal;
