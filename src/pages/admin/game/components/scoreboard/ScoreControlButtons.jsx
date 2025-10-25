import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

const ScoreControlButtons = ({ 
  onScoreUpdate, 
  team, 
  isUpdatingScore, 
  currentScore 
}) => {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 mt-2 sm:mt-3 lg:mt-4">
      {/* Plus Buttons */}
      <div className="flex space-x-2 sm:space-x-4 lg:space-x-6">
        <Button
          variant="default"
          size="sm"
          onClick={() => onScoreUpdate(team, 1)}
          disabled={isUpdatingScore}
          className="bg-green-800 hover:bg-green-900 text-white p-2 sm:p-4 lg:p-6 border-2 flex items-center gap-1"
        >
          <Plus className="size-3 sm:size-5 lg:size-8" />
          <span className="text-sm sm:text-xl lg:text-3xl font-bold">1</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => onScoreUpdate(team, 2)}
          disabled={isUpdatingScore}
          className="bg-green-800 hover:bg-green-900 text-white p-2 sm:p-4 lg:p-6 border-2 flex items-center gap-1"
        >
          <Plus className="size-3 sm:size-5 lg:size-8" />
          <span className="text-sm sm:text-xl lg:text-3xl font-bold">2</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => onScoreUpdate(team, 3)}
          disabled={isUpdatingScore}
          className="bg-green-800 hover:bg-green-900 text-white p-2 sm:p-4 lg:p-6 border-2 flex items-center gap-1"
        >
          <Plus className="size-3 sm:size-5 lg:size-8" />
          <span className="text-sm sm:text-xl lg:text-3xl font-bold">3</span>
        </Button>
      </div>

      {/* Minus Buttons */}
      <div className="flex space-x-2 sm:space-x-4 lg:space-x-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onScoreUpdate(team, -3)}
          disabled={isUpdatingScore || currentScore === 0}
          className="bg-red-800 hover:bg-red-900 text-white p-2 sm:p-4 lg:p-6 border-2 flex items-center gap-1"
        >
          <Minus className="size-3 sm:size-5 lg:size-8" />
          <span className="text-sm sm:text-xl lg:text-3xl font-bold">3</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onScoreUpdate(team, -2)}
          disabled={isUpdatingScore || currentScore === 0}
          className="bg-red-800 hover:bg-red-900 text-white p-2 sm:p-4 lg:p-6 border-2 flex items-center gap-1"
        >
          <Minus className="size-3 sm:size-5 lg:size-8" />
          <span className="text-sm sm:text-xl lg:text-3xl font-bold">2</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onScoreUpdate(team, -1)}
          disabled={isUpdatingScore || currentScore === 0}
          className="bg-red-800 hover:bg-red-900 text-white p-2 sm:p-4 lg:p-6 border-2 flex items-center gap-1"
        >
          <Minus className="size-3 sm:size-5 lg:size-8" />
          <span className="text-sm sm:text-xl lg:text-3xl font-bold">1</span>
        </Button>
      </div>
    </div>
  );
};

export default ScoreControlButtons;