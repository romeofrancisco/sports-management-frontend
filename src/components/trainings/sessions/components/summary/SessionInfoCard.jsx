import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, Clock, MapPin, MessageSquare, FileText, Users } from "lucide-react";
import { formatTime } from "@/utils/formatters";
import { formatShortDate } from "@/utils/formatDate";

const SessionInfoCard = ({ sessionInfo }) => {
  return (
    <div className="animate-in fade-in-50 duration-500 delay-600">
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-primary/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60"></div>

        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-sm">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Session Details</CardTitle>
              <CardDescription>
                Training session information and logistics
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessionInfo.date && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/8 to-primary/4 border border-primary/20">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Date
                  </p>
                  <p className="font-semibold text-foreground text-sm">
                    {formatShortDate(sessionInfo.date)}
                  </p>
                </div>
              </div>
            )}

            {sessionInfo.start_time && sessionInfo.end_time && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/8 to-primary/4 border border-primary/20">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Time
                  </p>
                  <p className="font-semibold text-foreground text-sm">
                    {formatTime(sessionInfo.start_time)} -{" "}
                    {formatTime(sessionInfo.end_time)}
                  </p>
                </div>
              </div>
            )}

            {sessionInfo.team.name && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/8 to-primary/4 border border-primary/20">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Team
                  </p>
                  <p className="font-semibold text-foreground text-sm">
                    {sessionInfo.team.name}
                  </p>
                </div>
              </div>
            )}

            {sessionInfo.location && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/8 to-primary/4 border border-primary/20">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Location
                  </p>
                  <p className="font-semibold text-foreground text-sm">
                    {sessionInfo.location}
                  </p>
                </div>
              </div>
            )}

            {sessionInfo.notes && (
              <div className="flex items-start gap-3 p-3 col-span-2 rounded-lg bg-gradient-to-r from-secondary/8 to-secondary/4 border border-secondary/20">
                <MessageSquare className="h-4 w-4 text-secondary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    Session Notes
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {sessionInfo.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionInfoCard;
