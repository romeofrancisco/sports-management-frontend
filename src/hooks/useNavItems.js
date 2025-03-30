import { Volleyball, Users, CalendarCog, User } from "lucide-react";

export const useNavItems = () => {
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
      title: "Game Schedules",
      url: "/games",
      icon: CalendarCog,
    },
  ];
};
