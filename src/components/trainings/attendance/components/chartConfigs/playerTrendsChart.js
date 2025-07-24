import getStatusColor from "./getStatusColor";

export const createPlayerTrendsChart = (data) => {
  if (!data || data.length === 0) return null;

  const recentSessions = data.slice(-20);

  const statusCounts = {
    present: 0,
    late: 0,
    excused: 0,
    absent: 0,
  };

  recentSessions.forEach((item) => {
    if (statusCounts.hasOwnProperty(item.status)) {
      statusCounts[item.status]++;
    }
  });

  return {
    labels: ["Present", "Late", "Excused", "Absent"],
    datasets: [
      {
        label: "Number of Sessions",
        data: [
          statusCounts.present,
          statusCounts.late,
          statusCounts.excused,
          statusCounts.absent,
        ],
        backgroundColor: [
          getStatusColor("present"),
          getStatusColor("late"),
          getStatusColor("excused"),
          getStatusColor("absent"),
        ],
        borderColor: [
          getStatusColor("present"),
          getStatusColor("late"),
          getStatusColor("excused"),
          getStatusColor("absent"),
        ],
        borderWidth: 1,
      },
    ],
  };
};

export const playerTrendsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Recent Sessions Summary (Last 20)",
      font: {
        size: 16,
        family: "'Inter', sans-serif",
        weight: "600",
      },
      color: "#475569",
      padding: 20,
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
      callbacks: {
        label: function (context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage =
            total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
          return `${context.label}: ${context.parsed.y} sessions (${percentage}%)`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(148, 163, 184, 0.1)",
        lineWidth: 1,
      },
      ticks: {
        stepSize: 1,
        color: "#64748b",
        font: {
          size: 11,
          family: "'Inter', sans-serif",
          weight: "500",
        },
        callback: function (value) {
          return Number.isInteger(value) ? value : "";
        },
      },
      title: {
        display: true,
        text: "Number of Sessions",
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
        color: "#64748b",
        font: {
          size: 11,
          family: "'Inter', sans-serif",
          weight: "500",
        },
      },
      title: {
        display: true,
        text: "Attendance Status",
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
    bar: {
      borderRadius: 6,
      borderSkipped: false,
      borderWidth: 2,
      hoverBorderWidth: 3,
    },
  },
  animation: false,
  interaction: {
    intersect: false,
    mode: "index",
  },
};
