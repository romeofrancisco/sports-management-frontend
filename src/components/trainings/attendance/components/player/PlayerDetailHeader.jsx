import React from "react";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PlayerDetailHeader = ({ data, onBack }) => (
  <div className="flex flex-col gap-1">
    <button
      onClick={onBack}
      className="flex items-center w-fit px-3 py-1 gap-0.5 text-xs text-muted-foreground hover:text-primary transition-all duration-200 mb-0 group bg-transparent border-none p-0 rounded-md hover:bg-primary/10 active:scale-95 min-w-0"
      type="button"
      aria-label="Back"
    >
      <ArrowLeft className="h-3 w-3 group-hover:translate-x-[-2px] transition-transform duration-200" />
      <span className="font-medium whitespace-nowrap">Back to select player</span>
    </button>
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl">
      <div className="flex items-center gap-2 flex-1">
        <div className="relative">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary/20 shadow-lg">
            <AvatarImage
              src={data.player_profile}
              alt={data.player_name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground font-bold text-base">
              {data.player_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
            {data.player_name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            Individual Attendance Dashboard
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default PlayerDetailHeader;
