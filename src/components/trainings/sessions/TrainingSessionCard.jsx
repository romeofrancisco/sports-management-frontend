import React from "react";
import {
  CalendarIcon,
  ClockIcon,
  Users,
  MapPin,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { formatTime } from "../../../utils/formatters";
import { formatShortDate } from "@/utils/formatDate";

/**
 * Component for displaying a training session card with table data and 3 actions
 *
 * @param {Object} props
 * @param {Object} props.session - The training session data (title, date, time, team, venue, status)
 * @param {Function} props.onEdit - Function to call when update button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 * @param {Function} props.onViewDetails - Function to call when view button is clicked
 */
const TrainingSessionCard = ({ session, onEdit, onDelete, onViewDetails }) => {
  // Format date for display
  const formattedDate = formatShortDate(session.date);
  // Get session status with comprehensive styling info like SessionCard
  const getSessionStatusInfo = () => {
    let status = session.status?.toLowerCase();

    // If no backend status, calculate from dates
    if (!status) {
      const now = new Date();
      const sessionStart = new Date(`${session.date}T${session.start_time}`);
      const sessionEnd = new Date(`${session.date}T${session.end_time}`);

      if (now < sessionStart) {
        status = "upcoming";
      } else if (now >= sessionStart && now <= sessionEnd) {
        status = "ongoing";
      } else {
        status = "completed";
      }
    }

    // Status-based styling similar to SessionCard
    if (
      status === "ongoing" ||
      status === "in_progress" ||
      status === "active"
    ) {
      return {
        gradient: "from-secondary/5 to-secondary/10",
        strip: "bg-secondary",
        borderColor: "border-secondary/30",
        textColor: "text-secondary",
        bgColor: "bg-secondary/10",
        badgeClass: "bg-secondary/10 text-secondary border-secondary/20",
        className: "bg-secondary/10 text-secondary border-secondary/20",
        statusText: "Ongoing",
        primaryColor: "secondary",
      };
    } else if (status === "completed") {
      return {
        gradient: "from-primary5 to-primary/10",
        strip: "bg-primary",
        borderColor: "border-primary/30",
        textColor: "text-primary",
        bgColor: "bg-primary/10",
        badgeClass: "bg-primary/10 text-primary border-primary/20",
        className: "bg-primary/10 text-primary border-primary/20",
        statusText: "Completed",
        primaryColor: "primary",
      };
    } else {
      // upcoming or default
      return {
        gradient: "from-orange-500/5 to-orange-500/10",
        strip: "bg-orange-500",
        borderColor: "border-orange-500/30",
        textColor: "text-orange-600",
        bgColor: "bg-orange-500/10",
        badgeClass: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        statusText: "Upcoming",
        primaryColor: "orange",
      };
    }
  };

  const statusInfo = getSessionStatusInfo();

  return (
    <Card className="group relative overflow-hidden bg-card border-2 border-primary/20 transition-all duration-300 h-full flex flex-col">
      {/* Simple status strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${statusInfo.strip}`}
      />

      {/* Header Section */}
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold text-foreground truncate flex-1 min-w-0">
                {session.title}
              </CardTitle>
              <Badge
                variant="outline"
                className={`${statusInfo.className} flex-shrink-0`}
              >
                {statusInfo.statusText}
              </Badge>
            </div>
            <CardDescription className="mb-2">
              {session.description || "No description provided"}
            </CardDescription>
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>
                  {formatTime(session.start_time)} -{" "}
                  {formatTime(session.end_time)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Content Section - Table Data Only */}
      <CardContent className="space-y-3 pt-0 flex-1">
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Team */}
            <div className="flex flex-1 items-center gap-1 p-2 rounded-lg border border-border">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary uppercase tracking-wide">
                  Team
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {session.team_name || "No team specified"}
                </p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex flex-1 items-center gap-1 p-2 rounded-lg border border-border">
              <div className="p-2 rounded-lg bg-secondary/10">
                <MapPin className="h-4 w-4 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-secondary uppercase tracking-wide">
                  Venue
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {session.location || "No venue specified"}
                </p>
              </div>
            </div>
          </div>
          {/* notes */}

          <div className="p-3 rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              notes
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {session.notes || "No additional notes"}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Footer Section - 3 Actions Only */}
      <CardFooter className="pt-4 border-t border-border">
        <div className="flex items-center justify-end w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(session)}
            className="h-8 px-3 text-sm"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(session)}
            className="h-8 px-3 text-sm"
          >
            <Edit className="h-4 w-4 mr-1" />
            Update
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete?.(session)}
            className="h-8 px-3 text-sm text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrainingSessionCard;
