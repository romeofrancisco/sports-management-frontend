// Chart configuration options for coach dashboard
import { getTeamInsights, getPlayerDevelopmentInsights } from '../utils/performanceHelpers.js';

// Base chart options shared across all charts
export const baseChartOptions = {
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
    },
  },
};

// Team overview chart options with dual Y-axis
export const createTeamOverviewChartOptions = (overview) => ({
  ...baseChartOptions,
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
  scales: {
    percentage: {
      type: 'linear',
      display: true,
      position: 'left',
      beginAtZero: true,
      max: 100,
      grid: {
        color: "rgba(148, 163, 184, 0.1)",
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
        callback: function(value) {
          return value + '%';
        }
      },
      title: {
        display: true,
        text: 'Attendance Rate (%)',
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "600",
        },
      },
    },
    count: {
      type: 'linear',
      display: true,
      position: 'right',
      beginAtZero: true,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
      title: {
        display: true,
        text: 'Total Sessions',
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
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
    },
  },
  plugins: {
    ...baseChartOptions.plugins,
    tooltip: {
      ...baseChartOptions.plugins.tooltip,
      callbacks: {
        afterBody: function(tooltipItems) {
          const teamIndex = tooltipItems[0].dataIndex;
          const team = overview?.team_attendance?.[teamIndex];
          if (team) {
            return getTeamInsights(team);
          }
          return [];
        }
      }
    },
  },
});

// Player development chart options with dual Y-axis
export const createPlayerDevelopmentChartOptions = (playerProgress) => ({
  ...baseChartOptions,
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
  scales: {
    percentage: {
      type: 'linear',
      display: true,
      position: 'right',
      beginAtZero: true,
      max: 100,
      grid: {
        color: "rgba(148, 163, 184, 0.1)",
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
        callback: function(value) {
          return value + '%';
        }
      },
      title: {
        display: true,
        text: 'Recent Improvement (%)',
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "600",
        },
      },
    },
    count: {
      type: 'linear',
      display: true,
      position: 'left',
      beginAtZero: true,
      grid: {
        drawOnChartArea: false, // Only want the grid lines for one axis to show up
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
      title: {
        display: true,
        text: 'Sessions / Metrics Count',
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
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
    },
  },
  plugins: {
    ...baseChartOptions.plugins,
    tooltip: {
      ...baseChartOptions.plugins.tooltip,
      callbacks: {
        afterBody: function(tooltipItems) {
          const playerIndex = tooltipItems[0].dataIndex;
          const player = playerProgress?.player_progress?.[playerIndex];
          if (player) {
            return getPlayerDevelopmentInsights(player);
          }
          return [];
        }
      }
    },
  },
});

// Line chart options for training progress
export const lineChartOptions = {
  ...baseChartOptions,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(148, 163, 184, 0.1)",
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
      title: {
        display: true,
        text: "Player Count",
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
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
      title: {
        display: true,
        text: "Training Sessions",
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "600",
        },
      },
    },
  },
};
