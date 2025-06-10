import React from "react";
import AttendanceManagement from "./AttendanceManagement";
import SessionMetricsManagement from "./SessionMetricsManagement";
import PlayerMetricsManagement from "./PlayerMetricsManagement";
import PlayerMetricsRecording from "./PlayerMetricsRecording";
import { WORKFLOW_STEP_IDS } from "@/constants/sessionRoutes";

const DefaultContent = () => (
  <div className="text-center py-8 text-muted-foreground">
    <p>
      Select a step above to manage different aspects of this training session.
    </p>
  </div>
);

const ContentRenderer = ({ currentPage, sessionDetails, onAutoAdvance }) => {
  const componentMap = {
    [WORKFLOW_STEP_IDS.ATTENDANCE]: AttendanceManagement,
    [WORKFLOW_STEP_IDS.SESSION_METRICS]: SessionMetricsManagement,
    [WORKFLOW_STEP_IDS.PLAYER_METRICS]: PlayerMetricsManagement,
    [WORKFLOW_STEP_IDS.RECORD_METRICS]: PlayerMetricsRecording,
  };

  const Component = componentMap[currentPage];
  
  if (!Component) {
    return <DefaultContent />;
  }

  return (
    <Component 
      session={sessionDetails} 
      onSaveSuccess={onAutoAdvance} 
    />
  );
};

export default ContentRenderer;
