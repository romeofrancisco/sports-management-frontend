import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useBroadcastTeams, useBroadcastMessage } from "@/hooks/useChat";
import { toast } from "sonner";
import { Send, Megaphone, Search, Users, Loader2 } from "lucide-react";

const BroadcastMessageDialog = ({ open, onOpenChange }) => {
  const [message, setMessage] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState("");

  const { data: broadcastData, isLoading: isLoadingTeams } =
    useBroadcastTeams();
  const broadcastMutation = useBroadcastMessage();

  const teams = broadcastData?.teams || [];
  const canBroadcastAll = broadcastData?.can_broadcast_all || false;

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!search.trim()) return teams;
    return teams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [teams, search]);

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedTeams(teams.map((t) => t.id));
    } else {
      setSelectedTeams([]);
    }
  };

  const handleTeamSelect = (teamId, checked) => {
    if (checked) {
      const newSelected = [...selectedTeams, teamId];
      setSelectedTeams(newSelected);
      // Check if all teams are now selected
      if (newSelected.length === teams.length) {
        setSelectAll(true);
      }
    } else {
      setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
      setSelectAll(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (selectedTeams.length === 0 && !selectAll) {
      toast.error("Please select at least one team");
      return;
    }

    try {
      const result = await broadcastMutation.mutateAsync({
        message: message.trim(),
        teamIds: selectAll && canBroadcastAll ? [] : selectedTeams,
        broadcastAll: selectAll && canBroadcastAll,
      });

      toast.success(
        `Message sent to ${result.successful} team${
          result.successful !== 1 ? "s" : ""
        }`,
        { richColors: true }
      );

      if (result.failed > 0) {
        toast.warning(`Failed to send to ${result.failed} team(s)`, {
          richColors: true,
        });
      }

      // Reset form and close dialog
      setMessage("");
      setSelectedTeams([]);
      setSelectAll(false);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to broadcast message",
        { richColors: true }
      );
    }
  };

  const handleClose = () => {
    setMessage("");
    setSelectedTeams([]);
    setSelectAll(false);
    setSearch("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="size-5 text-primary" />
            Broadcast Message
          </DialogTitle>
          <DialogDescription>
            Send a message to multiple teams at once.
            {canBroadcastAll
              ? " As an admin, you can broadcast to all teams."
              : " You can broadcast to teams you coach."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Team Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="size-4" />
              Select Teams ({selectedTeams.length} of {teams.length} selected)
            </Label>

            {/* Search */}
            <div className="relative">
              <Search className="size-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/20">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <Label
                htmlFor="select-all"
                className="text-sm font-medium cursor-pointer flex-1"
              >
                Select All Teams
              </Label>
              <span className="text-xs text-muted-foreground">
                {teams.length} teams
              </span>
            </div>

            {/* Team List */}
            <ScrollArea className="h-48 rounded-md border">
              {isLoadingTeams ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredTeams.length === 0 ? (
                <div className="flex items-center justify-center h-47 text-muted-foreground text-sm">
                  {search ? "No teams found" : "No teams available"}
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-primary/20 transition-colors"
                    >
                      <Checkbox
                        id={`team-${team.id}`}
                        checked={selectedTeams.includes(team.id)}
                        onCheckedChange={(checked) =>
                          handleTeamSelect(team.id, checked)
                        }
                      />
                      <Avatar className="size-8 border-2 border-primary/20">
                        <AvatarImage src={team.logo} alt={team.name} />
                        <AvatarFallback>{team.name[0]}</AvatarFallback>
                      </Avatar>
                      <Label
                        htmlFor={`team-${team.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {team.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="broadcast-message">Message</Label>
            <Textarea
              id="broadcast-message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={
              broadcastMutation.isPending ||
              !message.trim() ||
              (selectedTeams.length === 0 && !selectAll)
            }
          >
            {broadcastMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Broadcast ({selectAll ? teams.length : selectedTeams.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BroadcastMessageDialog;
