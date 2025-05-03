export const createChartData = (
  periodEvents,
  homeScores,
  awayScores,
  homeTeam,
  awayTeam
) => ({
  labels: periodEvents.map((_, i) => i),
  datasets: [
    {
      label: homeTeam?.name || "Home",
      data: homeScores,
      borderColor: homeTeam?.color || "#1d4ed8",
      backgroundColor: homeTeam?.color || "#1d4ed8",
      pointRadius: 0,
      pointHoverRadius: 4,
    },
    {
      label: awayTeam?.name || "Away",
      data: awayScores,
      borderColor: awayTeam?.color || "#dc2626",
      backgroundColor: awayTeam?.color || "#dc2626",
      pointRadius: 0,
      pointHoverRadius: 4,
    },
  ],
});

export const createChartOptions = (gridColor, tickColor, labels) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  options: {
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true
      }
    },
  },
  plugins: {
    tooltip: { enabled: false },
    legend: { position: "top" },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: gridColor },
      ticks: { color: tickColor },
      position: "right",
    },
    x: {
      ticks: {
        callback: (_, i) => labels[i] || "",
        color: tickColor,
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        min: 0,
        max: 100  
      },

      grid: {
        color: gridColor,
        drawTicks: true,
        drawOnChartArea: true,
        color: (ctx) => (labels[ctx.tick.value] ? gridColor : "transparent"),
      },
    },
  },
});
