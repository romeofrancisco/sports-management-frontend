import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import SportStatsModal from "@/components/modals/SportStatsModal";
import DeleteStatModal from "@/components/modals/DeleteStatModal";

// Component imports
import EmptyStatsState from "./components/EmptyStatsState";
import CategorySection from "./components/CategorySection";

// Utility imports
import { getActiveFiltersCount } from "./utils/statsHelpers";
import { useStatCategories } from "@/hooks/useStats";
import { useParams } from "react-router";

const SportStatsCardView = ({ stats, filter }) => {
  const { sport } = useParams();
  const [selectedStat, setSelectedStat] = React.useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const { data: categories } = useStatCategories({sport});

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

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId], // Use categoryId instead of category object
    }));
  };

  // No stats - show empty state
  if (!stats || stats.length === 0) {
    return (
      <>
        <EmptyStatsState
          getActiveFiltersCount={() => getActiveFiltersCount(filter)}
          onCreateStat={handleCreateStat}
        />

        {/* Modals need to be rendered even in empty state */}
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
      </>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start justify-end md:items-center mb-4 gap-3">
        <Button
          onClick={handleCreateStat}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
        >
          <Plus />
          Create New Stat
        </Button>
      </div>

      <div className="space-y-8">
        {/* Regular Categories */}
        {console.log(categories)}
        {categories
          ?.filter(
            (category) =>
              (filter.category === "all" || category.id === filter.category) && category.stats_count > 0
          )
          ?.map((category) => {
            const categoryStats = stats.filter(
              (stat) => stat.category === category.id
            );
            const isExpanded = expandedCategories[category.id] !== false;

            return (
              <CategorySection
                key={category.id}
                category={category.name}
                categoryId={category.id}
                categoryStats={categoryStats}
                isExpanded={isExpanded}
                onToggle={() => toggleCategory(category.id)}
                onEditStat={handleEditStat}
                onDeleteStat={handleDeleteStat}
              />
            );
          })}

        {/* Other Category - for stats with null category */}
        {(() => {
          // Only show "Other" category if no specific category is filtered or if "other" is selected
          if (filter.category !== "all" && filter.category !== "other") {
            return null;
          }

          const otherStats = stats.filter(
            (stat) => stat.category === null || stat.category === undefined
          );

          if (otherStats.length === 0) {
            return null;
          }

          const isExpanded = expandedCategories["other"] !== false;

          return (
            <CategorySection
              key="other"
              category="Other"
              categoryId="other"
              categoryStats={otherStats}
              isExpanded={isExpanded}
              onToggle={() => toggleCategory("other")}
              onEditStat={handleEditStat}
              onDeleteStat={handleDeleteStat}
            />
          );
        })()}
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
