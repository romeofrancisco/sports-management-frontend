import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Users, User, Calendar, Clock } from "lucide-react";

/**
 * Overview cards component displaying key metrics with enhanced UI
 */
const OverviewCards = ({ overview }) => {  const cards = [
    {
      title: "My Teams",
      value: overview?.team_overview?.total_teams || 0,
      description: "Teams under management",
      icon: <Users className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary via-primary/90 to-primary/80",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
      textAccent: "text-primary",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Total Players",
      value: overview?.team_overview?.total_players || 0,
      description: "Players in your teams",
      icon: <User className="h-5 w-5 text-secondary-foreground" />,
      color: "from-secondary via-secondary/90 to-secondary/80",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      iconBg: "bg-secondary",
      textAccent: "text-secondary",
      change: "+8%",
      trend: "up"
    },
    {
      title: "Upcoming Games",
      value: overview?.upcoming_games?.length || 0,
      description: "Games scheduled",
      icon: <Calendar className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary/80 via-primary/70 to-primary/60",
      bgColor: "bg-primary/6",
      borderColor: "border-primary/25",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      textAccent: "text-primary/90",
      change: "+2",
      trend: "up"
    },
    {
      title: "Training Sessions",
      value: overview?.team_overview?.recent_training_sessions || 0,
      description: "Recent sessions",
      icon: <Clock className="h-5 w-5 text-secondary-foreground" />,
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      bgColor: "bg-secondary/6",
      borderColor: "border-secondary/25",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      textAccent: "text-secondary/90",
      change: "0%",
      trend: "stable"
    },
  ];  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-secondary" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-primary" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">      {cards.map((card, index) => (
        <Card 
          key={index} 
          className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] border-2 ${card.borderColor} ${card.bgColor} backdrop-blur-sm group`}
        >
          {/* Enhanced Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-8 group-hover:opacity-12 transition-opacity duration-300`}></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl opacity-40"></div>
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-3 rounded-xl ${card.iconBg} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 group-hover:rotate-3`}>
              {card.icon}
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-3">
              <div className={`text-3xl md:text-4xl font-bold ${card.textAccent} drop-shadow-sm`}>
                {card.value}
              </div>
              <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-sm rounded-full px-2 py-1">
                {getTrendIcon(card.trend)}
                <span className={`text-xs font-semibold ${
                  card.trend === "up" ? "text-secondary" : 
                  card.trend === "down" ? "text-primary" : "text-muted-foreground"
                }`}>
                  {card.change}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-medium tracking-wide">{card.description}</p>
            
            {/* Enhanced Progress indicator */}
            <div className="mt-4 h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${card.color} transition-all duration-1000 ease-out shadow-sm`}
                style={{ width: '75%' }}
              ></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewCards;
