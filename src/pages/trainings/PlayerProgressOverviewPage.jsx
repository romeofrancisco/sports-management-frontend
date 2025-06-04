import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, TrendingUp, BarChart3 } from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

const PlayerProgressOverviewPage = () => {
  const navigate = useNavigate();

  const progressOptions = [
    {
      id: "individual",
      title: "Individual Player Progress",
      description: "View detailed progress for individual players",
      icon: User,
      path: "/trainings/progress/individual",
      color: "from-blue-500/10 to-blue-600/10",
      iconColor: "text-blue-600",
      features: [
        "Individual performance metrics",
        "Personal training history",
        "Skills development tracking",
        "Progress charts and analytics",
      ],
    },
    {
      id: "team",
      title: "Team Comparison",
      description: "Compare performance across teams",
      icon: Users,
      path: "/trainings/progress/teams",
      color: "from-green-500/10 to-green-600/10",
      iconColor: "text-green-600",
      features: [
        "Team performance comparison",
        "Cross-team analytics",
        "Collective progress tracking",
        "Team ranking insights",
      ],
    },
  ];
  const handleOptionSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Player Progress"
          subtitle="Training Management"
          description="Track and monitor player improvements and performance"
          showUniversityColors={true}
          backButtonPath="/trainings"
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {progressOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card
                  key={option.id}
                  className={`relative overflow-hidden border-primary/20 bg-gradient-to-br ${option.color} backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                  onClick={() => handleOptionSelect(option.path)}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-3 rounded-xl bg-background/50 ${option.iconColor}`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <TrendingUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {option.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {option.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {option.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <BarChart3 className="h-3 w-3 mr-2 text-primary/60" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full group-hover:shadow-md transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionSelect(option.path);
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {/* Additional information section */}
          <div className="mt-12 text-center space-y-4">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-2">
                Progress Tracking Features
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Monitor player development through comprehensive analytics,
                customizable date ranges, and detailed performance metrics.
                Track individual achievements or compare team performance to
                identify strengths and areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProgressOverviewPage;
