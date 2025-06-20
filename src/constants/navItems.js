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
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { useSelector } from "react-redux";

// Grouped navigation for better responsive design
export const adminGroupedNavigation = () => {
  return [
    {
      title: "Dashboard",
      href: "/",
      icon: Gauge,
    },
    {
      title: "Management",
      icon: Users,
      items: [
        {
          title: "Sports",
          href: "/sports",
          icon: Volleyball,
          description: "Manage sports categories and rules",
        },
        {
          title: "Teams",
          href: "/teams",
          icon: Users,
          description: "Manage team registrations and details",
        },
        {
          title: "Players",
          href: "/players",
          icon: User,
          description: "Manage player profiles and stats",
        },
        {
          title: "Coaches",
          href: "/coaches",
          icon: ClipboardList,
          description: "Manage coaching staff and assignments",
        },
      ],
    },
    {
      title: "Leagues",
      href: "/leagues",
      icon: Trophy,
      description: "Manage league structures and seasons",
    },
    {
      title: "Scheduling",
      icon: CalendarCog,
      items: [
        {
          title: "Game Schedules",
          href: "/games",
          icon: CalendarCog,
          description: "Schedule and manage game fixtures",
        },
        {
          title: "Trainings",
          href: "/trainings",
          icon: Dumbbell,
          description: "Schedule training sessions and camps",
        },
      ],
    },
  ];
};

export const coachGroupedNavigation = () => {
  return [
    {
      title: "Dashboard",
      href: "/",
      icon: Gauge,
    },
    {
      title: "Team Management",
      icon: Users,
      items: [
        {
          title: "My Teams",
          href: "/teams",
          icon: Users,
          description: "Manage your assigned teams",
        },
        {
          title: "Players",
          href: "/players",
          icon: User,
          description: "Manage team players and stats",
        },
      ],
    },
    {
      title: "Activities",
      icon: CalendarCog,
      items: [
        {
          title: "Game Schedules",
          href: "/games",
          icon: CalendarCog,
          description: "View and manage game schedules",
        },
        {
          title: "Trainings",
          href: "/trainings",
          icon: Dumbbell,
          description: "Schedule and conduct training sessions",
        },
        {
          title: "Leagues",
          href: "/leagues",
          icon: Trophy,
          description: "View league structures and seasons",
        },
      ],
    },
  ];
};

export const playerGroupedNavigation = () => {
  const { team_slug } = useSelector((state) => state.auth.user);

  return [
    {
      title: "Dashboard",
      href: "/",
      icon: Gauge,
    },
    {
      title: "My Team",
      href: `/teams/${team_slug}`,
      icon: Users,
      description: "View your team details",
    },
    {
      title: "Activities",
      icon: CalendarCog,
      items: [
        {
          title: "Game Schedules",
          href: "/games",
          icon: CalendarCog,
          description: "View upcoming games",
        },
        {
          title: "Training Progress",
          href: "/trainings/",
          icon: Dumbbell,
          description: "View your training progress and performance",
        },
        {
          title: "Leagues",
          href: "/leagues",
          icon: Trophy,
          description: "View league structures and seasons",
        },
      ],
    },
  ];
};
