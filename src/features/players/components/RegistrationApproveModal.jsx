import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2 } from "lucide-react";
import { useSportTeams } from "@/hooks/useTeams";
import { TeamSelect } from "@/components/common/TeamSelect";
import { getDivisionLabel } from "@/constants/team";

const RegistrationApproveModal = ({
  open,
  onOpenChange,
  registration,
  onApprove,
  isLoading,
}) => {
  const [teamId, setTeamId] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");

  // Get teams for the selected sport and sex (division)
  const sportSlug = registration?.sport?.slug;
  const division = registration?.sex;
  const { data: teams, isLoading: teamsLoading } = useSportTeams(
    sportSlug,
    division
  );

  // Reset form when modal opens with new registration
  useEffect(() => {
    if (registration) {
      setTeamId(registration.team?.id?.toString() || "");
      setJerseyNumber(registration.jersey_number?.toString() || "");
    }
  }, [registration]);

  const handleSubmit = () => {
    if (!teamId) return;

    onApprove({
      id: registration.id,
      data: {
        team_id: parseInt(teamId),
        jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
      },
    });
  };

  if (!registration) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      icon={CheckCircle}
      title="Approve Registration"
      description={`Approve ${
        registration.full_name ||
        `${registration.first_name} ${registration.last_name}`
      }'s registration`}
      contentClassName="sm:max-w-[450px]"
    >
      <div className="space-y-4 px-1">
        {/* Applicant Info Summary */}
        <div className="p-3 rounded-lg bg-muted/50 space-y-1">
          <p className="text-sm">
            <span className="text-muted-foreground">Sport:</span>{" "}
            <span className="font-medium">{registration.sport?.name}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Email:</span>{" "}
            <span className="font-medium">{registration.email}</span>
          </p>
          {registration.positions?.length > 0 && (
            <p className="text-sm">
              <span className="text-muted-foreground">Positions:</span>{" "}
              <span className="font-medium">
                {registration.positions.map((p) => p.name).join(", ")}
              </span>
            </p>
          )}
        </div>
        <div>
          <TeamSelect
            label={
              <>
                Assign Team <span className="text-destructive">*</span>
              </>
            }
            placeholder={teamsLoading ? "Loading teams..." : "Select a team"}
            teams={teams || []}
            value={teamId}
            onChange={setTeamId}
            disabled={teamsLoading || !teams?.length}
          />
          {!teams?.length && !teamsLoading && (
            <p className="text-xs text-muted-foreground mt-0.5">
              No teams available for {registration.sport?.name} ({getDivisionLabel(division)})
            </p>
          )}
        </div>
        {/* Jersey Number */}
        <div className="space-y-2">
          <Label htmlFor="jersey_number">Jersey Number</Label>
          <Input
            id="jersey_number"
            type="number"
            placeholder="Enter jersey number"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
            disabled={!teamId || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 size-4" />
                Approving...
              </>
            ) : (
              "Approve"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RegistrationApproveModal;
