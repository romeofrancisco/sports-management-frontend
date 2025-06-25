import React, { useState } from 'react';
import PlayersTab from './PlayersTab';
import PlayerDetailDashboard from '../PlayerDetailDashboard';
import { usePlayerAttendanceAnalytics, usePlayerAttendanceDetail } from '@/hooks/useAttendanceAnalytics';

const PlayersTabContainer = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Fetch all players attendance analytics
  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
  } = usePlayerAttendanceAnalytics({});

  // Fetch selected player detail
  const {
    data: playerDetailData,
    isLoading: playerDetailLoading,
    error: playerDetailError,
  } = usePlayerAttendanceDetail(selectedPlayer?.player_id, {}, { enabled: !!selectedPlayer });

  if (playersLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <p className="font-medium">Loading player data...</p>
          <p className="text-muted-foreground text-sm">Please wait while we process your analytics</p>
        </div>
      </div>
    );
  }
  if (playersError) {
    return (
      <div className="mb-6 text-center text-destructive font-medium">
        {playersError?.message || 'Failed to load player analytics data'}
      </div>
    );
  }

  // If a player is selected, show their individual dashboard
  if (selectedPlayer) {
    return (
      <PlayerDetailDashboard 
        player={selectedPlayer}
        playerDetailData={playerDetailData}
        playerDetailLoading={playerDetailLoading}
        playerDetailError={playerDetailError}
        onBack={() => setSelectedPlayer(null)}
      />
    );
  }

  // Otherwise show the players list
  return (
    <PlayersTab 
      playersData={playersData}
      selectedPlayer={selectedPlayer}
      onPlayerSelect={setSelectedPlayer}
    />
  );
};

export default PlayersTabContainer;
