import { SCORING_TYPE_VALUES } from "@/constants/sport";

export const sanitizeSportData = (rawData) => {
  const data = { ...rawData };

  if (data.scoring_type !== SCORING_TYPE_VALUES.SETS) {
    data.win_threshold = null;
    data.win_points_threshold = null;
    data.win_margin = null;
  }

  if (!data.has_period) {
    data.max_period = null;
  }

  if (data.has_tie) {
    data.has_overtime = false;
  }

  if (data.has_overtime) {
    data.has_tie = false;
  }

  return data;
};
