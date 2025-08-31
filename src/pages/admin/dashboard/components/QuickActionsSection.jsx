import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  Trophy,
  Settings,
  FileText,
  UserPlus,
  Calendar,
  Zap,
} from "lucide-react";

/**
 * Quick actions component for admin dashboard
 */
const QuickActionsSection = ({ overview }) => {
  const navigate = useNavigate();
  const quickActions = [
    {
      title: "Add New Team",
      description: "Create a new team",
      icon: <Plus className="h-4 w-4" />,
      color: "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
      action: "teams/create",
    },
    {
      title: "Register Player",
      description: "Add new player",
      icon: <UserPlus className="h-4 w-4" />,
      color: "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
      action: "players/create",
    },
    {
      title: "Schedule Game",
      description: "Create new game",
      icon: <Calendar className="h-4 w-4" />,
      color: "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
      action: "games/create",
    },
    {
      title: "Schedule Training",
      description: "Create new training session",
      icon: <Calendar className="h-4 w-4" />,
      color: "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
      action: "trainings/create",
    },
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case "teams/create":
        navigate("/teams");
        break;
      case "players/create":
        navigate("/players");
        break;
      case "games/create":
        navigate("/games");
        break;

      case "trainings/create":
        navigate("/trainings/sessions");
        break;
      default:
        console.log(`Action ${action} not implemented yet`);
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Settings className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-muted-foreground line-clamp-1 text-sm">
                Common administrative actions for quick access
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={action.title}
              variant="outline"
              onClick={() => handleQuickAction(action.action)}
              className="group relative h-auto p-0 overflow-hidden rounded-xl border-2 border-primary/20 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] animate-in fade-in-50 duration-500 bg-gradient-to-br from-background to-primary/5 hover:from-primary/5 hover:to-primary/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center w-full p-4 gap-4">
                <div
                  className={`p-3 rounded-lg ${action.color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg flex-shrink-0`}
                >
                  {action.icon}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {action.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsSection;
