import React from 'react';
import PlayersTab from './PlayersTab';
import PlayerDetailDashboard from './PlayerDetailDashboard';

const PlayersTabContainer = ({ 
  selectedPlayer, 
  playersData, 
  playerDetailData, 
  playerDetailLoading, 
  playerDetailError,
  onPlayerSelect,
  onPlayerBack 
}) => {
  // If a player is selected, show their individual dashboard
  if (selectedPlayer) {
    return (
      <PlayerDetailDashboard 
        player={selectedPlayer}
        playerDetailData={playerDetailData}
        playerDetailLoading={playerDetailLoading}
        playerDetailError={playerDetailError}
        onBack={onPlayerBack}
      />
    );
  }

  // Otherwise show the players list
  return (
    <PlayersTab 
      playersData={playersData}
      selectedPlayer={selectedPlayer}
      onPlayerSelect={onPlayerSelect}
    />
  );
};

export default PlayersTabContainer;
