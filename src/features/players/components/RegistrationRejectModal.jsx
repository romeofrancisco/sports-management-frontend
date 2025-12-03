import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { XCircle, Loader2 } from "lucide-react";

const RegistrationRejectModal = ({
  open,
  onOpenChange,
  registration,
  onReject,
  isLoading,
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onReject({
      id: registration.id,
      data: {
        rejection_reason: reason || "Application did not meet requirements.",
      },
    });
  };

  // Reset form when modal closes
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setReason("");
    }
    onOpenChange(isOpen);
  };

  if (!registration) return null;

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      icon={XCircle}
      title="Reject Registration"
      description={`Reject ${registration.full_name || `${registration.first_name} ${registration.last_name}`}'s registration`}
      contentClassName="sm:max-w-[450px]"
    >
      <div className="space-y-4">
        {/* Applicant Info Summary */}
        <div className="p-3 rounded-lg bg-destructive/10 space-y-1">
          <p className="text-sm">
            <span className="text-muted-foreground">Applicant:</span>{" "}
            <span className="font-medium">
              {registration.full_name || `${registration.first_name} ${registration.last_name}`}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Email:</span>{" "}
            <span className="font-medium">{registration.email}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Sport:</span>{" "}
            <span className="font-medium">{registration.sport?.name}</span>
          </p>
        </div>

        {/* Rejection Reason */}
        <div className="space-y-2">
          <Label htmlFor="reason">Rejection Reason</Label>
          <Textarea
            id="reason"
            placeholder="Provide a reason for rejection (optional)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            This message will be included in the rejection email sent to the applicant.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 size-4" />
                Rejecting...
              </>
            ) : (
              "Reject"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RegistrationRejectModal;
