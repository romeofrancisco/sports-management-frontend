import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Copy,
  Check,
} from "lucide-react";

// Utility function to safely render content
const safeRender = (content, fallback = "No data available") => {
  if (typeof content === "string") return content;
  if (typeof content === "number") return content.toString();
  if (content === null || content === undefined) return fallback;
  if (typeof content === "object") {
    // Try to extract meaningful content from object
    if (content.message) return content.message;
    if (content.description) return content.description;
    if (content.text) return content.text;
    return fallback;
  }
  return fallback;
};

// Simple and effective formatting function for AI content
const formatContent = (content, isModal = false) => {
  if (!content) return "";

  let formatted = content.trim();
  const spacing = isModal ? "10px" : "8px";

  // Handle bullet points that might be on same line or multiple lines
  // This handles the main issue: "• item1 • item2 • item3" or "• item1\n• item2\n• item3"
  if (formatted.includes('•')) {
    // First, replace any inline bullet points with newlines
    formatted = formatted.replace(/•\s*/g, '\n• ');
    
    // Split by newlines and filter out empty lines
    const lines = formatted.split(/\r?\n/).filter(line => line.trim());
    const bulletItems = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•')) {
        // Extract text after bullet point
        const item = trimmed.substring(1).trim();
        if (item) {
          bulletItems.push(item);
        }
      } else if (trimmed && !trimmed.startsWith('•')) {
        // Handle lines that don't start with bullet but contain content
        bulletItems.push(trimmed);
      }
    });
    
    if (bulletItems.length > 0) {
      const bulletHTML = bulletItems.map(item => `
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: ${spacing}; line-height: 1.5;">
          <span style="color: #8B1538; font-weight: bold; margin-top: 2px; flex-shrink: 0;">•</span>
          <span style="color: hsl(var(--foreground));">${item}</span>
        </div>
      `).join('');
      
      return `<div style="margin: 0; padding: 0;">${bulletHTML}</div>`;
    }
  }

  // Handle numbered lists and convert them to bullet points
  const numberedPattern = /(\d+)\.\s*([^\d]+?)(?=\s*\d+\.\s*|$)/g;
  const matches = [...formatted.matchAll(numberedPattern)];
  
  if (matches.length > 0) {
    const items = matches.map(match => match[2].trim()).filter(item => item);
    
    if (items.length > 0) {
      const bulletHTML = items.map(item => `
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: ${spacing}; line-height: 1.5;">
          <span style="color: #8B1538; font-weight: bold; margin-top: 2px; flex-shrink: 0;">•</span>
          <span style="color: hsl(var(--foreground));">${item}</span>
        </div>
      `).join('');
      
      return `<div style="margin: 0; padding: 0;">${bulletHTML}</div>`;
    }
  }

  // Handle regular text formatting
  formatted = formatted
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
    .replace(/\n/g, '<br>');

  return `<div style="color: hsl(var(--foreground)); line-height: 1.6;">${formatted}</div>`;
};

const AIAnalysisSection = ({ insights }) => {
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [copiedStates, setCopiedStates] = useState(new Set());
  const [truncatedCards, setTruncatedCards] = useState(new Set());
  const contentRefs = useRef({});

  useEffect(() => {
    // Check which content is actually truncated
    const checkTruncation = () => {
      const newTruncatedCards = new Set();
      Object.keys(contentRefs.current).forEach(key => {
        const element = contentRefs.current[key];
        if (element && !expandedCards.has(key)) {
          // Check if content is truncated by comparing scrollHeight with clientHeight
          if (element.scrollHeight > element.clientHeight) {
            newTruncatedCards.add(key);
          }
        }
      });
      setTruncatedCards(newTruncatedCards);
    };

    // Check truncation after content loads and on window resize
    const timeoutId = setTimeout(checkTruncation, 100);
    window.addEventListener('resize', checkTruncation);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [insights, expandedCards]);

  const toggleExpanded = (key) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCards(newExpanded);
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(new Set([...copiedStates, key]));
      setTimeout(() => {
        setCopiedStates((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!insights?.ai_insights?.ai_analysis) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Detailed AI Analysis
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/30"
          >
            Powered by Gemini AI
          </Badge>
        </CardTitle>
        <CardDescription>
          Comprehensive system analysis with AI-generated insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {Object.entries(insights.ai_insights.ai_analysis).map(
            ([key, value], index) => {
              const isExpanded = expandedCards.has(key);
              const content = safeRender(value, "AI analysis in progress...");
              const isVeryLong = content.length > 500; // Threshold for showing modal option
              const isTruncated = truncatedCards.has(key);

              return (
                <div
                  key={key}
                  className="p-3 xl:p-4 rounded-lg bg-white/70 border border-primary/20 animate-in fade-in-50 duration-500 hover:border-primary/30 transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-primary flex items-center gap-2 text-sm xl:text-base">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {key.replace(/_/g, " ")}
                    </h4>
                    {isVeryLong && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto text-primary hover:text-primary/80 hover:bg-primary/10"
                          >
                            <Maximize2 className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Brain className="h-5 w-5 text-primary" />
                              {key.replace(/_/g, " ")}
                            </DialogTitle>
                            <DialogDescription>
                              Detailed AI analysis and insights
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-4">
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-primary border-primary/30"
                              >
                                Full Analysis View
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(content, `${key}-modal`)
                                }
                                className="flex items-center gap-2"
                              >
                                {copiedStates.has(`${key}-modal`) ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    Copy Text
                                  </>
                                )}
                              </Button>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <div
                                className="leading-relaxed"
                                style={{ color: "hsl(var(--foreground))" }}
                                dangerouslySetInnerHTML={{
                                  __html: formatContent(content, true),
                                }}
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div
                    ref={el => contentRefs.current[key] = el}
                    className={`text-xs xl:text-sm leading-relaxed transition-all duration-300 ${
                      isExpanded ? "" : "line-clamp-3"
                    }`}
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatContent(content, false),
                      }}
                    />
                  </div>
                  {(isTruncated || isExpanded) && (
                    <div className="flex items-center justify-between mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(key)}
                        className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent font-medium"
                      >
                        {isExpanded ? (
                          <>
                            Show Less <ChevronUp className="h-3 w-3 ml-1" />
                          </>
                        ) : (
                          <>
                            Read More <ChevronDown className="h-3 w-3 ml-1" />
                          </>
                        )}
                      </Button>
                      <div className="flex items-center gap-2">
                        {isVeryLong && (
                          <span className="text-xs text-muted-foreground">
                            <Maximize2 className="h-3 w-3 inline mr-1" />
                            for full view
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(content, key)}
                          className="p-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/10"
                          title="Copy to clipboard"
                        >
                          {copiedStates.has(key) ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
        {insights.ai_insights.fallback_used && (
          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm text-primary-foreground">
              <span className="font-medium">Note:</span> AI analysis is
              temporarily using fallback mode. Full AI insights will resume
              automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisSection;
