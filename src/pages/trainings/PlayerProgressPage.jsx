// Re-export the new overview page to maintain backward compatibility
import PlayerProgressOverviewPage from "./PlayerProgressOverviewPage";

const PlayerProgressPage = () => {
  return <PlayerProgressOverviewPage />;
};

export default PlayerProgressPage;
