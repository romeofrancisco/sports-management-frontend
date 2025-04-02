import { Volleyball, Users, CalendarCog, User, Trophy, Gauge } from "lucide-react";

export const adminMain = () => {
  return [
    {
      title: "Dashboard",
      url: "/",
      icon: Gauge,
    },
  ]
}

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
      icon: User
    },
    {
      title: "Leagues",
      url: "/leagues",
      icon: Trophy
    },
    {
      title: "Game Schedules",
      url: "/games",
      icon: CalendarCog,
    },
  ];
};
