import React from "react";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const PlayerInfoAndSessions = ({ data, onBack, recentSessions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100/50 text-green-800 border-green-400";
      case "late":
        return "bg-yellow-100/50 text-yellow-800 border-yellow-400";
      case "absent":
        return "bg-red-100/50 text-red-800 border-red-400";
      case "excused":
        return "bg-blue-100/50 text-blue-800 border-blue-400";
      default:
        return "bg-gray-100/50 text-gray-800 border-gray-400";
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        {/* Player Info */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-lg">
              <AvatarImage
                src={data.player_profile}
                alt={data.player_name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground font-bold text-base">
                {data.player_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gradient">{data.player_name}</h3>
            <p className="text-sm text-muted-foreground">
              Recent Training Sessions
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Recent Sessions Section */}
        <div>
          <div className="space-y-3 max-h- min-h-72 overflow-y-auto flex flex-col items-center justify-center">
            {recentSessions && recentSessions.length > 0 ? (
              recentSessions.slice(0, 4).map((session, index) => (
                <div
                  key={session.session_id || index}
                  className="flex items-center w-full justify-between p-3 rounded-lg bg-primary/5 border-2 border-primary/20"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {session.session_title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(session.date), "MMM dd, yyyy")}
                      </span>
                      {session.team && (
                        <>
                          <span>•</span>
                          <span>{session.team}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`ml-2 text-xs font-medium capitalize ${getStatusColor(
                      session.status
                    )}`}
                  >
                    {session.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent sessions found</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerInfoAndSessions;
