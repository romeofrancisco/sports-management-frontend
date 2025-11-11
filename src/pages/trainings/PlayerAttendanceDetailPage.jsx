import React from "react";
import { useParams } from "react-router-dom";
import { format, subDays } from "date-fns";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import PlayerDetailDashboard from "@/components/trainings/attendance/PlayerDetailDashboard";
import { usePlayerAttendanceDetail } from "@/hooks/useAttendanceAnalytics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const PlayerAttendanceDetailPage = () => {
  const { playerId } = useParams();

  // Default date range for attendance data
  //   const filters = {
  //     start_date: format(subDays(new Date(), 90), "yyyy-MM-dd"),
  //     end_date: format(new Date(), "yyyy-MM-dd"),
  //   };

  // Fetch player attendance details
  const {
    data: playerDetailData,
    isLoading: playerDetailLoading,
    error: playerDetailError,
  } = usePlayerAttendanceDetail(playerId);

  // Create player object from URL params and data
  const player = {
    id: playerId,
    name: playerDetailData?.player_info?.name || "Loading...",
    profile: playerDetailData?.player_info?.profile || null,
    jersey_number: playerDetailData?.player_info?.jersey_number || null,
  };

  if (playerDetailLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
        <div className="container mx-auto p-1 md:p-6 space-y-6">
          <UniversityPageHeader
            title="Player Attendance Details"
            subtitle="Training Management"
            description="Detailed attendance analytics for individual player"
            showUniversityColors={true}
            showBackButton={true}
            backButtonText="Back to Attendance"
            backButtonPath="/trainings/attendance"
          />
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="text-center space-y-2">
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Loading player attendance details...
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm">
                Analyzing attendance patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (playerDetailError || !playerDetailData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
        <div className="p-4 md:p-6 space-y-8">
          <UniversityPageHeader
            title="Player Attendance Details"
            subtitle="Training Management"
            description="Detailed attendance analytics for individual player"
            showUniversityColors={true}
            showBackButton={true}
            backButtonText="Back to Attendance"
            backButtonPath="/trainings/attendance"
          />
          <Alert className="border-red-200 bg-red-50/80 dark:bg-red-950/50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              Failed to load player attendance details. Please try refreshing
              the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Player Attendance Details"
          subtitle="Training Management"
          description="Detailed attendance analytics for individual player"
          showUniversityColors={true}
          showBackButton={true}
          backButtonText="Back to Attendance"
          backButtonPath="/trainings/attendance"
        />

        <PlayerDetailDashboard
          player={player}
          playerDetailData={playerDetailData}
          playerDetailLoading={playerDetailLoading}
          playerDetailError={playerDetailError}
        />
      </div>
    </div>
  );
};

export default PlayerAttendanceDetailPage;
