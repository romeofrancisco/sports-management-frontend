import { format, parseISO, startOfMonth } from "date-fns";

export const createPlayerMonthlyTrendChart = (trendsData) => {
  if (!trendsData || trendsData.length === 0) return null;

  // Group sessions by month and calculate attendance rates
  const monthlyData = {};

  trendsData.forEach((session) => {
    const monthKey = format(parseISO(session.date), "yyyy-MM");
    const monthLabel = format(parseISO(session.date), "MMM yyyy");

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        label: monthLabel,
        totalSessions: 0,
        attendedSessions: 0, // Changed from presentSessions to attendedSessions
        attendanceRate: 0,
      };
    }

    monthlyData[monthKey].totalSessions++;
    // Count both "present" and "late" as attended (since late still means they showed up)
    if (session.status === "present" || session.status === "late") {
      monthlyData[monthKey].attendedSessions++;
    }
  });

  // Calculate attendance rates and sort by month
  const sortedMonths = Object.keys(monthlyData)
    .sort()
    .map((monthKey) => {
      const data = monthlyData[monthKey];
      data.attendanceRate = (data.attendedSessions / data.totalSessions) * 100;
      return data;
    });

  return {
    labels: sortedMonths.map((month) => month.label),
    datasets: [
      {
        label: "Attendance Rate (%)",
        data: sortedMonths.map((month) => month.attendanceRate),
        borderColor: "#8B1538", // Primary color
        backgroundColor: "rgba(139, 21, 56, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#8B1538",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Sessions Attended",
        data: sortedMonths.map((month) => month.attendedSessions),
        borderColor: "#FFD700", // Secondary color
        backgroundColor: "rgba(255, 215, 0, 0.1)",
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#FFD700",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: "y1",
      },
    ],
  };
};

export const playerMonthlyTrendChartOptions = {
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
    title: {
      display: false,
      text: "Monthly Attendance Trends",
      font: {
        size: 16,
        family: "'Inter', sans-serif",
        weight: "600",
      },
      color: "#1e293b",
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#374151",
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: function (context) {
          if (context.datasetIndex === 0) {
            return `Attendance Rate: ${context.parsed.y.toFixed(1)}%`;
          } else {
            return `Sessions Attended: ${context.parsed.y}`;
          }
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
      type: "linear",
      display: true,
      position: "left",
      beginAtZero: true,
      max: 100,
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
        callback: function (value) {
          return value + "%";
        },
      },
      title: {
        display: true,
        text: "Attendance Rate (%)",
        color: "#64748b",
        font: {
          size: 12,
          weight: "500",
        },
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      beginAtZero: true,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "500",
        },
        color: "#64748b",
      },
      title: {
        display: true,
        text: "Sessions Attended",
        color: "#64748b",
        font: {
          size: 12,
          weight: "500",
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};
