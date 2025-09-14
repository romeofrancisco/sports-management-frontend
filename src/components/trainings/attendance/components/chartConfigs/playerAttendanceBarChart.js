import getStatusColor from "./getStatusColor";

export const createPlayerAttendanceBarChart = (attendanceDistribution) => {
  if (!attendanceDistribution) return null;

  const labels = Object.keys(attendanceDistribution).map(status => 
    status.charAt(0).toUpperCase() + status.slice(1)
  );
  const data = Object.values(attendanceDistribution);
  const colors = Object.keys(attendanceDistribution).map(getStatusColor);

  return {
    labels: labels,
    datasets: [
      {
        label: "Number of Sessions",
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };
};

export const playerAttendanceBarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Attendance Summary",
      font: {
        size: 16,
        family: "'Inter', sans-serif",
        weight: "600",
      },
      color: "#1e293b",
      padding: {
        bottom: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#374151",
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: function (tooltipItems) {
          return tooltipItems[0].label;
        },
        label: function (context) {
          return `Sessions: ${context.parsed.y}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "500",
        },
        color: "#64748b",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#f1f5f9",
        lineWidth: 1,
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "500",
        },
        color: "#64748b",
        stepSize: 1,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};
