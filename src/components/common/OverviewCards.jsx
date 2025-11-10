import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

/**
 * Reusable OverviewCards component
 * Props:
 * - stats: Array of stat objects with shape:
 *   { title, value, icon, description, trend, color, iconBg, iconColor }
 */
const OverviewCards = ({ stats = [] }) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className={`group gap-0 relative overflow-hidden border-2 border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] animate-in fade-in-50 duration-500 bg-gradient-to-br backdrop-blur-sm`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-8 group-hover:opacity-12 transition-opacity duration-300`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
                  <CardTitle className="hidden md:block text-sm font-semibold text-foreground">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-3 rounded-xl ${stat.iconBg} transition-all duration-300 hover:shadow-xl hover:scale-110 group-hover:rotate-3`}
                  >
                    {Icon ? (
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div
                    className={`text-2xl md:text-3xl font-bold ${stat.iconColor} drop-shadow-sm tracking-tight`}
                  >
                    {typeof stat.value === "number" && stat.value.toLocaleString
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 font-medium tracking-wide">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;
