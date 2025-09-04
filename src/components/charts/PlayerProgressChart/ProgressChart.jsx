import { formatShortDate } from "@/utils/formatDate";
import { formatMetricValue } from "@/utils/formatters";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useIsMobile } from "@/hooks/use-mobile";

// Vertical line plugin similar to GameFlowChart
const verticalLinePlugin = {
  id: "verticalLine",
  afterDraw(chart) {
    if (chart.hoverIndex !== undefined) {
      const ctx = chart.ctx;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      // Get the x position from the scale using the data index
      const xPosition = chart.scales.x.getPixelForValue(chart.hoverIndex);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xPosition, topY);
      ctx.lineTo(xPosition, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(139, 0, 0, 0.5)";
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();
    }
  },
};

/**
 * Progress Chart component
 * Renders a line chart visualization of player progress
 */
export const ProgressChart = ({ selectedMetricData }) => {
  const isMobile = useIsMobile();
  // Get data points - check if they come from backend analysis or direct data_points
  const dataPoints = useMemo(() => {
    // If we have performance_analysis from backend with trend data
    if (
      selectedMetricData.performance_analysis &&
      selectedMetricData.metric_id !== "overall"
    ) {
      // Reconstruct data points from the first and last records
      const analysis = selectedMetricData.performance_analysis;

      // For metrics with trend data, we can enhance the chart
      if (
        analysis.trend &&
        analysis.trend.points &&
        analysis.trend.points.length >= 2
      ) {
        // Create a dataset for the trend line
        const trendDataset = {
          label: "Trend",
          data: analysis.trend.points.map((point) => point.y),
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
          showTrend: true,
        };
      }
    }

    // Default to regular data points without trend
    return {
      dataPoints: selectedMetricData.data_points || [],
      showTrend: false,
    };
  }, [selectedMetricData]);
  // Setup chart datasets
  const chartData = {
    labels: dataPoints.dataPoints.map((point) => point.date || ""),
    datasets: [
      {
        label: selectedMetricData.metric_name || "Value",
        data: dataPoints.dataPoints.map((point) => point.value || 0),
        // Enhanced maroon color with better visibility
        borderColor: "#8B0000",
        // Darker background for better contrast
        backgroundColor: "rgba(139, 0, 0, 0.3)",
        borderWidth: 2,
        pointRadius: 0, // Hide points by default
        pointHoverRadius: 6, // Show points only on hover
        pointBackgroundColor: "#8B0000",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Add trend line if available
  if (dataPoints.showTrend && dataPoints.trendDataset) {
    // Also update trend dataset to hide points by default
    dataPoints.trendDataset.pointRadius = 0;
    dataPoints.trendDataset.pointHoverRadius = 4;
    chartData.datasets.push(dataPoints.trendDataset);
  }
  return (
    <div style={{ height: "350px" }}>
      <Line
        data={chartData}
        plugins={[verticalLinePlugin]}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: "index",
          },
          scales: {
            y: {
              beginAtZero: selectedMetricData.is_lower_better ? false : true,
              title: {
                display: isMobile ? false : true,
                text: `${selectedMetricData.metric_name} (${selectedMetricData.unit})`,
              },
            },
            x: {
              ticks: {
                display: false, // Hide x-axis labels only
              },
              grid: {
                display: true, // Keep grid lines visible
              },
            },
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: function (context) {
                  const formattedValue = formatMetricValue(
                    context.parsed.y,
                    selectedMetricData.unit
                  );
                  return `${context.dataset.label}: ${formattedValue} ${selectedMetricData.unit}`;
                },
                title: function (context) {
                  // Show date in tooltip instead of on axis
                  return `Date: ${formatShortDate(context[0].label)}`;
                },
              },
            },
          },
          onHover: (event, activeElements, chart) => {
            if (activeElements.length > 0) {
              const dataIndex = activeElements[0].index;
              // Only update if the hover position has actually changed
              if (chart.hoverIndex !== dataIndex) {
                chart.hoverIndex = dataIndex;
                chart.draw();
              }
            }
          },
          onHoverLeave: (event, activeElements, chart) => {
            if (chart.hoverIndex !== undefined) {
              chart.hoverIndex = undefined;
              chart.draw();
            }
          },
        }}
      />
    </div>
  );
};
