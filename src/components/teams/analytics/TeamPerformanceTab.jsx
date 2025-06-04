import React from 'react';
import { TeamPerformanceTrendsChart } from '@/components/charts/TeamAnalyticsCharts';
import { processPerformanceData } from '@/utils/teamAnalyticsHelpers';

const TeamPerformanceTab = ({ performance, games }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <TeamPerformanceTrendsChart
          data={processPerformanceData(performance)}
          title="Detailed Performance Analysis"
        />
      </div>
    </div>
  );
};

export default TeamPerformanceTab;
