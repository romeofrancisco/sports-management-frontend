import getStatusColor from "./getStatusColor";

export const createPlayerTimelineChart = (data) => {
  if (!data || data.length === 0) return null;

  const recentSessions = data.slice(-15);

  return {
    labels: recentSessions.map((item, index) => `S${index + 1}`),
    datasets: [
      {
        label: "Attendance Timeline",
        data: recentSessions.map((item) => {
          switch (item.status) {
            case "present":
              return 1;
            case "late":
              return 0.75;
            case "excused":
              return 0.5;
            case "absent":
              return 0;
            default:
              return 0;
          }
        }),
        backgroundColor: recentSessions.map((item) =>
          getStatusColor(item.status)
        ),
        borderColor: recentSessions.map((item) => getStatusColor(item.status)),
        borderWidth: 1,
      },
    ],
  };
};

export const playerTimelineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Attendance Timeline (Last 15 Sessions)",
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
          const statuses = {
            0: "Absent",
            0.5: "Excused",
            0.75: "Late",
            1: "Present",
          };
          return `Session ${context.label}: ${
            statuses[context.parsed.y] || "Unknown"
          }`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 1,
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
          const statuses = {
            0: "Absent",
            0.5: "Excused",
            0.75: "Late",
            1: "Present",
          };
          return statuses[value] || "";
        },
        stepSize: 0.25,
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
        text: "Recent Sessions",
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
