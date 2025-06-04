import React from "react";
import GameModal from "@/components/modals/GameModal";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { Card, CardContent } from "@/components/ui/card";

const GameScheduleHeader = () => {
  const { openModal, closeModal, isOpen } = useModal();

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Game Schedule
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage game schedules for all leagues
            </p>
          </div>
          <Button 
            onClick={openModal} 
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl" 
            size="sm"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create Game
          </Button>
        </div>
      </CardContent>
      <GameModal isOpen={isOpen} onClose={closeModal} />
    </Card>
  );
};

export default GameScheduleHeader;
