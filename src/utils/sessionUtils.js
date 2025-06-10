import { SESSION_STATUS } from "@/constants/sessionRoutes";

export const getSessionStatusConfig = (status) => {
  switch (status) {
    case SESSION_STATUS.UPCOMING:
      return {
        variant: "secondary",
        className: "bg-blue-100 text-blue-800 border-blue-300",
        label: "Upcoming",
        color: "blue",
      };
    case SESSION_STATUS.ONGOING:
      return {
        variant: "default", 
        className: "bg-green-100 text-green-800 border-green-300",
        label: "Ongoing",
        color: "green",
      };
    case SESSION_STATUS.COMPLETED:
      return {
        variant: "outline",
        className: "bg-gray-100 text-gray-800 border-gray-300", 
        label: "Completed",
        color: "gray",
      };
    default:
      return {
        variant: "outline",
        className: "bg-gray-100 text-gray-800 border-gray-300",
        label: "Unknown",
        color: "gray",
      };
  }
};

export const calculateSessionStatus = (sessionDetails) => {
  if (!sessionDetails) return SESSION_STATUS.UPCOMING;
  
  if (sessionDetails?.status) {
    return sessionDetails.status;
  }

  // Fallback to client-side calculation
  const now = new Date();
  const sessionStart = new Date(
    `${sessionDetails.date}T${sessionDetails.start_time}`
  );
  const sessionEnd = new Date(
    `${sessionDetails.date}T${sessionDetails.end_time}`
  );

  if (now < sessionStart) {
    return SESSION_STATUS.UPCOMING;
  } else if (now >= sessionStart && now <= sessionEnd) {
    return SESSION_STATUS.ONGOING;
  } else {
    return SESSION_STATUS.COMPLETED;
  }
};

export const formatSessionTitle = (sessionDetails) => {
  if (!sessionDetails) return "";
  
  const { title, team_name, date } = sessionDetails;
  const formattedDate = new Date(date).toLocaleDateString();
  
  return `${title} - ${team_name} (${formattedDate})`;
};

export const canEndSession = (sessionStatus) => {
  return sessionStatus === SESSION_STATUS.ONGOING;
};

export const getWorkflowStepRoute = (stepId, sessionId) => {
  const routes = {
    attendance: `/sessions/${sessionId}/manage/attendance`,
    "session-metrics": `/sessions/${sessionId}/manage/session-metrics`,
    "player-metrics": `/sessions/${sessionId}/manage/player-metrics`,
    "record-metrics": `/sessions/${sessionId}/manage/record-metrics`,
  };
  
  return routes[stepId] || routes.attendance;
};
