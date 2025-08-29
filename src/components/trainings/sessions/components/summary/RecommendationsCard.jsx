import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle, Target, Lightbulb, Brain, Settings, Loader2 } from "lucide-react";
import { useTrainingAIInsights } from "@/hooks/useTrainings";

const RecommendationsCard = ({ recommendations, sessionId }) => {
  // State for AI insights toggle
  const [showAiInsights, setShowAiInsights] = useState(false);
  
  // Fetch AI insights only when enabled
  const {
    data: aiInsightsData,
    isLoading: aiInsightsLoading,
    error: aiInsightsError,
    refetch: refetchAiInsights
  } = useTrainingAIInsights(sessionId, { enabled: showAiInsights });
  
  // Extract AI insights from the response
  const aiInsights = aiInsightsData?.ai_insights || null;
  const hasAiInsights = aiInsights && aiInsights.ai_analysis && !aiInsights.fallback_used;

  // Handle toggle change
  const handleToggleChange = (checked) => {
    setShowAiInsights(checked);
  };
  // Format recommendation text with bullet points (similar to AI insights)
  const formatRecommendationText = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    
    return lines.map((line, index) => {
      if (line.startsWith('•')) {
        return (
          <li key={index} className="flex items-start gap-2 text-sm mb-2">
            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span className="leading-relaxed">{line.substring(1).trim()}</span>
          </li>
        );
      } else {
        return (
          <p key={index} className="text-sm mb-3 leading-relaxed">
            {line}
          </p>
        );
      }
    });
  };

  // Get appropriate icon for recommendation category
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'training performance analysis':
        return <Target className="h-4 w-4" />;
      case 'player development insights':
        return <CheckCircle className="h-4 w-4" />;
      case 'team dynamics assessment':
        return <Settings className="h-4 w-4" />;
      case 'training optimization':
        return <Lightbulb className="h-4 w-4" />;
      case 'strategic recommendations':
        return <Brain className="h-4 w-4" />;
      case 'coach focus areas':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  // Render AI insights content
  const renderAiInsights = () => {
    // Show loading state
    if (aiInsightsLoading) {
      return (
        <Card className="group relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/5 transition-all duration-300 hover:shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-50"></div>
          
          <CardContent className="text-center relative">
            <div className="space-y-3">
              <p className="text-primary font-semibold text-lg">Generating AI Insights...</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                AI is analyzing training data to provide strategic insights and recommendations
              </p>
              
              <div className="flex justify-center mt-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Show error state
    if (aiInsightsError) {
      return (
        <Card className="group relative overflow-hidden border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-primary/5 transition-all duration-300 hover:shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-destructive/10 to-transparent rounded-full blur-2xl opacity-60"></div>
          
          <CardContent className="text-center relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-destructive/20 to-primary/20 flex items-center justify-center border-2 border-destructive/30 mb-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            
            <div className="space-y-4">
              <p className="text-destructive font-semibold text-lg">AI Insights Unavailable</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {aiInsightsError.message || "Unable to generate AI insights for this session"}
              </p>
              
              <button 
                onClick={() => refetchAiInsights()}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg text-sm font-medium"
              >
                <Brain className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Show no insights state
    if (!hasAiInsights) {
      return (
        <Card className="group relative overflow-hidden border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-primary/5 transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-40"></div>
          
          <CardContent className="text-center relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary/20 to-primary/20 flex items-center justify-center border-2 border-dashed border-primary/30 mb-6">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-3">
              <p className="text-primary font-medium text-lg">AI Insights Not Available</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {aiInsights?.fallback_used 
                  ? "AI service was temporarily unavailable during analysis" 
                  : "No AI analysis could be generated for this session"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    const { ai_analysis } = aiInsights;
    
    return (
      <div className="space-y-4">
        {Object.entries(ai_analysis).map(([category, analysis]) => (
          <Card key={category} className="border border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent>
              <h4 className="font-semibold mb-3 text-sm text-primary flex items-center gap-2">
                <Brain className="h-4 w-4" />
                {category}
              </h4>
              
              {/* Check if analysis has the new format with analysis and suggestions */}
              {typeof analysis === 'object' && analysis.analysis && analysis.suggestions ? (
                <div className="space-y-3">
                  {/* Analysis Section */}
                  <div className="space-y-2">
                    {formatRecommendationText(analysis.analysis)}
                  </div>
                  
                  {/* Suggestions Section */}
                  {analysis.suggestions && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Suggested Actions:
                      </p>
                      <div className="space-y-1">
                        {formatRecommendationText(analysis.suggestions)}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback for old format - simple text */
                <div className="space-y-2">
                  {formatRecommendationText(typeof analysis === 'string' ? analysis : JSON.stringify(analysis))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Render regular recommendations
  const renderRecommendations = () => {
    return (
      <div className="space-y-4">
        {Object.entries(recommendations).length > 0 ? (
          Object.entries(recommendations).map(([category, items]) => 
            items.length > 0 && (
          <Card key={category} className="border border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent>
                  <h4 className="font-semibold mb-3 text-sm text-primary flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category}
                  </h4>
                  <div className="space-y-3">
                    {items.map((recommendation, index) => (
                      <div key={index} className="space-y-2">
                        {/* Title and Priority Badge */}
                        {recommendation.title && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm text-foreground">
                              {recommendation.title}
                            </span>
                            {recommendation.priority && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                recommendation.priority === "critical" 
                                  ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
                                  : recommendation.priority === "high"
                                  ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800"
                                  : recommendation.priority === "medium"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800"
                                  : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800"
                              }`}>
                                {recommendation.priority === "critical" && <AlertTriangle className="w-3 h-3 mr-1" />}
                                {recommendation.priority === "high" && <AlertTriangle className="w-3 h-3 mr-1" />}
                                {recommendation.priority === "medium" && <Target className="w-3 h-3 mr-1" />}
                                {recommendation.priority === "low" && <Lightbulb className="w-3 h-3 mr-1" />}
                                {recommendation.priority}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Main Message */}
                        {recommendation.message && (
                          <div className="space-y-2">
                            {formatRecommendationText(recommendation.message)}
                          </div>
                        )}
                        
                        {/* Suggestions */}
                        {recommendation.suggestion && (
                          <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                              Suggested Actions:
                            </p>
                            <div className="space-y-1">
                              {formatRecommendationText(recommendation.suggestion)}
                            </div>
                          </div>
                        )}
                        
                        {/* Impact and Action Required */}
                        {(recommendation.impact || recommendation.action_required) && (
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/20">
                            {recommendation.impact && (
                              <p className="text-xs text-muted-foreground italic">
                                Impact: {recommendation.impact}
                              </p>
                            )}
                            {recommendation.action_required && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                Action Required
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )
        ) : (
          <Card className="group relative overflow-hidden border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-primary/5 transition-all duration-300 hover:shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-40"></div>
            
            <CardContent className="p-8 text-center relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary/20 to-primary/20 flex items-center justify-center border-2 border-dashed border-primary/30 mb-6">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-3">
                <p className="text-primary font-medium text-lg">No Recommendations Available</p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  No specific recommendations were generated for this training session.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in-50 duration-500 delay-800">
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-primary/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60 pointer-events-none"></div>
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-primary shadow-sm">
                {showAiInsights ? (
                  <Brain className="h-6 w-6 text-primary-foreground" />
                ) : (
                  <Lightbulb className="h-6 w-6 text-primary-foreground" />
                )}
              </div>
              <div>
                <CardTitle>
                  {showAiInsights ? "AI Insights" : "Recommendations"}
                </CardTitle>
                <CardDescription>
                  {showAiInsights 
                    ? "AI-powered analysis and strategic insights" 
                    : "System-generated improvement suggestions"
                  }
                </CardDescription>
              </div>
            </div>
            
            {/* Switch between AI insights and recommendations */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="insights-mode" className="text-xs">
                {showAiInsights ? "AI" : "Standard"}
              </Label>
              
              <div 
                className="cursor-pointer"
                onClick={() => handleToggleChange(!showAiInsights)}
              >
                <Switch
                  id="insights-mode"
                  checked={showAiInsights}
                  onCheckedChange={handleToggleChange}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 relative">
          <ScrollArea className="pr-2">
            {showAiInsights ? renderAiInsights() : renderRecommendations()}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsCard;
