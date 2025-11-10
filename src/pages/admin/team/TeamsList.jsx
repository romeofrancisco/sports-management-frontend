import React from "react";
import { Users } from "lucide-react";
import TeamsContainer from "./components/TeamsContainer";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

const TeamsList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="container mx-auto p-1 md:p-6 space-y-6">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title="Team Management"
          description="Create and manage teams for your sports leagues"
        />

        {/* Teams Container */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <TeamsContainer />
        </div>
      </div>

      {/* Team Modal */}
    </div>
  );
};

export default TeamsList;
