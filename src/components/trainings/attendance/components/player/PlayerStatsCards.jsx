import React from "react";
import OverviewCards from "@/components/trainings/attendance/components/OverviewCards";
import { CalendarDays, BarChart3, XCircle, Clock } from "lucide-react";

const PlayerStatsCards = ({ data }) => {
  const stats = [
    {
      title: "Total Sessions",
      value: `${data.total_sessions} / ${data.attendance_distribution.present || 0}`,
      description: "Sessions attended out of total",
      icon: <CalendarDays className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary via-primary/90 to-primary/80",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
      textAccent: "text-primary",
    },
    {
      title: "Attendance Rate",
      value: `${data.attendance_rate || 0}%`,
      description: "Overall attendance percentage",
      icon: <BarChart3 className="h-5 w-5 text-secondary-foreground" />,
      color: "from-secondary via-secondary/90 to-secondary/80",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      iconBg: "bg-secondary",
      textAccent: "text-secondary",
    },
    {
      title: "Absent",
      value: data.attendance_distribution.absent || 0,
      description: "Sessions missed",
      icon: <XCircle className="h-5 w-5 text-primary-foreground" />,
      color: "from-red-500 via-red-500/90 to-red-500/80",
      bgColor: "bg-red-500/8",
      borderColor: "border-red-500/30",
      iconBg: "bg-red-500",
      textAccent: "text-red-600",
    },
    {
      title: "Late Arrivals",
      value: data.attendance_distribution.late || 0,
      description: "Sessions arrived late",
      icon: <Clock className="h-5 w-5 text-primary-foreground" />,
      color: "from-orange-500 via-orange-500/90 to-orange-500/80",
      bgColor: "bg-orange-500/8",
      borderColor: "border-orange-500/30",
      iconBg: "bg-orange-500",
      textAccent: "text-orange-600",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, idx) => (
        <OverviewCards key={idx} {...stat} />
      ))}
    </div>
  );
};

export default PlayerStatsCards;
