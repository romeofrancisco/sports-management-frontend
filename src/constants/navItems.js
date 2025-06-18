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
} from "lucide-react";

export const coachNavigation = () => {
  return [
    {
      title: "Dashboard",
      href: "/",
      icon: Gauge,
    },
    {
      title: "My Teams",
      href: "/teams",
      icon: Users,
    },
    {
      title: "Players",
      href: "/players",
      icon: User,
    },
    {
      title: "Game Schedules",
      href: "/games",
      icon: CalendarCog,
    },
    {
      title: "Trainings",
      href: "/trainings",
      icon: Dumbbell,
    },
  ];
};

export const adminNavigation = () => {
  return [
    {
      title: "Dashboard",
      href: "/",
      icon: Gauge,
    },
    {
      title: "Sports",
      href: "/sports",
      icon: Volleyball,
    },
    {
      title: "Teams",
      href: "/teams",
      icon: Users,
    },
    {
      title: "Players",
      href: "/players",
      icon: User,
    },
    {
      title: "Coaches",
      href: "/coaches",
      icon: ClipboardList,
    },
    {
      title: "Leagues",
      href: "/leagues",
      icon: Trophy,
    },
    {
      title: "Tournaments",
      href: "/tournaments",
      icon: Medal,
    },
    {
      title: "Game Schedules",
      href: "/games",
      icon: CalendarCog,
    },
    {
      title: "Trainings",
      href: "/trainings",
      icon: Dumbbell,
    },
  ];
};

export const playerNavigation = () => {
  return [
    {
      title: "Dashboard",
      href: "/",
      icon: Gauge,
    },
    {
      title: "My Teams",
      href: "/teams",
      icon: Users,
    },
    {
      title: "Game Schedules",
      href: "/games",
      icon: CalendarCog,
    },
    {
      title: "Training Progress",
      href: "/trainings/progress",
      icon: Dumbbell,
    },
  ];
};

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
      title: "Competitions",
      icon: Trophy,
      items: [
        {
          title: "Leagues",
          href: "/leagues",
          icon: Trophy,
          description: "Manage league structures and seasons",
        },
        {
          title: "Tournaments",
          href: "/tournaments",
          icon: Medal,
          description: "Organize tournament brackets and events",
        },
      ],
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
      ],
    },
  ];
};

export const playerGroupedNavigation = () => {
  return [
    {
      title: "Dashboard",
      href: "/",
      icon: Gauge,
    },
    {
      title: "My Teams",
      icon: Users,
      items: [
        {
          title: "My Teams",
          href: "/teams",
          icon: Users,
          description: "View your team details",
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
          description: "View upcoming games",
        },
        {
          title: "Training Progress",
          href: "/trainings/progress",
          icon: Dumbbell,
          description: "View your training progress and performance",
        },
      ],
    },
  ];
};
