import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PlusCircle } from "lucide-react";

const PlayerQuickSelect = ({ 
  players, 
  selectedPlayerId, 
  handlePlayerSelect, 
  openModal, 
  teamSlug 
}) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            Quick Player Selection
          </CardTitle>
          <CardDescription>
            {players.length} players available
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal(teamSlug)}
          className="hidden sm:flex"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Record Metric
        </Button>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <p className="text-sm text-muted-foreground">
              No players available for this team
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {players.slice(0, 12).map((player) => (
                <Button
                  key={player.id}
                  variant={
                    selectedPlayerId === player.id
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className={`h-auto py-2 justify-start truncate player-select-btn ${
                    selectedPlayerId === player.id
                      ? "shadow-sm"
                      : ""
                  }`}
                  onClick={() => handlePlayerSelect(player.id)}
                >
                  <Users
                    className={`h-3.5 w-3.5 mr-1.5 shrink-0 ${
                      selectedPlayerId === player.id
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span className="truncate">{player.name}</span>
                </Button>
              ))}
            </div>
            {players.length > 12 && (
              <div className="mt-3 text-center">
                <Button variant="ghost" size="sm" className="text-xs">
                  Show all {players.length} players
                </Button>
              </div>
            )}

            <div className="mt-4 sm:hidden">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openModal(teamSlug)}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Record New
                Metric
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerQuickSelect;
