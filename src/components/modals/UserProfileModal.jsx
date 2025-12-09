import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserProfileForm from "../forms/UserProfileForm";
import { UserCog, Shield, Trophy } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useSelector } from "react-redux";
import Modal from "../common/Modal";
import PasswordForm from "@/pages/auth/form/PasswordForm";

const UserProfileModal = ({ isOpen, onClose }) => {
  const [changePassword, setChangePassword] = React.useState(false);
  const { user } = useSelector((state) => state.auth);

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <Shield className="text-primary" />;
      case "Coach":
        return <UserCog className="text-primary" />;
      case "Player":
        return <Trophy className="text-primary" />;
      default:
        return <UserCog className="text-primary" />;
    }
  };

  if (!isOpen) return null;

  // Custom modal implementation
  return (
    <Modal
      open={isOpen}
      title="User Profile"
      icon={getRoleIcon}
      description="Update your personal information"
      onOpenChange={() => {
        onClose();
        setChangePassword(false);
      }}
      size="md"
    >
      {changePassword ? (
        <PasswordForm mode="change" onClose={() => setChangePassword(false)} />
      ) : (
        <UserProfileForm
          onClose={onClose}
          user={user}
          changePassword={() => setChangePassword(true)}
        />
      )}
    </Modal>
  );
};

export default UserProfileModal;
