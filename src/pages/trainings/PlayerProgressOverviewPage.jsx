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
      color: "from-primary/10 to-primary/20",
      iconColor: "text-primary",
      features: [
        "Individual performance metrics",
        "Personal training history",
        "Skills development tracking",
        "Progress charts and analytics",
      ],
    },
    {
      id: "team",
      title: "Team Player Comparison",
      description: "Compare player improvements within selected teams",
      icon: Users,
      path: "/trainings/progress/teams",
      color: "from-secondary/10 to-secondary/20",
      iconColor: "text-secondary",
      features: [
        "Select teams to analyze",
        "Compare players within the team",
        "Side-by-side improvement tracking",
        "Team roster performance comparison",
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
          backButtonText="Back to Trainings"
          showBackButton={true}
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
                Comprehensive Player Analytics
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Track individual player development with detailed performance metrics and training history. 
                Compare players within teams to identify top performers, monitor improvement trends, and 
                make data-driven decisions for player development and team composition strategies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProgressOverviewPage;
