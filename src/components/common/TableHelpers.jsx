import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrophyIcon, Medal } from "lucide-react";

/**
 * Creates a table header cell with tooltip
 * @param {string|JSX.Element} label - The label to display
 * @param {string} tooltipText - The tooltip text
 * @returns {JSX.Element} Header cell with tooltip
 */
export const HeaderWithTooltip = ({ label, tooltipText }) => (
  <TooltipProvider delayDuration={100}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{label}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/**
 * Get styling for rank position (medals for top 3)
 * @param {number} rank - The rank position
 * @returns {Object} Icon and text color for the rank
 */
export const getRankStyle = (rank) => {
  if (rank === 1) return { icon: <TrophyIcon className="text-amber-500" size={16} />, textColor: "text-amber-500" };
  if (rank === 2) return { icon: <Medal className="text-gray-400" size={16} />, textColor: "text-gray-400" };
  if (rank === 3) return { icon: <Medal className="text-amber-700" size={16} />, textColor: "text-amber-700" };
  return { icon: null, textColor: "text-muted-foreground" };
};