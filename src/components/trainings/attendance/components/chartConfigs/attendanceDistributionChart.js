import getStatusColor from "./getStatusColor";

export const createAttendanceDistributionChart = (data) => ({
  labels: Object.keys(data || {}),
  datasets: [
    {
      data: Object.values(data || {}),
      backgroundColor: Object.keys(data || {}).map(status => {
        const color = getStatusColor(status);
        // Convert hex color to rgba with 0.7 transparency
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
      }),
      borderColor: Object.keys(data || {}).map(getStatusColor),
      borderWidth: 2,
    },
  ],
});

export const distributionChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        padding: 16,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "500",
        },
        color: "#64748b",
        generateLabels: function (chart) {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              const capitalizedLabel =
                label.charAt(0).toUpperCase() + label.slice(1);
              return {
                text: capitalizedLabel,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                index: i,
              };
            });
          }
          return [];
        },
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
      displayColors: true,
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
        title: function (context) {
          return (
            context[0].label.charAt(0).toUpperCase() + context[0].label.slice(1)
          );
        },
        label: function (context) {
          return ` Attendance Rate: ${context.parsed || 0}%`;
        },
      },
    },
  },
  animation: true,
  interaction: {
    intersect: false,
  },
};
