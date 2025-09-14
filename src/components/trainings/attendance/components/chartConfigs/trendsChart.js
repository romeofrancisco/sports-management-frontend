// Vertical dashed line plugin for hover
export const verticalLinePlugin = {
  id: "verticalLine",
  afterDraw(chart) {
    if (chart.hoverIndex !== undefined) {
      const ctx = chart.ctx;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;
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
export const createTrendsChart = (data, format) => {
  if (!data || data.length === 0) return null;

  // Check data format to determine how to process it
  const isMonthlyData = data[0]?.month && data[0]?.session_count !== undefined;
  const isWeeklyData = data[0]?.date && data[0]?.session_count !== undefined;
  const isDailyData = data[0]?.date && data[0]?.attendance_rate !== undefined;
  
  if (isMonthlyData) {
    // New monthly format with dual Y-axis
    return {
      labels: data.map((item) => item.month_name || item.month),
      datasets: [
        {
          label: "Training Sessions",
          data: data.map((item) => item.session_count),
          backgroundColor: "rgba(139, 0, 0, 0.5)",
          borderColor: "#8B0000",
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y', // Left Y-axis
          type: 'bar',
        },
        {
          label: "Attendance Rate (%)",
          data: data.map((item) => item.average_attendance_rate || 0),
          backgroundColor: "rgba(245, 158, 11, 0.5)",
          borderColor: "#F59E0B",
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y1', // Right Y-axis
          type: 'bar',
        },
      ],
    };
  } else if (isWeeklyData) {
    // Weekly format with dual Y-axis
    return {
      labels: data.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10).map((item) => {
        const date = new Date(item.date);
        return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }),
      datasets: [
        {
          label: "Training Sessions",
          data: data.map((item) => item.session_count),
          backgroundColor: "rgba(139, 0, 0, 0.5)",
          borderColor: "#8B0000",
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y', // Left Y-axis
          type: 'bar',
        },
        {
          label: "Attendance Rate (%)",
          data: data.map((item) => item.attendance_rate || 0),
          backgroundColor: "rgba(245, 158, 11, 0.5)",
          borderColor: "#F59E0B",
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y1', // Right Y-axis
          type: 'bar',
        },
      ],
    };
  } else if (isDailyData) {
    // Legacy daily format (fallback)
    return {
      labels: data.map((item) => format ? format(item.date, "MMM dd") : item.date),
      datasets: [
        {
          label: "Attendance Rate (%)",
          data: data.map((item) => item.attendance_rate),
          backgroundColor: "rgba(139, 0, 0, 0.5)",
          borderColor: "#8B0000",
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }
  
  // Fallback if format is not recognized
  return null;
};

export const trendsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  elements: {
    bar: {
      borderRadius: 4,
      borderSkipped: false,
      borderWidth: 2,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        padding: 16,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "500",
        },
        color: "#64748b",
        pointStyle: 'rect',
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      titleColor: "#f1f5f9",
      bodyColor: "#cbd5e1",
      borderColor: "rgba(139, 0, 0, 0.3)",
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      titleFont: {
        size: 14,
        family: "'Inter', sans-serif",
        weight: "600",
      },
      bodyFont: {
        size: 12,
        family: "'Inter', sans-serif",
        weight: "400",
      },
      callbacks: {
        label: function (context) {
          const datasetLabel = context.dataset.label || '';
          const value = context.parsed.y;
          
          // Check if this is session count data or attendance rate data
          if (datasetLabel.includes('Training Sessions')) {
            return `${datasetLabel}: ${value} sessions`;
          } else if (datasetLabel.includes('Attendance Rate')) {
            return `${datasetLabel}: ${value}%`;
          }
          return `${datasetLabel}: ${value}`;
        },
      },
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      beginAtZero: true,
      padding: 10,
      grid: {
        color: "rgba(148, 163, 184, 0.1)",
        lineWidth: 1,
      },
      ticks: {
        color: "#64748b",
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
        callback: function (value) {
          return Math.floor(value);  // Whole numbers for session count
        },
      },
      title: {
        display: true,
        text: "Number of Sessions",
        color: "#8B0000",
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "600",
        },
      },
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      beginAtZero: true,
      max: 100, // Attendance rate is percentage (0-100)
      grid: {
        drawOnChartArea: false, // Don't draw grid lines for right axis
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
        callback: function (value) {
          return value + "%";  // % for attendance rate
        },
      },
      title: {
        display: true,
        text: "Attendance Rate (%)",
        color: "#F59E0B",
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "600",
        },
      },
    },
    x: {
      grid: {
        color: "rgba(148, 163, 184, 0.1)",
      },
      ticks: {
        display: true,
        color: "#64748b",
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
        maxRotation: 45,
        minRotation: 0,
      },
      title: {
        display: false,
        text: "Time Period",
        color: "#475569",
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "600",
        },
      },
    },
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutCubic',
  },
};
