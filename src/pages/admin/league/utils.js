// Utility to get season year string from start and end date
export const getSeasonYear = (startDate, endDate) => {
  if (!startDate) return "";
  const startYear = new Date(startDate).getFullYear();
  if (!endDate) return startYear;
  const endYear = new Date(endDate).getFullYear();
  if (startYear === endYear) return startYear;
  return `${startYear} - ${endYear}`;
};