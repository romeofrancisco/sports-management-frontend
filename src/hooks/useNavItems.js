import { Volleyball, Users, CalendarCog } from "lucide-react";

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
      title: "Game Schedules",
      url: "/game-schedules",
      icon: CalendarCog
    }
  ];
};
