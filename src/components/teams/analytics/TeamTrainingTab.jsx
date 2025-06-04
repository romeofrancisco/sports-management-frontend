import React from 'react';
import { TrainingAnalyticsChart } from '@/components/charts/TeamAnalyticsCharts';
import { processTrainingData } from '@/utils/teamAnalyticsHelpers';

const TeamTrainingTab = ({ 
  trainingEffectiveness, 
  trainings, 
  attendanceTrends, 
  analytics 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <TrainingAnalyticsChart
          data={processTrainingData(trainingEffectiveness, trainings, attendanceTrends, analytics)}
          title="Training Session Analysis"
        />
      </div>
    </div>
  );
};

export default TeamTrainingTab;
