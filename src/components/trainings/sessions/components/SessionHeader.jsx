import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
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
  const navigate = useNavigate();
  
  if (!sessionDetails) return null;
  const { title, date, team_name, id, start_time, end_time, location } = sessionDetails;
  
  const handleViewSummary = () => {
    navigate(`/trainings/sessions/${id}/summary`);
  };

  const isCompleted = sessionStatus === SESSION_STATUS.COMPLETED;
  
  // Format date and time for better display
  const sessionDate = new Date(date);
  const formattedDate = sessionDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'  });
  
  // Helper function to convert 24-hour time to 12-hour format
  const formatTime12Hour = (timeString) => {
    if (!timeString) return '';
    
    // Handle both HH:MM and HH:MM:SS formats
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const minute = minutes || '00';
    
    if (hour === 0) return `12:${minute} AM`;
    if (hour < 12) return `${hour}:${minute} AM`;
    if (hour === 12) return `12:${minute} PM`;
    return `${hour - 12}:${minute} PM`;
  };
  
  const timeRange = start_time && end_time 
    ? `${formatTime12Hour(start_time)} - ${formatTime12Hour(end_time)}`
    : '';
    
  // Create enhanced title with badge
  const titleWithBadge = (
    <div className="flex items-center gap-3">
      <span>{title}</span>
      <SessionStatusBadge status={sessionStatus} />    </div>
  );
  
  // Create enhanced subtitle with team and date
  const enhancedSubtitle = `${team_name} • ${formattedDate}`;
  
  // Create description with time and location details
  const sessionDescription = [
    timeRange && `Time: ${timeRange}`,
    location && `Location: ${location}`
  ].filter(Boolean).join(' • ');

  return (
    <UniversityPageHeader
      title={titleWithBadge}
      subtitle={enhancedSubtitle}
      description={sessionDescription}
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Sessions", href: "/training/sessions" },
        { label: "Manage Session" },
      ]}    >
      {isCompleted && (
        <div className="flex items-center gap-3">
          <Button
            onClick={handleViewSummary}
            size="sm"
          >
            <BarChart className="h-4 w-4" />
            View Training Summary
          </Button>
        </div>
      )}
    </UniversityPageHeader>
  );
};

export default SessionHeader;
