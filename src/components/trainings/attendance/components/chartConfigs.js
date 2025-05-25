// Chart configurations and utility functions for attendance analytics

export const getStatusColor = (status) => {
  const colors = {
    present: '#4caf50',
    absent: '#f44336',
    late: '#ff9800',
    excused: '#2196f3',
    pending: '#9e9e9e',
  };
  return colors[status] || '#9e9e9e';
};

export const createAttendanceDistributionChart = (data) => ({
  labels: Object.keys(data || {}),
  datasets: [
    {
      data: Object.values(data || {}),
      backgroundColor: Object.keys(data || {}).map(getStatusColor),
      borderWidth: 2,
      borderColor: '#fff',
    },
  ],
});

export const distributionChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {        padding: 20,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: '500'
        },
        color: '#64748b',
        generateLabels: function(chart) {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              return {                text: label,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                index: i
              };
            });
          }
          return [];
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#f1f5f9',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
      cornerRadius: 12,
      padding: 12,
      displayColors: true,
      titleFont: {
        size: 14,
        family: "'Inter', sans-serif",
        weight: '600'
      },
      bodyFont: {
        size: 13,
        family: "'Inter', sans-serif",
        weight: '500'
      },
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} sessions (${percentage}%)`;
        }
      }
    }
  },  elements: {
    arc: {
      borderWidth: 3,
      borderColor: '#ffffff',
      hoverBorderWidth: 4,
      hoverBorderColor: '#ffffff'
    }
  },
  animation: false,
  interaction: {
    intersect: false
  }
};

export const createTrendsChart = (data, format) => {
  if (!data || data.length === 0) return null;
  
  return {
    labels: data.map(item => format(item.date, 'MMM dd')),
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: data.map(item => item.attendance_rate),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
    ],
  };
};

export const trendsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {    legend: {
      position: 'top',
      labels: {
        padding: 20,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: '500'
        },
        color: '#64748b'
      }
    },
    title: {
      display: true,
      text: 'Attendance Trends Over Time',
      font: {
        size: 16,
        family: "'Inter', sans-serif",
        weight: '600'
      },
      color: '#475569',
      padding: 20
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#f1f5f9',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
      cornerRadius: 12,
      padding: 12,
      titleFont: {
        size: 14,
        family: "'Inter', sans-serif",
        weight: '600'
      },
      bodyFont: {
        size: 13,
        family: "'Inter', sans-serif",
        weight: '500'
      }
    }
  },  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      padding: 10,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        lineWidth: 1
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 11,
          family: "'Inter', sans-serif",
          weight: '500'
        },
        callback: function(value) {
          return value + '%';
        }
      },
      title: {
        display: true,
        text: 'Attendance Rate',
        color: '#475569',
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: '600'
        }
      }
    },
    x: {
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        lineWidth: 1
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 11,
          family: "'Inter', sans-serif",
          weight: '500'
        }
      },
      title: {
        display: true,
        text: 'Date',
        color: '#475569',
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: '600'
        }
      }
    }
  },  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2
    },
    point: {
      radius: 3,
      borderWidth: 2,
      backgroundColor: '#ffffff',
      hitRadius: 6
    }
  },
  animation: false,
  interaction: {
    intersect: false,
    mode: 'index'
  }
};

export const createPlayerTrendsChart = (data) => {
  if (!data || data.length === 0) return null;
  
  const recentSessions = data.slice(-20);
  
  // Group sessions by status
  const statusCounts = {
    present: 0,
    late: 0,
    excused: 0,
    absent: 0
  };
  
  recentSessions.forEach(item => {
    if (statusCounts.hasOwnProperty(item.status)) {
      statusCounts[item.status]++;
    }
  });
  
  return {
    labels: ['Present', 'Late', 'Excused', 'Absent'],
    datasets: [
      {
        label: 'Number of Sessions',
        data: [
          statusCounts.present,
          statusCounts.late,
          statusCounts.excused,
          statusCounts.absent
        ],
        backgroundColor: [
          getStatusColor('present'),
          getStatusColor('late'),
          getStatusColor('excused'),
          getStatusColor('absent')
        ],
        borderColor: [
          getStatusColor('present'),
          getStatusColor('late'),
          getStatusColor('excused'),
          getStatusColor('absent')
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
      text: 'Recent Sessions Summary (Last 20)',
      font: {
        size: 16,
        family: "'Inter', sans-serif",
        weight: '600'
      },
      color: '#475569',
      padding: 20
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#f1f5f9',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
      cornerRadius: 12,
      padding: 12,
      titleFont: {
        size: 14,
        family: "'Inter', sans-serif",
        weight: '600'
      },
      bodyFont: {
        size: 13,
        family: "'Inter', sans-serif",
        weight: '500'
      },
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
          return `${context.label}: ${context.parsed.y} sessions (${percentage}%)`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        lineWidth: 1
      },
      ticks: {
        stepSize: 1,
        color: '#64748b',
        font: {
          size: 11,
          family: "'Inter', sans-serif",
          weight: '500'
        },
        callback: function(value) {
          return Number.isInteger(value) ? value : '';
        }
      },
      title: {
        display: true,
        text: 'Number of Sessions',
        color: '#475569',
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: '600'
        }
      }
    },
    x: {
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        lineWidth: 1
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 11,
          family: "'Inter', sans-serif",
          weight: '500'
        }
      },
      title: {
        display: true,
        text: 'Attendance Status',
        color: '#475569',        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: '600'
        }
      }
    }
  },
  elements: {
    bar: {
      borderRadius: 6,
      borderSkipped: false,
      borderWidth: 2,
      hoverBorderWidth: 3
    }
  },
  animation: false,
  interaction: {
    intersect: false,
    mode: 'index'
  }
};

// Alternative timeline chart for showing chronological attendance pattern
export const createPlayerTimelineChart = (data) => {
  if (!data || data.length === 0) return null;
  
  const recentSessions = data.slice(-15); // Show last 15 sessions for better readability
  
  return {
    labels: recentSessions.map((item, index) => `S${index + 1}`),
    datasets: [
      {
        label: 'Attendance Timeline',
        data: recentSessions.map(item => {
          switch(item.status) {
            case 'present': return 1;
            case 'late': return 0.75;
            case 'excused': return 0.5;
            case 'absent': return 0;
            default: return 0;
          }
        }),
        backgroundColor: recentSessions.map(item => getStatusColor(item.status)),
        borderColor: recentSessions.map(item => getStatusColor(item.status)),
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
      text: 'Attendance Timeline (Last 15 Sessions)',
      font: {
        size: 16,
        family: "'Inter', sans-serif",
        weight: '600'
      },
      color: '#475569',
      padding: 20
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#f1f5f9',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
      cornerRadius: 12,
      padding: 12,
      titleFont: {
        size: 14,
        family: "'Inter', sans-serif",
        weight: '600'
      },
      bodyFont: {
        size: 13,
        family: "'Inter', sans-serif",
        weight: '500'
      },
      callbacks: {
        label: function(context) {
          const statuses = {
            0: 'Absent',
            0.5: 'Excused', 
            0.75: 'Late',
            1: 'Present'
          };
          return `Session ${context.label}: ${statuses[context.parsed.y] || 'Unknown'}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 1,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        lineWidth: 1
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 11,
          family: "'Inter', sans-serif",
          weight: '500'
        },
        callback: function(value) {
          const statuses = {
            0: 'Absent',
            0.5: 'Excused',
            0.75: 'Late', 
            1: 'Present'
          };
          return statuses[value] || '';
        },
        stepSize: 0.25
      },
      title: {
        display: true,
        text: 'Attendance Status',
        color: '#475569',
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: '600'
        }
      }
    },
    x: {
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        lineWidth: 1
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 11,
          family: "'Inter', sans-serif",
          weight: '500'
        }
      },
      title: {
        display: true,
        text: 'Recent Sessions',
        color: '#475569',
        font: {
          size: 12,
          family: "'Inter', sans-serif",          weight: '600'
        }
      }
    }
  },
  elements: {
    bar: {
      borderRadius: 6,
      borderSkipped: false,
      borderWidth: 2,
      hoverBorderWidth: 3
    }
  },
  animation: false,
  interaction: {
    intersect: false,
    mode: 'index'
  }
};
