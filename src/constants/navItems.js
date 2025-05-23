import {
  Volleyball,
  ClipboardList,
  CalendarCog,
  Users,
  User,
  Trophy,
  Gauge,
  Medal,
  Dumbbell,
} from "lucide-react";

export const coachNavigation = () => {
  return [
    {
      title: "Dashboard",
      url: "/",
      icon: Gauge,
    },
    {
      title: "My Teams",
      url: "/teams",
      icon: Users,
    },
    {
      title: "Players",
      url: "/players",
      icon: User,
    },
    {
      title: "Game Schedules",
      url: "/games",
      icon: CalendarCog,
    },
    {
      title: "Trainings",
      url: "/trainings",
      icon: Dumbbell,
    },
  ];
};

export const adminNavigation = () => {
  return [
    {
      title: "Dashboard",
      url: "/",
      icon: Gauge,
    },
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
    {
      title: "Trainings",
      url: "/trainings",
      icon: Dumbbell,
    },
  ];
};
