import { useSelector } from "react-redux";
import { useMemo } from "react";

/**
 * Custom hook for role-based permissions in the application
 * Provides utilities to check user permissions for various actions
 */
export const useRolePermissions = () => {
  const { user } = useSelector((state) => state.auth);

  // Helper function to check if user has a specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is an admin
  const isAdmin = () => hasRole("Admin");

  // Check if user is a coach
  const isCoach = () => hasRole("Coach");

  // Check if user is a player
  const isPlayer = () => hasRole("Player");

  // Check if user can create metric units
  const canCreateMetricUnits = () => {
    return isAdmin() || isCoach();
  };

  // Check if user can modify (edit/delete) a specific metric unit
  const canModifyMetricUnit = (unit) => {
    if (!user || !unit) return false;

    // Admin can modify any unit
    if (isAdmin()) return true;

    // Coach can only modify units they created (non-default)
    if (isCoach()) {
      return !unit.is_default && unit.created_by === user.id;
    }

    return false;
  };

  // Check if user can delete a specific metric unit
  const canDeleteMetricUnit = (unit) => {
    if (!user || !unit) return false;

    // Use the same logic as modify, but could be extended for different rules
    return canModifyMetricUnit(unit);
  };

  // Check if user can edit a specific metric unit
  const canEditMetricUnit = (unit) => {
    if (!user || !unit) return false;

    // Use the same logic as modify, but could be extended for different rules
    return canModifyMetricUnit(unit);
  };

  // Get appropriate tooltip message for metric unit actions
  const getMetricUnitTooltip = (unit, action = "modify") => {
    if (!unit) return "";

    const canModify = canModifyMetricUnit(unit);
    
    if (canModify) {
      return action === "edit" ? "Edit unit" : "Delete unit";
    }

    // User cannot modify the unit - provide specific reason
    if (unit.is_default && !isAdmin()) {
      const actionText = action === "edit" ? "edit" : "delete";
      return `Cannot ${actionText} system units (Admin access required)`;
    }

    const actionText = action === "edit" ? "edit" : "delete";
    return `You can only ${actionText} units you created`;  };
  
  // Memoize permissions to prevent infinite re-renders
  const permissions = useMemo(() => ({
    // Metric Units
    metricUnits: {
      create: canCreateMetricUnits(),
      modify: canModifyMetricUnit,
      edit: canEditMetricUnit,
      delete: canDeleteMetricUnit,
      getTooltip: getMetricUnitTooltip,
    },
    
    // Teams management
    teams: {
      create: isAdmin() || isCoach(),
      view: true, // Everyone can view teams
      edit: (team) => {
        if (!team) return false;
        return isAdmin() || (isCoach() && team?.coach_id === user?.id);
      },
      delete: (team) => isAdmin(), // Only admins can delete teams
      manageRoster: (team) => {
        if (!team) return false;
        return isAdmin() || (isCoach() && team?.coach_id === user?.id);
      },
    },    // Games management
    games: {
      create: isAdmin() || isCoach(),
      view: true, // Everyone can view games
      edit: (game) => {
        if (!game) return false;
        // Admins can edit any game
        if (isAdmin()) return true;
          // Coaches can only edit practice games (normal type) for their teams
        if (isCoach()) {
          const isCoachTeam = game?.home_team?.coach_id === user?.id || 
                             game?.away_team?.coach_id === user?.id;
          const isPracticeGame = game?.type === "practice";
          return isCoachTeam && isPracticeGame;
        }
        
        return false;
      },
      delete: (game) => isAdmin(), // Only admins can delete games
      start: (game) => {
        if (!game) return false;
        // Admins can start any game
        if (isAdmin()) return true;
          // Coaches can only start practice games for their teams
        if (isCoach()) {
          const isCoachTeam = game?.home_team?.coach_id === user?.id || 
                             game?.away_team?.coach_id === user?.id;
          const isPracticeGame = game?.type === "practice";
          return isCoachTeam && isPracticeGame;
        }
        
        return false;
      },
      recordScores: (game) => {
        if (!game) return false;
        // Admins can record scores for any game
        if (isAdmin()) return true;
          // Coaches can only record scores for practice games involving their teams
        if (isCoach()) {
          const isCoachTeam = game?.home_team?.coach_id === user?.id || 
                             game?.away_team?.coach_id === user?.id;
          const isPracticeGame = game?.type === "practice";
          return isCoachTeam && isPracticeGame;
        }
        
        return false;
      },
      recordStats: (game) => {
        if (!game) return false;
        // Use same logic as recordScores
        return permissions.games.recordScores(game);
      },
      manage: (game) => {
        if (!game) return false;
        // General game management - combines edit, start, and scoring permissions
        return permissions.games.edit(game) || 
               permissions.games.start(game) || 
               permissions.games.recordScores(game);
      },
    },

    // Training sessions
    trainings: {
      create: isAdmin() || isCoach(),
      view: (training) => {
        if (!training) return true; // Can view list
        // Can view training if it's for their team or if admin
        return isAdmin() || (isCoach() && training?.team?.coach_id === user?.id);
      },
      edit: (training) => {
        if (!training) return false;
        return isAdmin() || (isCoach() && training?.team?.coach_id === user?.id);
      },
      delete: (training) => {
        if (!training) return false;
        return isAdmin() || (isCoach() && training?.team?.coach_id === user?.id);
      },
      recordMetrics: (training) => {
        if (!training) return false;
        return isAdmin() || (isCoach() && training?.team?.coach_id === user?.id);
      },
    },

    // System administration
    system: {
      manageUsers: isAdmin(),
      manageSettings: isAdmin(),
      viewAnalytics: isAdmin() || isCoach(),
      manageSports: isAdmin(),
      manageLeagues: isAdmin(),
      viewReports: isAdmin() || isCoach(),
    },

    // Chat functionality
    chat: {
      // Admin can access all team chats
      accessAllTeams: isAdmin(),
      
      // Get teams the user can chat in
      getAccessibleTeams: (teams = []) => {
        if (isAdmin()) return teams; // Admin sees all teams
        
        if (isCoach()) {
          // Coach sees teams they coach
          return teams.filter(team => team.coach_id === user?.id);
        }
        
        if (isPlayer()) {
          // Player sees only their team
          return teams.filter(team => team.id === user?.team_id);
        }
        
        return [];
      },
      
      // Check if user can access a specific team chat
      canAccessTeamChat: (teamId) => {
        if (isAdmin()) return true;
        
        if (isCoach()) {
          // This would need team data to check if coach coaches this team
          // For now, assuming the API will handle this validation
          return true;
        }
        
        if (isPlayer()) {
          return user?.team_id === teamId;
        }
        
        return false;
      },
      
      // Send messages permission
      canSendMessages: (teamId) => {
        return permissions.chat.canAccessTeamChat(teamId);
      },
    },

    // User management
    users: {
      create: isAdmin(),
      viewAll: isAdmin(),
      edit: (targetUser) => {
        if (!targetUser) return false;
        // Users can edit themselves, admins can edit anyone
        return isAdmin() || targetUser?.id === user?.id;
      },
      delete: (targetUser) => {
        if (!targetUser) return false;
        // Only admins can delete users, but not themselves
        return isAdmin() && targetUser?.id !== user?.id;      },
      changeRole: (targetUser) => {
        if (!targetUser) return false;
        // Only admins can change roles, but not their own
        return isAdmin() && targetUser?.id !== user?.id;
      },
    },
  }), [user?.id, user?.role, user?.team_id]); // Dependencies for memoization

  return {
    user,
    isAdmin,
    isCoach,
    isPlayer,
    hasRole,
    permissions,
    
    // Direct utility functions for backward compatibility
    canCreateMetricUnits,
    canModifyMetricUnit,
    canEditMetricUnit,
    canDeleteMetricUnit,
    getMetricUnitTooltip,
  };
};
