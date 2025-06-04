// Shared utilities for Team Analytics Charts
export const getChartTheme = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    textColor: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
    gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };
};

// Chart.js default options
export const getDefaultChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // We'll create custom legends
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        color: getChartTheme().gridColor,
      },
      ticks: {
        color: getChartTheme().textColor,
      },
    },
    y: {
      grid: {
        color: getChartTheme().gridColor,
      },
      ticks: {
        color: getChartTheme().textColor,
      },
    },
  },
});

// Date formatting utility for events
export const formatEventDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString(undefined, timeOptions)}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${date.toLocaleTimeString(undefined, timeOptions)}`;
  } else {
    return `${date.toLocaleDateString(undefined, options)} at ${date.toLocaleTimeString(undefined, timeOptions)}`;
  }
};
