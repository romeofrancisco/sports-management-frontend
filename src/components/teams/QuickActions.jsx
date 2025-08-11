import React from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Target, Settings } from "lucide-react";

const QuickActions = ({ team }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-500 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

      <CardHeader className="relative">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Quick Actions
        </CardTitle>
        <CardDescription>
          Manage team activities and settings
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start h-12 bg-gradient-to-r from-transparent to-primary/5 hover:from-primary/10 hover:to-primary/15 border-primary/30 hover:border-primary/50 transition-all duration-300"
          onClick={() => navigate(`/teams/${team}/players`)}
        >
          <Users className="mr-3 h-5 w-5 text-primary" />
          <div className="text-left">
            <div className="font-medium">Manage Players</div>
            <div className="text-xs text-muted-foreground">Add, remove, or edit players</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start h-12 bg-gradient-to-r from-transparent to-secondary/5 hover:from-secondary/10 hover:to-secondary/15 border-secondary/30 hover:border-secondary/50 transition-all duration-300"
          onClick={() => navigate(`/teams/${team}/schedule`)}
        >
          <Calendar className="mr-3 h-5 w-5 text-secondary" />
          <div className="text-left">
            <div className="font-medium">View Schedule</div>
            <div className="text-xs text-muted-foreground">Games and events calendar</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start h-12 bg-gradient-to-r from-transparent to-primary/5 hover:from-primary/10 hover:to-primary/15 border-primary/30 hover:border-primary/50 transition-all duration-300"
          onClick={() => navigate(`/teams/${team}/training`)}
        >
          <Target className="mr-3 h-5 w-5 text-primary" />
          <div className="text-left">
            <div className="font-medium">Training Sessions</div>
            <div className="text-xs text-muted-foreground">Manage training activities</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
