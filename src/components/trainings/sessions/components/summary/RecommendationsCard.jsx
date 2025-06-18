import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, Target, Lightbulb } from "lucide-react";

const RecommendationsCard = ({ recommendations }) => {
  return (
    <div className="animate-in fade-in-50 duration-500 delay-800">
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-secondary/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60"></div>
        
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-secondary shadow-sm">
              <Lightbulb className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>
                AI-powered insights and actionable improvement suggestions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 relative">
          <ScrollArea className="h-80 pr-2">
            <div className="space-y-3">
              {Object.entries(recommendations).length > 0 ? (
                Object.entries(recommendations).map(
                  ([category, items]) =>
                    items.length > 0 && (
                      <div key={category}>
                        <h4 className="font-semibold mb-2 capitalize text-sm text-foreground">
                          {category.replace("_", " ")}
                        </h4>
                        <div className="space-y-2">
                          {items.map((recommendation, index) => (                            <Card
                              key={index}
                              className="border border-border/50 bg-gradient-to-r from-muted/20 to-muted/10"
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5">
                                    {recommendation.priority === "high" && (
                                      <AlertTriangle className="h-3 w-3 text-red-600" />
                                    )}
                                    {recommendation.priority === "positive" && (
                                      <CheckCircle className="h-3 w-3 text-green-600" />
                                    )}
                                    {recommendation.priority === "medium" && (
                                      <Target className="h-3 w-3 text-yellow-600" />
                                    )}
                                    {recommendation.priority === "low" && (
                                      <Lightbulb className="h-3 w-3 text-blue-600" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-xs mb-1 leading-relaxed">
                                      {recommendation.message}
                                    </p>
                                    {recommendation.suggestion && (
                                      <p className="text-xs opacity-90 text-muted-foreground leading-relaxed">
                                        {recommendation.suggestion}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                )
              ) : (
                <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                  <CardContent className="p-6 text-center">
                    <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No recommendations available for this session.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsCard;
