import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Settings, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSportDetails } from "@/hooks/useSports";
import { useModal } from "@/hooks/useModal";
import SportModal from "@/components/modals/SportModal";
import PageHeader from "@/components/common/PageHeader";

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

  const actionComponent = (
    <Button 
      variant="outline" 
      className="gap-1.5 w-full sm:w-auto"
      onClick={handleOpenSettings}
    >
      <Settings className="h-4 w-4" />
      <span className="hidden sm:block">Sport Settings</span>
    </Button>
  );
  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-6">
        <PageHeader 
          title={getSportName()}
          description="Configure sport settings, statistics, and management options"
          actionComponent={actionComponent}
        />
      </div>

      <SportModal 
        isOpen={sportModal.isOpen} 
        onClose={sportModal.closeModal} 
        sport={sportData} 
      />
    </div>
  );
};

export default SportDetailsHeader;
