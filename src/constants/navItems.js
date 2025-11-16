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
  Calendar,
  FolderClosed,
  GraduationCap,
} from "lucide-react";

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
          description: "Organize and manage tournaments",
        },
        {
          title: "Documents",
          href: "/documents",
          icon: FolderClosed,
          description: "Manage shared documents and resources",
        },
        {
          title: "Courses & Sections",
          href: "/course-sections",
          icon: GraduationCap,
          description: "Manage courses and sections for players",
        }
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
          description: "Schedule training sessions",
        },
        {
          title: "Calendar",
          href: "/calendar",
          icon: Calendar,
          description: "View and manage all scheduled events",
        },
        {
          title: "Facility Reservation",
          href: "/facility-reservation",
          icon: CalendarCog,
          description: "Manage facility bookings and reservations",
        }
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
      title: "Management",
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
        {
          title: "Documents",
          href: "/documents",
          icon: FolderClosed,
          description: "Access and manage shared documents",
        },
        {
          title: "Calendar",
          href: "/calendar",
          icon: Calendar,
          description: "View and manage all scheduled events",
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
        {
          title: "Tournaments",
          href: "/tournaments",
          icon: Medal,
          description: "View tournament details and schedules",
        },
      ],
    },
  ];
};

export const playerGroupedNavigation = (team_slug) => {
  return [
    {
      title: "Dashboard",
      href: "/",
      icon: Gauge,
    },
    {
      title: "My Team",
      href: team_slug ? `/teams/${team_slug}` : "/teams",
      icon: Users,
      description: "View your team details",
    },
    {
      title: "Documents",
      href: "/documents",
      icon: FolderClosed,
      description: "Access and manage shared documents",
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
        {
          title: "Tournaments",
          href: "/tournaments",
          icon: Medal,
          description: "View tournament details and schedules",
        },
        {
          title: "Calendar",
          href: "/calendar",
          icon: Calendar,
          description: "View all scheduled events",
        },
      ],
    },
  ];
};
