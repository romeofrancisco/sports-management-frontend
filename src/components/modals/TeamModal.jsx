import React from "react";
import Modal from "../common/Modal";
import { useCoaches } from "@/hooks/useCoaches";
import { useSports } from "@/hooks/useSports";
import UpdateTeamForm from "../forms/TeamForm";
import { Users } from "lucide-react";

const TeamModal = ({ isOpen, onClose, team }) => {
  const { data: coaches, isLoading: isCoachesLoading } = useCoaches(
    {},
    1,
    1000,
    isOpen,
  );
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);

  // Extract coaches array from paginated response
  const coachesArray = coaches?.results || [];

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title={team ? "Edit Team" : "Create New Team"}
      description={team ? "Update team details and roster" : "Enter details to create a new team"}
      icon={Users}
      size={"md"}
    >
      <UpdateTeamForm
        coaches={coachesArray}
        sports={sports}
        team={team}
        onClose={onClose}
      />
    </Modal>
  );
};

export default TeamModal;
