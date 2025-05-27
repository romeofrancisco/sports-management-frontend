import { useSelector } from "react-redux";

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
    return `You can only ${actionText} units you created`;
  };
  // Check general permissions for different features
  const permissions = {
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
    },

    // Games management
    games: {
      create: isAdmin() || isCoach(),
      view: true, // Everyone can view games
      edit: (game) => {
        if (!game) return false;
        // Admins can edit any game, coaches can edit games for their teams
        return isAdmin() || (isCoach() && (
          game?.home_team?.coach_id === user?.id || 
          game?.away_team?.coach_id === user?.id
        ));
      },
      delete: (game) => isAdmin(), // Only admins can delete games
      recordStats: (game) => {
        if (!game) return false;
        return isAdmin() || (isCoach() && (
          game?.home_team?.coach_id === user?.id || 
          game?.away_team?.coach_id === user?.id
        ));
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
        return isAdmin() && targetUser?.id !== user?.id;
      },
      changeRole: (targetUser) => {
        if (!targetUser) return false;
        // Only admins can change roles, but not their own
        return isAdmin() && targetUser?.id !== user?.id;
      },
    },
  };

  return {
    user,
    isAdmin,
    isCoach,
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
