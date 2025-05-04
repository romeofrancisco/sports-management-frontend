import React from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, Plus, Trophy, CalendarIcon, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useModal } from "@/hooks/useModal";

const LeagueDetailsHeader = ({ name, sport }) => {

  return (
    <Card className="relative bg-muted/50 overflow-hidden rounded-lg p-6 my -4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="flex flex-col gap-2 relative">
        <Link
          to="/leagues"
          className="flex items-center text-muted-foreground text-sm w-fit hover:text-primary transition-colors"
        >
          <ChevronLeft size={18} />
          Back to Leagues
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mt-1">
              {sport && (
                <div className="flex items-center gap-1">
                  <Trophy size={16} />
                  <span>{sport.name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <CalendarIcon size={16} />
                <span>Current Season: May 5, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LeagueDetailsHeader;
