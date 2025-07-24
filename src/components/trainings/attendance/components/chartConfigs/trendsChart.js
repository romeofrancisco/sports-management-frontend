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

  return {
    labels: data.map((item) => format(item.date, "MMM dd")),
    datasets: [
      {
        label: "Attendance Rate (%)",
        data: data.map((item) => item.attendance_rate),
        borderColor: "#8B0000",
        backgroundColor: "rgba(139, 0, 0, 0.1)",
        fill: true,
        pointRadius: 0, // Hide points by default
        pointHoverRadius: 6, // Show points only on hover
      },
    ],
  };
};

export const trendsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "500",
        },
        color: "#64748b",
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      titleColor: "#f1f5f9",
      bodyColor: "#cbd5e1",
      borderColor: "rgba(139, 0, 0, 0.3)",
      borderWidth: 1,
      cornerRadius: 12,
      padding: 12,
      titleFont: {
        size: 14,
        family: "'Inter', sans-serif",
        weight: "600",
      },
      bodyFont: {
        size: 13,
        family: "'Inter', sans-serif",
        weight: "500",
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
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
          weight: "500",
        },
        callback: function (value) {
          return value + "%";
        },
        callbacks: {
          title: function () {
            return [];
          },
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            const capitalizedLabel =
              label.charAt(0).toUpperCase() + label.slice(1);
            return `${capitalizedLabel}: ${percentage}%`;
          },
        },
      },
      title: {
        display: true,
        text: "Attendance Rate",
        color: "#475569",
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
        lineWidth: 1,
      },
      ticks: {
        display: false,
      },
      title: {
        display: false,
        text: "Date",
        color: "#475569",
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "600",
        },
      },
    },
  },
  elements: {
    line: {
      tension: 0.6,
      borderWidth: 2,
    },
    point: {
      radius: 0, // Hide points by default
      hoverRadius: 6, // Show points only on hover
      borderWidth: 2,
      backgroundColor: "#ffffff",
      hitRadius: 6,
    },
  },
  onHover: (event, activeElements, chart) => {
    if (activeElements.length > 0) {
      const dataIndex = activeElements[0].index;
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
  animation: false,
  interaction: {
    intersect: false,
    mode: "index",
  },
};
