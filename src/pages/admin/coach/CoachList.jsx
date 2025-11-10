import React from "react";
import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import CoachModal from "@/components/modals/CoachModal";
import CoachContainer from "./components/CoachContainer";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

const CoachList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="container mx-auto p-1 md:p-6 space-y-6">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title="Coach Management"
          description="Register and manage coaches for your sports teams"
        />

        <CoachContainer />
      </div>
    </div>
  );
};

export default CoachList;
