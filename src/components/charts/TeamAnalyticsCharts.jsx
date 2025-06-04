// Legacy file - redirects to new modular structure
// This file maintains backward compatibility while components are updated

export {
  TeamPerformanceTrendsChart,
  TeamStatsBreakdownChart,
  TrainingAnalyticsChart,
  TeamOverviewMetrics
} from './TeamAnalyticsCharts/index.js';

// Default export for backward compatibility
import TeamAnalyticsChartsDefault from './TeamAnalyticsCharts/index.js';
export default TeamAnalyticsChartsDefault;
