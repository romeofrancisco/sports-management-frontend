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

// Enhanced formatting function for structured content
const formatContent = (content, isModal = false) => {
  if (!content) return "";

  let formatted = content.trim();
  const spacing = isModal ? "10px" : "8px";

  // First, normalize the content by handling various bullet point formats
  // Handle cases where bullet points are inline: "• item1 • item2 • item3"
  if (formatted.includes('•')) {
    // Split by bullet points and filter out empty items
    const parts = formatted.split('•');
    
    if (parts.length > 2) { // More than one bullet point
      // First part might be empty or contain intro text
      const bulletItems = parts.slice(1).filter(item => item.trim().length > 0);
      
      if (bulletItems.length > 0) {
        const bulletHTML = bulletItems.map(item => {
          const cleanItem = item.trim().replace(/^[.\s]+/, '').replace(/[.\s]+$/, '');
          if (!cleanItem) return '';
          
          return `
            <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: ${spacing};">
              <div style="flex-shrink: 0; margin-top: 6px; color: #8B1538; font-weight: bold; font-size: 14px; line-height: 1;">•</div>
              <div style="flex: 1; color: hsl(var(--foreground)); line-height: 1.5; margin: 0; padding: 0;">${cleanItem}</div>
            </div>
          `;
        }).filter(item => item.trim().length > 0).join('');
        
        // Include any intro text before the bullets
        const introText = parts[0].trim();
        const introHTML = introText ? `<div style="margin-bottom: 12px; color: hsl(var(--foreground)); line-height: 1.5;">${introText}</div>` : '';
        
        return `<div style="margin: 0; padding: 0;">${introHTML}${bulletHTML}</div>`;
      }
    }
  }

  // Handle numbered lists by converting to bullet points
  formatted = formatted.replace(/(\d+)\.\s+([^\n\r•]*)/g, (match, number, text) => {
    const cleanText = text.trim();
    return cleanText ? `• ${cleanText}` : '';
  });

  // Handle newline-separated bullet points
  const lines = formatted.split(/[\n\r]+/);
  const processedLines = [];
  let inBulletList = false;
  let bulletItems = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line is a bullet point
    if (line.match(/^[-•]\s*(.+)/)) {
      if (!inBulletList) {
        inBulletList = true;
        bulletItems = [];
      }
      const bulletText = line.replace(/^[-•]\s*/, '').trim();
      if (bulletText) {
        bulletItems.push(bulletText);
      }
    } else {
      // If we were in a bullet list, close it
      if (inBulletList && bulletItems.length > 0) {
        const bulletHTML = bulletItems.map(item => `
          <div style="margin-bottom: ${spacing}; display: flex; align-items: flex-start; gap: 12px;">
            <div style="flex-shrink: 0; margin-top: 6px; color: #8B1538; font-weight: bold; font-size: 14px;">•</div>
            <div style="flex: 1; color: hsl(var(--foreground)); line-height: 1.5;">${item}</div>
          </div>
        `).join('');
        
        processedLines.push(`<div style="margin-bottom: 16px;">${bulletHTML}</div>`);
        inBulletList = false;
        bulletItems = [];
      }
      
      // Add non-bullet content
      if (line) {
        processedLines.push(`<div style="margin-bottom: 12px; color: hsl(var(--foreground)); line-height: 1.6;">${line}</div>`);
      }
    }
  }

  // Handle any remaining bullet list at the end
  if (inBulletList && bulletItems.length > 0) {
    const bulletHTML = bulletItems.map(item => `
      <div style="margin-bottom: ${spacing}; display: flex; align-items: flex-start; gap: 12px;">
        <div style="flex-shrink: 0; margin-top: 6px; color: #8B1538; font-weight: bold; font-size: 14px;">•</div>
        <div style="flex: 1; color: hsl(var(--foreground)); line-height: 1.5;">${item}</div>
      </div>
    `).join('');
    
    processedLines.push(`<div style="margin-bottom: 16px;">${bulletHTML}</div>`);
  }

  formatted = processedLines.join('');

  // Handle text formatting
  formatted = formatted
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong style="font-weight: 600; color: hsl(var(--foreground));">$1</strong>'
    )
    .replace(
      /\*(.*?)\*/g,
      '<em style="font-style: italic; color: hsl(var(--muted-foreground));">$1</em>'
    );

  // Ensure proper container wrapping if no formatting was applied
  if (!formatted.includes("<div")) {
    formatted = `<div style="color: hsl(var(--foreground)); line-height: 1.6;">${formatted}</div>`;
  }

  return formatted;
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
          Comprehensive system analysis with AI-generated insights and
          predictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {" "}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {Object.entries(insights.ai_insights.ai_analysis).map(
            ([key, value], index) => {              const isExpanded = expandedCards.has(key);
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
                    {" "}
                    <h4 className="font-semibold text-primary flex items-center gap-2 text-sm xl:text-base">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {key.replace(/_/g, " ")}
                    </h4>
                    {isVeryLong && (                      <Dialog>
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
                    )}                  </div>
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
              );            }
          )}
        </div>
        {insights.ai_insights.fallback_used && (
          <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
            <p className="text-sm text-secondary-foreground">
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
