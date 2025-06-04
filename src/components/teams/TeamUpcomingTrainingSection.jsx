import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Activity } from "lucide-react";
import { formatShortDate } from "@/utils/formatDate";

const TeamUpcomingTrainingSection = ({ trainings }) => {
  return (
    <Card className="bg-card shadow-lg border-2 border-secondary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-secondary shadow-lg">
            <Activity className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gradient">
              Upcoming Training
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Scheduled training sessions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {trainings?.length > 0 ? (
          <div className="space-y-4">
            {trainings.slice(0, 4).map((training, index) => (
              <div
                key={training.id || index}
                className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
              >
                {/* Enhanced priority indicator */}
                <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-b from-secondary to-secondary/80"></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-60"></div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground text-sm">
                        {training.title || training.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 text-secondary" />
                        <span>{formatShortDate(training.date)}</span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-secondary/15 text-secondary border-secondary/30 font-semibold"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {training.time || training.start_time || "TBD"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {training.location && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                        <MapPin className="h-3 w-3" />
                        <span>{training.location}</span>
                      </div>
                    )}

                    {training.type && (
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className="text-xs"
                        >
                          {training.type}
                        </Badge>
                      </div>
                    )}

                    {training.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {training.description}
                      </p>
                    )}

                    {training.max_participants && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>Max {training.max_participants} participants</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {trainings.length > 4 && (
              <div className="text-center pt-2">
                <button className="text-sm text-secondary hover:text-primary font-medium transition-colors">
                  View all {trainings.length} sessions →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No upcoming training sessions
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Training schedules will appear here when available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamUpcomingTrainingSection;
