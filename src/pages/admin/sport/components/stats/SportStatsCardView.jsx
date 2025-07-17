import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";
import SportStatsModal from "@/components/modals/SportStatsModal";
import DeleteStatModal from "@/components/modals/DeleteStatModal";

// Component imports
import CardViewHeader from "./components/CardViewHeader";
import EmptyStatsState from "./components/EmptyStatsState";
import CategorySection from "./components/CategorySection";

// Utility imports
import { categorizeStats } from "./utils/statsCategories.jsx";
import { getActiveFiltersCount } from "./utils/statsHelpers";

const SportStatsCardView = ({ stats, filter }) => {
  const [selectedStat, setSelectedStat] = React.useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const modals = {
    stat: useModal(),
    delete: useModal(),
  };

  const handleEditStat = (stat) => {
    setSelectedStat(stat);
    modals.stat.openModal();
  };

  const handleDeleteStat = (stat) => {
    setSelectedStat(stat);
    modals.delete.openModal();
  };

  const handleCreateStat = () => {
    setSelectedStat(null);
    modals.stat.openModal();
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const categorizedStats = categorizeStats(stats);

  // No stats - show empty state
  if (!stats || stats.length === 0) {
    return (
      <EmptyStatsState
        getActiveFiltersCount={() => getActiveFiltersCount(filter)}
        onCreateStat={handleCreateStat}
      />
    );
  }

  return (
    <div>
      <CardViewHeader
        stats={stats}
        getActiveFiltersCount={() => getActiveFiltersCount(filter)}
        onCreateStat={handleCreateStat}
      />
      
      <div className="space-y-8">
        {Object.entries(categorizedStats).map(([category, categoryStats]) => {
          const isExpanded = expandedCategories[category] !== false; // default to expanded

          return (
            <CategorySection
              key={category}
              category={category}
              categoryStats={categoryStats}
              isExpanded={isExpanded}
              onToggle={() => toggleCategory(category)}
              onEditStat={handleEditStat}
              onDeleteStat={handleDeleteStat}
            />
          );
        })}
      </div>

      <SportStatsModal
        isOpen={modals.stat.isOpen}
        onClose={modals.stat.closeModal}
        stat={selectedStat}
      />
      <DeleteStatModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        stat={selectedStat}
      />
    </div>
  );
};

export default SportStatsCardView;
