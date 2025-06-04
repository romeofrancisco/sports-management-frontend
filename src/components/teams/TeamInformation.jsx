import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDivisionLabel } from "@/constants/team";

const TeamInformation = ({ data }) => {
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-500 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

      <CardHeader className="relative">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Team Information
        </CardTitle>
        <CardDescription>
          Detailed information about the team
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {data.description && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Division</h4>
            <Badge variant="outline" className="w-full justify-center">{getDivisionLabel(data.division)}</Badge>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Sport</h4>
            <Badge variant="outline" className="w-full justify-center">{data.sport_name}</Badge>
          </div>
        </div>

        {data.founded_date && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Founded</h4>
            <p className="text-sm text-muted-foreground">{new Date(data.founded_date).toLocaleDateString()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamInformation;
