import React from "react";
import { useRolePermissions } from "../../../hooks/useRolePermissions";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Edit, Trash, Eye, Users, Trophy, Settings } from "lucide-react";

/**
 * Example component showing how to use the useRolePermissions hook
 * This demonstrates the hook's versatility across different features
 */
export const RolePermissionsExample = () => {
  const { 
    user, 
    isAdmin, 
    isCoach, 
    permissions 
  } = useRolePermissions();

  // Example team data
  const exampleTeam = {
    id: 1,
    name: "Example Team",
    coach_id: user?.id, // Assuming user owns this team
  };

  // Example game data
  const exampleGame = {
    id: 1,
    home_team: { coach_id: user?.id },
    away_team: { coach_id: 999 }, // Different coach
  };

  // Example training data
  const exampleTraining = {
    id: 1,
    team: { coach_id: user?.id },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Role Permissions Demo</h2>
        <div className="flex items-center gap-2">
          <span>Current User:</span>
          <Badge variant={isAdmin() ? "destructive" : isCoach() ? "default" : "secondary"}>
            {user?.role || "Guest"}
          </Badge>
        </div>
      </div>

      {/* Metric Units Permissions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Metric Units
        </h3>
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            disabled={!permissions.metricUnits.create}
            title={permissions.metricUnits.create ? "Create new metric unit" : "No permission to create metric units"}
          >
            Create Unit
          </Button>
        </div>
      </div>

      {/* Teams Permissions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Teams
        </h3>
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            variant="outline"
            disabled={!permissions.teams.create}
            title={permissions.teams.create ? "Create new team" : "No permission to create teams"}
          >
            Create Team
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            disabled={!permissions.teams.edit(exampleTeam)}
            title={permissions.teams.edit(exampleTeam) ? "Edit this team" : "No permission to edit this team"}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Example Team
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            disabled={!permissions.teams.delete(exampleTeam)}
            title={permissions.teams.delete(exampleTeam) ? "Delete this team" : "No permission to delete teams"}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete Example Team
          </Button>
        </div>
      </div>

      {/* Games Permissions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Games
        </h3>
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            variant="outline"
            disabled={!permissions.games.create}
            title={permissions.games.create ? "Create new game" : "No permission to create games"}
          >
            Create Game
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            disabled={!permissions.games.edit(exampleGame)}
            title={permissions.games.edit(exampleGame) ? "Edit this game" : "No permission to edit this game"}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Example Game
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            disabled={!permissions.games.recordStats(exampleGame)}
            title={permissions.games.recordStats(exampleGame) ? "Record stats for this game" : "No permission to record stats"}
          >
            Record Stats
          </Button>
        </div>
      </div>

      {/* System Permissions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Administration
        </h3>
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            variant="outline"
            disabled={!permissions.system.manageUsers}
            title={permissions.system.manageUsers ? "Manage users" : "No permission to manage users"}
          >
            Manage Users
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            disabled={!permissions.system.manageSettings}
            title={permissions.system.manageSettings ? "Manage settings" : "No permission to manage settings"}
          >
            Manage Settings
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            disabled={!permissions.system.viewAnalytics}
            title={permissions.system.viewAnalytics ? "View analytics" : "No permission to view analytics"}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Permission Summary */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Permission Summary</h3>
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Admin privileges:</strong> {isAdmin() ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <strong>Coach privileges:</strong> {isCoach() ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <strong>Can create metric units:</strong> {permissions.metricUnits.create ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <strong>Can manage users:</strong> {permissions.system.manageUsers ? "✅ Yes" : "❌ No"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
