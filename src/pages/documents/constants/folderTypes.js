

export const FolderTypes = {
  PUBLIC: "public",
  COACHES: "coaches",
  COACH_PERSONAL: "coach_personal",
  PLAYERS: "players",
  PLAYER_PERSONAL: "player_personal",
  ADMIN_PRIVATE: "admin_private",
};

export const FolderTypeLabels = {
  [FolderTypes.PUBLIC]: "Public Folder",
  [FolderTypes.COACHES]: "Coaches Folder",
  [FolderTypes.COACH_PERSONAL]: "Coach Personal Folder",
  [FolderTypes.PLAYERS]: "Players Folder",
  [FolderTypes.PLAYER_PERSONAL]: "Player Personal Folder",
  [FolderTypes.ADMIN_PRIVATE]: "Admin Private Folder",
};

export const getFolderTypeLabel = (folderType) => {
  return FolderTypeLabels[folderType] || "Unknown Folder Type";
}