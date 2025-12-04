import React from "react";
import {
  Users,
  Calendar,
  BarChart3,
  Trophy,
  ClipboardList,
  Building2,
} from "lucide-react";

const features = [
  {
    title: "Team Management",
    description:
      "Organize and manage multiple sports teams with ease. Track rosters, positions, and player details all in one place.",
    icon: Users,
  },
  {
    title: "Training Schedules",
    description:
      "Create, manage, and share training schedules. Keep everyone informed about practice times and locations.",
    icon: Calendar,
  },
  {
    title: "Performance Tracking",
    description:
      "Monitor athlete performance with detailed statistics and analytics to help players reach their full potential.",
    icon: BarChart3,
  },
  {
    title: "Tournament Brackets",
    description:
      "Generate and manage tournament brackets for various competition formats including round robin, single and double elimination.",
    icon: Trophy,
  },
  {
    title: "Game Scheduling",
    description:
      "Schedule games, track scores, and maintain comprehensive records of all matches and competitions.",
    icon: ClipboardList,
  },
  {
    title: "Facility Booking",
    description:
      "Reserve sports facilities and venues for training sessions, games, and special events.",
    icon: Building2,
  },    
];

const FeaturesSection = () => {
  return (
    <section className="py-16 lg:py-24" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Platform Features
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Manage Sports</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete sports management solution designed for coaches, players,
            and administrators to streamline operations and enhance athletic
            performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-20">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center">
              <feature.icon className="size-12 lg:size-16 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
