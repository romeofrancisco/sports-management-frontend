// Utility functions for stats calculations and filtering
export const getActiveFiltersCount = (filter) => {
  if (!filter) return 0;

  let count = 0;
  if (filter.search) count++;
  if (filter.category && filter.category !== "all") count++;
  if (filter.type && filter.type !== "all") count++;
  return count;
};

export const getCategoriesCount = (stats) => {
  if (!stats) return {};
  const categories = {};

  stats.forEach((stat) => {
    const category = stat.category || "other";
    categories[category] = (categories[category] || 0) + 1;
  });

  return categories;
};

export const getStatsTypeCount = (stats) => {
  if (!stats) return { record: 0, formula: 0 };

  return stats.reduce(
    (counts, stat) => {
      if (stat.is_record) counts.record++;
      else counts.formula++;
      return counts;
    },
    { record: 0, formula: 0 }
  );
};
