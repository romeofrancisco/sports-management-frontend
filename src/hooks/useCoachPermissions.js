import { useRolePermissions } from "./useRolePermissions";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export const useCoachPermissions = () => {
  const { isAdmin, isCoach } = useRolePermissions();
  const currentUser = useSelector((state) => state.auth?.user);

  const checkGamePermission = (game) => {
    // Admin always has permission
    if (isAdmin()) return true;
    
    // If not a coach, no permission
    if (!isCoach()) return false;
    
    // For league and tournament games, check if coach is assigned
    if (game?.type === 'league' || game?.type === 'tournament') {
      const assignedCoaches = game?.assigned_coaches || [];
      console.log('Assigned Coaches:', assignedCoaches, 'Current User ID:', currentUser?.id);
      return assignedCoaches.some(coach => coach.id === currentUser?.id);
    }
    
    // For practice games, allow all coaches (can be refined later based on team ownership)
    return true;
  };

  const requirePermissionForAction = (game, action) => {
    const hasPermission = checkGamePermission(game);
    
    if (!hasPermission) {
      toast.error("Access Denied", {
        description: `You don't have permission to ${action} this ${game?.type || 'game'}.`,
        richColors: true,
      });
      return false;
    }
    
    return true;
  };

  return {
    checkGamePermission,
    requirePermissionForAction,
  };
};
