import { Target, TrendingUp, Activity, Shield, Hash } from "lucide-react";

// Function to get icon for category
export const getCategoryIcon = (category) => {
  switch (category) {
    case "Scoring":
      return <Target className="h-4 w-4 text-white" />;
    case "Performance":
      return <TrendingUp className="h-4 w-4 text-primary-foreground" />;
    case "Offensive":
      return <Activity className="h-4 w-4 text-secondary-foreground" />;
    case "Defensive":
      return <Shield className="h-4 w-4 text-white" />;
    default:
      return <Hash className="h-4 w-4 text-primary-foreground" />;
  }
};

// Function to get category color scheme
export const getCategoryColors = (category) => {
  switch (category) {
    case "Scoring":
      return {
        border: "border-red-500/30",
        bg: "bg-red-500/8",
        text: "text-red-600",
        badge:
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
        iconBg: "bg-red-500",
        gradient: "from-red-500 via-red-500/90 to-red-500/80",
      };
    case "Performance":
      return {
        border: "border-primary/30",
        bg: "bg-primary/8",
        text: "text-primary",
        badge:
          "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/40",
        iconBg: "bg-primary",
        gradient: "from-primary via-primary/90 to-primary/80",
      };
    case "Offensive":
      return {
        border: "border-secondary/30",
        bg: "bg-secondary/8",
        text: "text-secondary",
        badge:
          "bg-secondary/10 text-secondary border-secondary/20 dark:bg-secondary/20 dark:text-secondary-foreground dark:border-secondary/40",
        iconBg: "bg-secondary",
        gradient: "from-secondary via-secondary/90 to-secondary/80",
      };
    case "Defensive":
      return {
        border: "border-orange-500/30",
        bg: "bg-orange-500/8",
        text: "text-orange-600",
        badge:
          "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
        iconBg: "bg-orange-500",
        gradient: "from-orange-500 via-orange-500/90 to-orange-500/80",
      };
    default:
      return {
        border: "border-primary/30",
        bg: "bg-primary/8",
        text: "text-primary",
        badge:
          "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/40",
        iconBg: "bg-primary",
        gradient: "from-primary via-primary/90 to-primary/80",
      };
  }
};

// Function to categorize stats using the model's category field
export const categorizeStats = (stats) => {
  if (!stats) return {};

  // Create categories object
  const categories = {
    Scoring: [],
    Performance: [],
    Offensive: [],
    Defensive: [],
    Other: [],
  };

  stats.forEach((stat) => {
    // Use the category from the model
    const categoryMap = {
      scoring: "Scoring",
      performance: "Performance",
      offensive: "Offensive",
      defensive: "Defensive",
      other: "Other",
    };

    const category = categoryMap[stat.category] || "Other";
    if (categories[category]) {
      categories[category].push(stat);
    } else {
      categories["Other"].push(stat);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach((key) => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
};
