import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";

/**
 * Progress Chart component
 * Renders a line chart visualization of player progress
 */
export const ProgressChart = ({ selectedMetricData }) => {
  // Get data points - check if they come from backend analysis or direct data_points
  const dataPoints = useMemo(() => {    // If we have performance_analysis from backend with trend data
    if (
      selectedMetricData.performance_analysis && 
      selectedMetricData.metric_id !== "overall"
    ) {
      // Reconstruct data points from the first and last records
      const analysis = selectedMetricData.performance_analysis;
      
      // For metrics with trend data, we can enhance the chart
      if (analysis.trend && analysis.trend.points && analysis.trend.points.length >= 2) {
        // Create a dataset for the trend line
        const trendDataset = {
          label: 'Trend',
          data: analysis.trend.points.map(point => point.y),
          borderColor: analysis.trend.is_positive ? "#8B0000" : "#DC143C", 
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0,
          pointRadius: 0,
          fill: false,
        };
        
        return {
          dataPoints: selectedMetricData.data_points || [],
          trendDataset: trendDataset,
          showTrend: true
        };
      }
    }
    
    // Default to regular data points without trend
    return {
      dataPoints: selectedMetricData.data_points || [],
      showTrend: false
    };
  }, [selectedMetricData]);
  
  // Setup chart datasets
  const chartData = {
    labels: dataPoints.dataPoints.map((point) => point.date || ""),
    datasets: [      {
        label: selectedMetricData.metric_name || "Value",
        data: dataPoints.dataPoints.map((point) => point.value || 0),
        // Enhanced maroon color with better visibility
        borderColor: "#8B0000",
        // Darker background for better contrast
        backgroundColor: "rgba(139, 0, 0, 0.3)",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 8,
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  // Add trend line if available
  if (dataPoints.showTrend && dataPoints.trendDataset) {
    chartData.datasets.push(dataPoints.trendDataset);
  }
  
  // Determine if we should add annotations based on performance analysis
  const hasAnalysis = selectedMetricData.performance_analysis && 
                     !selectedMetricData.performance_analysis.is_overall;
  
  // Create annotation for best performance if available                   
  const annotations = {};
  
  if (hasAnalysis) {
    const analysis = selectedMetricData.performance_analysis;
    
    // Find index of best performance for annotation
    const bestValueIndex = dataPoints.dataPoints.findIndex(
      point => point.value === analysis.best_record.value
    );
    
    if (bestValueIndex >= 0) {      annotations.bestPerformance = {
        type: 'point',
        xValue: bestValueIndex,
        yValue: analysis.best_record.value,
        // Enhanced gold color with better visibility
        backgroundColor: '#FFD700', 
        borderColor: '#B8860B', // DarkGoldenRod for better border contrast
        borderWidth: 3,
        radius: 8, // Slightly larger
        label: {
          display: true,
          content: 'Best',
          position: 'top',
          color: '#000000', // Black text for contrast
          backgroundColor: '#FFD700', // Solid gold background
          borderColor: '#B8860B',
          borderWidth: 1,
          borderRadius: 4,
          font: {
            weight: 'bold'
          }
        }
      };
    }
  }

  return (
    <div style={{ height: "350px" }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: selectedMetricData.is_lower_better ? false : true,
              title: {
                display: true,
                text: `${selectedMetricData.metric_name} (${selectedMetricData.unit})`,
              },
            },
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
          },
          plugins: {
            legend: { position: "top" },
            tooltip: {              callbacks: {
                label: function (context) {
                  const { formatMetricValue } = require('@/utils/formatters');
                  const formattedValue = formatMetricValue(context.parsed.y, selectedMetricData.unit);
                  return `${context.dataset.label}: ${formattedValue} ${selectedMetricData.unit}`;
                },
              },
            },
            annotation: {
              annotations: {
                ...annotations,
                startingLine: dataPoints.dataPoints.length > 1 ? {
                  type: "line",
                  yMin: dataPoints.dataPoints[0].value || 0,
                  yMax: dataPoints.dataPoints[0].value || 0,
                  xMin: 0,
                  xMax: dataPoints.dataPoints.length - 1,                  borderColor: "#B8860B", // DarkGoldenRod for better visibility
                  borderWidth: 2, // Thicker line
                  borderDash: [5, 5],
                  label: {
                    content: "Starting Point",
                    position: "end",
                    color: "#FFFFFF", // White text for contrast
                    font: {
                      weight: 'bold'
                    },
                    backgroundColor: "rgba(139,21,56,0.9)", // Perpetual University maroon with higher opacity
                    borderColor: "#8B0000", // Dark maroon border
                    borderWidth: 1,
                    borderRadius: 4,
                  },
                } : undefined,
              },
            },
          },
        }}
      />
    </div>
  );
};
