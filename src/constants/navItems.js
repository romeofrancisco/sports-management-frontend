import {
  Volleyball,
  ClipboardList,
  CalendarCog,
  Users,
  User,
  Trophy,
  Gauge,
  Medal,
} from "lucide-react";

export const adminMain = () => {
  return [
    {
      title: "Dashboard",
      url: "/",
      icon: Gauge,
    },
  ];
};

export const adminManagement = () => {
  return [
    {
      title: "Sports",
      url: "/sports",
      icon: Volleyball,
    },
    {
      title: "Teams",
      url: "/teams",
      icon: Users,
    },
    {
      title: "Players",
      url: "/players",
      icon: User,
    },
    {
      title: "Coaches",
      url: "/coaches",
      icon: ClipboardList,
    },
    {
      title: "Leagues",
      url: "/leagues",
      icon: Trophy,
    },
    {
      title: "Tournaments",
      url: "/tournaments",
      icon: Medal,
    },
    {
      title: "Game Schedules",
      url: "/games",
      icon: CalendarCog,
    },
  ];
};
