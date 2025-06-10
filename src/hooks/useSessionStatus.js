import { useMemo } from "react";

export const useSessionStatus = (sessionDetails) => {
  return useMemo(() => {
    if (!sessionDetails) return "upcoming";
    
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
      return "upcoming";
    } else if (now >= sessionStart && now <= sessionEnd) {
      return "ongoing";
    } else {
      return "completed";
    }
  }, [sessionDetails]);
};
