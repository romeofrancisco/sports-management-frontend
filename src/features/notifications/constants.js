import {
  Bell,
  Calendar,
  Trophy,
  Dumbbell,
  Building2,
  Gamepad2,
} from "lucide-react";

export const NOTIFICATION_TYPE_CONFIG = {
  event: {
    icon: Calendar,
    label: "Event",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  games: {
    icon: Gamepad2,
    label: "Games",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  league_game: {
    icon: Trophy,
    label: "League Game",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  tournament_game: {
    icon: Trophy,
    label: "Tournament Game",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  practice_game: {
    icon: Gamepad2,
    label: "Practice Game",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  bulk_games: {
    icon: Gamepad2,
    label: "Games",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  training: {
    icon: Dumbbell,
    label: "Training",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  facility: {
    icon: Building2,
    label: "Facility",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  facility_status: {
    icon: Building2,
    label: "Facility Status",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
};

export const ACTION_TYPE_LABELS = {
  created: "New",
  updated: "Updated",
  status_change: "Status Changed",
};

export const DEFAULT_NOTIFICATION_CONFIG = {
  icon: Bell,
  label: "Notification",
  color: "text-gray-500",
  bgColor: "bg-gray-500/10",
};
