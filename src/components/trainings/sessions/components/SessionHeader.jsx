import React from "react";
import { Badge } from "@/components/ui/badge";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { SESSION_STATUS } from "@/constants/sessionRoutes";

const SessionStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case SESSION_STATUS.UPCOMING:
        return {
          variant: "secondary",
          className: "bg-blue-100 text-blue-800 border-blue-300",
          label: "Upcoming",
        };
      case SESSION_STATUS.ONGOING:
        return {
          variant: "default",
          className: "bg-green-100 text-green-800 border-green-300",
          label: "Ongoing",
        };
      case SESSION_STATUS.COMPLETED:
        return {
          variant: "outline",
          className: "bg-gray-100 text-gray-800 border-gray-300",
          label: "Completed",
        };
      default:
        return {
          variant: "outline",
          className: "bg-gray-100 text-gray-800 border-gray-300",
          label: "Unknown",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>  );
};

const SessionHeader = ({
  sessionDetails, 
  sessionStatus
}) => {
  if (!sessionDetails) return null;

  const { title, date, team_name } = sessionDetails;

  return (
    <UniversityPageHeader
      title="Manage Training Session"
      subtitle={`${title} - ${team_name} (${new Date(date).toLocaleDateString()})`}
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Sessions", href: "/training/sessions" },
        { label: "Manage Session" },
      ]}    >
      <div className="flex items-center gap-3">
        <SessionStatusBadge status={sessionStatus} />
      </div>
    </UniversityPageHeader>
  );
};

export default SessionHeader;
