import React from "react";
import OverviewCards from "@/components/common/OverviewCards";
import { CalendarDays, BarChart3, XCircle, Clock } from "lucide-react";

const PlayerStatsCards = ({ data }) => {
  const stats = [
    {
      title: "Total Sessions",
      value: `${data.attendance_distribution.present + data.attendance_distribution.late || 0} / ${data.total_sessions}`,
      description: "Sessions attended out of total",
      icon: CalendarDays,
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary",
    },
    {
      title: "Attendance Rate",
      value: `${data.attendance_rate || 0}%`,
      description: "Overall attendance percentage",
      icon: BarChart3,
      color: "from-secondary via-secondary/90 to-secondary/80",
      iconBg: "bg-secondary",
      iconColor: "text-secondary",
    },
    {
      title: "Absent / Excused",
      value: data.attendance_distribution.absent + data.attendance_distribution.excused || 0,
      description: "Sessions missed",
      icon: XCircle,
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary",
    },
    {
      title: "Late Arrivals",
      value: data.attendance_distribution.late || 0,
      description: "Sessions arrived late",
      icon: Clock,
      color: "from-secondary via-secondary/90 to-secondary/80",
      iconBg: "bg-secondary",
      iconColor: "text-secondary",
    },
  ];
  return <OverviewCards stats={stats} />;

  
};

export default PlayerStatsCards;
