import { useState, useCallback } from 'react';
import { fetchPreviousRecordForMetric } from '@/api/trainingsApi';

/**
 * Hook to fetch real-time improvement data for specific metrics
 * as the user inputs values using the existing API infrastructure
 */
export const useRealTimeImprovement = () => {
  const [improvementData, setImprovementData] = useState({});
  const [loading, setLoading] = useState({});
  const fetchImprovement = useCallback(async (playerTrainingId, metricId, currentValue) => {
    if (!playerTrainingId || !metricId || currentValue === '' || isNaN(parseFloat(currentValue))) {
      // Clear improvement data if inputs are invalid
      setImprovementData(prev => ({
        ...prev,
        [`${playerTrainingId}-${metricId}`]: null
      }));
      return;
    }

    const key = `${playerTrainingId}-${metricId}`;
    setLoading(prev => ({ ...prev, [key]: true }));

    try {
      // Pass the current value to the backend for proper improvement calculation
      const previousRecord = await fetchPreviousRecordForMetric(playerTrainingId, metricId, currentValue);

      if (previousRecord) {
        // Use the backend-calculated improvement data
        const improvement = previousRecord.improvement;
        
        if (improvement && improvement.percentage !== null) {
          const improvementInfo = {
            previousValue: previousRecord.value,
            currentValue: parseFloat(currentValue),
            rawDifference: improvement.raw_value,
            percentage: Math.abs(improvement.percentage), // Use backend-calculated percentage with weight applied
            isImprovement: improvement.is_positive,
            isLowerBetter: previousRecord.is_lower_better,
            metricName: previousRecord.metric_name,
            previousSessionDate: previousRecord.session_date,
            normalizedPercentage: improvement.percentage // Keep the signed normalized percentage
          };

          setImprovementData(prev => ({
            ...prev,
            [key]: improvementInfo
          }));
        } else {
          // No improvement calculation available (e.g., previous value is 0)
          setImprovementData(prev => ({
            ...prev,
            [key]: {
              previousValue: previousRecord.value,
              currentValue: parseFloat(currentValue),
              rawDifference: null,
              percentage: null,
              isImprovement: null,
              isLowerBetter: previousRecord.is_lower_better,
              metricName: previousRecord.metric_name,
              previousSessionDate: previousRecord.session_date,
              normalizedPercentage: null
            }
          }));
        }
      } else {
        // No previous record found
        setImprovementData(prev => ({
          ...prev,
          [key]: null
        }));
      }
    } catch (error) {
      console.error('Failed to fetch improvement data:', error);
      setImprovementData(prev => ({
        ...prev,
        [key]: null
      }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const getImprovementData = useCallback((playerTrainingId, metricId) => {
    const key = `${playerTrainingId}-${metricId}`;
    return {
      data: improvementData[key],
      loading: loading[key] || false
    };
  }, [improvementData, loading]);

  const clearImprovementData = useCallback(() => {
    setImprovementData({});
    setLoading({});
  }, []);

  return {
    fetchImprovement,
    getImprovementData,
    clearImprovementData
  };
};
