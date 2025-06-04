// Team Analytics Charts - Main Export File
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Export all chart components
export { TeamPerformanceTrendsChart } from './TeamPerformanceTrendsChart';
export { TeamStatsBreakdownChart } from './TeamStatsBreakdownChart';
export { TrainingAnalyticsChart } from './TrainingAnalyticsChart';
export { TeamOverviewMetrics } from './TeamOverviewMetrics';

// Export utilities and constants
export * from './constants';
export * from './utils';

// Import for default export
import { TeamPerformanceTrendsChart } from './TeamPerformanceTrendsChart';
import { TeamStatsBreakdownChart } from './TeamStatsBreakdownChart';
import { TrainingAnalyticsChart } from './TrainingAnalyticsChart';
import { TeamOverviewMetrics } from './TeamOverviewMetrics';

// Default export for convenience
export default {
  TeamPerformanceTrendsChart,
  TeamStatsBreakdownChart,
  TrainingAnalyticsChart,
  TeamOverviewMetrics,
};
