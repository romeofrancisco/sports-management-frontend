import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

const EffectivenessScoreCard = ({ effectivenessScore }) => {
  return (
    <div className="animate-in fade-in-50 duration-500 delay-700">
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-primary/20 backdrop-blur-sm relative overflow-hidden">        
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-sm">
              <Star className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Effectiveness</CardTitle>
              <CardDescription>
                Overall training session performance rating
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="text-center my-4">
            <div className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              {effectivenessScore.score}%
            </div>
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 text-sm px-2 py-1 border-2 font-semibold"
            >
              {effectivenessScore.level.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground font-medium">
                  Attendance
                </span>
                <span className="font-semibold text-foreground">
                  {effectivenessScore.components.attendance}%
                </span>
              </div>
              <Progress
                value={effectivenessScore.components.attendance}
                className="h-2 bg-muted/50"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground font-medium">
                  Metrics
                </span>
                <span className="font-semibold text-foreground">
                  {effectivenessScore.components.metrics_completion}%
                </span>
              </div>
              <Progress
                value={effectivenessScore.components.metrics_completion}
                className="h-2 bg-muted/50"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground font-medium">
                  Improvement
                </span>
                <span className="font-semibold text-foreground">
                  {effectivenessScore.components.player_improvement}%
                </span>
              </div>
              <Progress
                value={effectivenessScore.components.player_improvement}
                className="h-2 bg-muted/50"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground font-medium">
                  Engagement
                </span>
                <span className="font-semibold text-foreground">
                  {effectivenessScore.components.engagement}%
                </span>
              </div>
              <Progress
                value={effectivenessScore.components.engagement}
                className="h-2 bg-muted/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EffectivenessScoreCard;
