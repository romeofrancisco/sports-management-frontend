import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Settings, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSportDetails } from "@/hooks/useSports";
import { useModal } from "@/hooks/useModal";
import SportModal from "@/components/modals/SportModal";

const SportDetailsHeader = () => {
  const { sport: sportId } = useParams();
  const [sportData, setSportData] = useState(null);
  const { data: sportDetails } = useSportDetails(sportId);
  const sportModal = useModal();

  useEffect(() => {
    if (sportDetails) {
      setSportData(sportDetails);
    }
  }, [sportDetails]);

  // Capitalize first letter of sport name for display
  const getSportName = () => {
    if (sportData?.name) {
      return sportData.name;
    }
    // Fallback to ID with capitalization if no name is available
    return sportId ? sportId[0].toUpperCase() + sportId.slice(1) : "Sport";
  };

  const handleOpenSettings = () => {
    sportModal.openModal();
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary h-12 w-12 md:h-14 md:w-14 rounded-md flex items-center justify-center text-white">
              <Activity />
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                Sport Configuration
              </div>
              <h1 className="font-bold text-2xl md:text-3xl">
                {getSportName()}
              </h1>
            </div>
          </div>

          <div>
            <Button 
              variant="outline" 
              className="gap-1.5"
              onClick={handleOpenSettings}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:block">Sport Settings</span>
            </Button>
          </div>
        </div>
      </div>

      <SportModal 
        isOpen={sportModal.isOpen} 
        onClose={sportModal.closeModal} 
        sport={sportData} 
      />
    </header>
  );
};

export default SportDetailsHeader;
