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

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <Shield className="size-6 text-primary-foreground" />;
      case "Coach":
        return <UserCog className="size-6 text-primary-foreground" />;
      case "Player":
        return <Trophy className="size-6 text-primary-foreground" />;
      default:
        return <UserCog className="size-6 text-primary-foreground" />;
    }
  };

  if (!isOpen) return null;

  // Custom modal implementation
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-background via-primary/5 to-background border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary">
              {getRoleIcon(user?.role)}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Update Profile
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Manage your personal information and settings
              </DialogDescription>
            </div>
            <div className="ml-auto">
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30">
                {user?.role}
              </div>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(95vh-140px)] px-6 pb-6">
          <UserProfileForm onClose={onClose} user={user} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
