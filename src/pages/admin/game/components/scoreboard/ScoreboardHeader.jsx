import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router";

const ScoreboardHeader = ({ sport }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center p-2 sm:p-4 bg-background/80 backdrop-blur-sm z-20">
      <div className="flex gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10"
          onClick={() => navigate(-1)}
          title="Go Back"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10"
          onClick={() => navigate("/")}
          title="Home"
        >
          <Home className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground font-medium">
        {sport?.name} Scoreboard
      </div>
    </div>
  );
};

export default ScoreboardHeader;