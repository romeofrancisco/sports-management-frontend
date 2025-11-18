import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import ChartCard from "./ChartCard";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Common chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    bar: {
      borderRadius: 4,
      borderSkipped: false,
      borderWidth: 2,
    },
  },
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

// Teams by Sport Distribution Chart
export const TeamsBySportChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard
        title="Teams by Sport"
        description="Distribution of teams across different sports"
        hasData={false}
        emptyMessage="No data available"
        height={256}
      />
    );
  }
  const chartData = {
    labels: data.map((item) => item.sport__name || "Unknown"),
    datasets: [
      {
        label: "Number of Teams",
        data: data.map((item) => item.team_count),
        backgroundColor: data.map(
          (_, index) => (index % 2 === 0 ? "#8B153890" : "#FFD70090") // Maroon and gold with transparency
        ),
        borderColor: data.map(
          (_, index) => (index % 2 === 0 ? "#8B1538" : "#FFD700") // Maroon and gold borders
        ),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} teams (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartCard
      title="Teams by Sport"
      description="Distribution of teams across different sports"
      hasData={true}
      height={256}
    >
      <Doughnut data={chartData} options={options} />
    </ChartCard>
  );
};

// System Activity Overview Chart
export const SystemActivityChart = ({ data }) => {
  if (!data) {
    return (
      <ChartCard
        title="System Activity"
        description="Recent system activity metrics"
        hasData={false}
        emptyMessage="No data available"
        height={256}
      />
    );
  }
  const chartData = {
    labels: [
      "Games This Month",
      "Completed Games",
      "Training Sessions",
      "Scheduled Games",
      "Upcoming Trainings",
    ],
    datasets: [
      {
        label: "Count",
        data: [
          data.games_this_month || 0,
          data.completed_games_month || 0,
          data.training_sessions_month || 0,
          data.games_scheduled || 0,
          data.upcoming_trainings || 0,
        ],
        backgroundColor: "#8B153890", // Maroon with transparency
        borderColor: "#8B1538", // Maroon border
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: "Recent System Activity (Last 30 Days)",
      },
    },
  };

  return (
    <ChartCard
      title="System Activity"
      description="Recent system activity metrics"
      hasData={true}
      height={256}
    >
      <Bar data={chartData} options={options} />
    </ChartCard>
  );
};

// User Activity Trends Chart
export const UserActivityChart = ({ data }) => {
  if (!data) {
    return (
      <ChartCard
        title="User Activity & Engagement"
        description="Comprehensive user activity metrics and growth trends"
        hasData={false}
        emptyMessage="No data available"
        height={256}
      />
    );
  }
  const chartData = {
    labels: [
      "Active Today",
      "Active This Week",
      "New This Month",
      "New This Week",
    ],
    datasets: [
      {
        label: "Users",
        data: [
          data.active_users_today || 0,
          data.active_users_week || 0,
          data.new_users_month || 0,
          data.new_users_week || 0,
        ],
        backgroundColor: "#8B153890", // Maroon with transparency
        borderColor: "#8B1538", // Maroon border
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: "User Activity & Growth",
      },
    },
  };

  return (
    <ChartCard
      title="User Activity & Engagement"
      description="Comprehensive user activity metrics and growth trends"
      hasData={true}
      height={256}
    >
      <Bar data={chartData} options={options} />
    </ChartCard>
  );
};

// Training Attendance Chart
export const TrainingAttendanceChart = ({ data }) => {
  if (!data || !data.overall_attendance_rate) {
    return (
      <ChartCard
        title="Training Attendance"
        description="Overall training attendance metrics"
        hasData={false}
        emptyMessage="No data available"
        height={256}
      />
    );
  }

  const attendanceRate = data.overall_attendance_rate;
  const absenteeRate = 100 - attendanceRate;
  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendanceRate, absenteeRate],
        backgroundColor: ["#8B153890", "#FFD70090"], // Maroon and gold with transparency
        borderColor: ["#8B1538", "#FFD700"], // Maroon and gold borders
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <ChartCard
      title="Training Attendance"
      description="Overall training attendance rate"
      hasData={true}
      height={256}
    >
      <Pie data={chartData} options={options} />
    </ChartCard>
  );
};

// Top Performing Teams Chart
export const TopTeamsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard
        title="Top Performing Teams"
        description="Teams with highest win rates"
        hasData={false}
        emptyMessage="No data available"
        height={256}
      />
    );
  }

  const topTeams = data.slice(0, 5); // Show top 5 teams
  const chartData = {
    labels: topTeams.map((team) => team.team_name),
    datasets: [
      {
        label: "Win Rate (%)",
        data: topTeams.map((team) => team.win_rate),
        backgroundColor: topTeams.map(
          (_, index) => (index % 2 === 0 ? "#8B153890" : "#FFD70090") // Maroon and gold with transparency
        ),
        borderColor: topTeams.map(
          (_, index) => (index % 2 === 0 ? "#8B1538" : "#FFD700") // Maroon and gold borders
        ),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    ...commonOptions,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: "Top Performing Teams by Win Rate",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const team = topTeams[context.dataIndex];
            return [
              `Win Rate: ${context.parsed.x}%`,
              `Games Played: ${team.games_played}`,
              `Wins: ${team.wins}`,
              `Losses: ${team.losses}`,
            ];
          },
        },
      },
    },
  };

  return (
    <ChartCard
      title="Top Performing Teams"
      description="Teams with highest win rates"
      hasData={true}
      height={256}
    >
      <Bar data={chartData} options={options} />
    </ChartCard>
  );
};

// Coach Effectiveness Chart
export const CoachEffectivenessChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard
        title="Coach Effectiveness"
        description="Coach performance based on attendance and training frequency"
        hasData={false}
        emptyMessage="No data available"
        height={256}
      />
    );
  }

  const topCoaches = data.slice(0, 6); // Show top 6 coaches
  const chartData = {
    labels: topCoaches.map((coach) => coach.coach_name),
    datasets: [
      {
        label: "Effectiveness Score",
        data: topCoaches.map((coach) => coach.effectiveness_score),
        backgroundColor: "#8B153890", // Maroon with transparency
        borderColor: "#8B1538", // Maroon border
        borderWidth: 2,
      },
      {
        label: "Attendance Rate (%)",
        data: topCoaches.map((coach) => coach.attendance_rate),
        backgroundColor: "#FFD70090", // Gold with transparency
        borderColor: "#FFD700", // Gold border
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: "Coach Effectiveness & Attendance Rates",
      },
      tooltip: {
        callbacks: {
          afterLabel: function (context) {
            const coach = topCoaches[context.dataIndex];
            return [
              `Teams: ${coach.team_count}`,
              `Players: ${coach.total_players}`,
              `Recent Trainings: ${coach.recent_trainings}`,
            ];
          },
        },
      },
    },
  };

  return (
    <ChartCard
      title="Coach Effectiveness"
      description="Coach performance based on attendance and training frequency"
      hasData={true}
      height={256}
    >
      <Bar data={chartData} options={options} />
    </ChartCard>
  );
};

// System Health Score Chart
export const SystemHealthChart = ({ score }) => {
  if (typeof score !== "number") {
    return (
      <ChartCard
        title="System Health"
        description="Overall system health score"
        hasData={false}
        emptyMessage="No data available"
        height={256}
      />
    );
  }

  const healthData = {
    labels: ["Health Score", "Issues"],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [
          score >= 80 ? "#8B153890" : score >= 60 ? "#FFD70090" : "#EF444490", // Maroon, gold, or red with transparency
          "#E5E7EB90",
        ],
        borderColor: [
          score >= 80 ? "#8B1538" : score >= 60 ? "#FFD700" : "#EF4444", // Maroon, gold, or red borders
          "#D1D5DB",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...commonOptions,
    cutout: "60%",
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: `System Health: ${score}/100`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataIndex === 0) {
              return `Health Score: ${score}/100`;
            }
            return `Issues: ${100 - score}/100`;
          },
        },
      },
    },
  };
  const getHealthStatus = (score) => {
    if (score >= 80) return { text: "Excellent", color: "text-primary" }; // Use primary color for excellent
    if (score >= 60) return { text: "Good", color: "text-secondary" }; // Use secondary color for good
    return { text: "Needs Attention", color: "text-red-600" };
  };

  const healthStatus = getHealthStatus(score);

  return (
    <ChartCard
      title="System Health Score"
      description="Overall system health score"
      hasData={true}
      height={256}
    >
      <div className="relative h-full">
        <Doughnut data={healthData} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{score}</div>
            <div className={`text-sm ${healthStatus.color}`}>
              {healthStatus.text}
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

// Monthly Training Trend Chart
export const TrainingTrendChart = ({ data }) => {
  if (!data) {
    return (
      <ChartCard
        title="Training Trends"
        description="Monthly training session trends"
        hasData={false}
        emptyMessage="No data available"
        height={256}
      />
    );
  }

  // Prefer backend-provided monthly trend. If not available, generate
  // recent month labels and show zeros (do NOT invent positive mock data).
  const monthlyTrend =
    data?.monthly_trend || data?.training_analytics?.monthly_trend || null;

  const monthsToShow =
    (monthlyTrend && monthlyTrend.labels && monthlyTrend.labels.length) || 5;

  // generateLastNMonths: returns array of short month labels like ['Jun', 'Jul', ...]
  const generateLastNMonths = (n) => {
    const res = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      res.push(d.toLocaleString(undefined, { month: "short" }));
    }
    return res;
  };

  const labels =
    monthlyTrend && monthlyTrend.labels && monthlyTrend.labels.length > 0
      ? monthlyTrend.labels
      : generateLastNMonths(monthsToShow);

  // If backend provided values, use them. Otherwise create zeros.
  let values;
  if (monthlyTrend && monthlyTrend.values && monthlyTrend.values.length > 0) {
    values = monthlyTrend.values;
  } else {
    // Do not fabricate historical non-zero values. If a single `monthly_sessions`
    // number exists and is > 0, show it only for the most recent month.
    const lastCount =
      typeof data?.monthly_sessions === "number" && data.monthly_sessions > 0
        ? data.monthly_sessions
        : typeof data?.training_analytics?.monthly_sessions === "number" &&
          data.training_analytics.monthly_sessions > 0
        ? data.training_analytics.monthly_sessions
        : 0;

    values = Array(monthsToShow).fill(0);
    if (lastCount > 0) {
      values[values.length - 1] = lastCount;
    }
  }

  const trendData = {
    labels,
    datasets: [
      {
        label: "Training Sessions",
        data: values,
        borderColor: "#8B1538", // Maroon border
        backgroundColor: "rgba(139, 21, 56, 0.1)", // Maroon with transparency
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <ChartCard
      title="Training Trends"
      description="Monthly training session trends"
      hasData={true}
      height={256}
    >
      <Line data={trendData} options={options} />
    </ChartCard>
  );
};

// Gender Distribution Chart
export const GenderDistributionChart = ({ data }) => {
  if (
    !data ||
    (!data.male_players &&
      !data.female_players &&
      !data.male_teams &&
      !data.female_teams)
  ) {
    return (
      <ChartCard
        title="Gender Distribution"
        description="Players and teams by gender/division"
        hasData={false}
        emptyMessage="No gender data available"
        height={256}
      />
    );
  }
  const chartData = {
    labels: ["Male Players", "Female Players", "Male Teams", "Female Teams"],
    datasets: [
      {
        label: "Count",
        data: [
          data.male_players || 0,
          data.female_players || 0,
          data.male_teams || 0,
          data.female_teams || 0,
        ],
        backgroundColor: ["#8B153890", "#FFD70090", "#f59e0b90", "#7f1d1d90"], // Maroon, gold, amber, dark red with transparency
        borderColor: ["#8B1538", "#FFD700", "#f59e0b", "#7f1d1d"], // Matching borders
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: "Gender & Division Distribution",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}`;
          },
        },
      },
    },
  };

  return (
    <ChartCard
      title="Gender Distribution"
      description="Players and teams by gender/division"
      hasData={true}
      height={256}
    >
      <Bar data={chartData} options={options} />
    </ChartCard>
  );
};

// Players by Gender and Sport Chart
export const PlayersByGenderSportChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard
        title="Players by Gender & Sport"
        description="Player distribution across sports by gender"
        hasData={false}
        emptyMessage="No player gender data available"
        height={256}
      />
    );
  }

  // Group data by sport
  const sportData = data.reduce((acc, item) => {
    const sport = item.team__sport__name;
    if (!acc[sport]) {
      acc[sport] = { male: 0, female: 0 };
    }
    acc[sport][item.user__sex] = item.count;
    return acc;
  }, {});

  const sports = Object.keys(sportData);
  const maleData = sports.map((sport) => sportData[sport].male || 0);
  const femaleData = sports.map((sport) => sportData[sport].female || 0);
  const chartData = {
    labels: sports,
    datasets: [
      {
        label: "Male Players",
        data: maleData,
        backgroundColor: "#8B153890", // Maroon with transparency
        borderColor: "#8B1538", // Maroon border
        borderWidth: 2,
      },
      {
        label: "Female Players",
        data: femaleData,
        backgroundColor: "#FFD70090", // Gold with transparency
        borderColor: "#FFD700", // Gold border
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: "Player Distribution by Gender & Sport",
      },
    },
  };

  return (
    <ChartCard
      title="Players by Gender & Sport"
      description="Player distribution across sports by gender"
      hasData={true}
      height={256}
    >
      <Bar data={chartData} options={options} />
    </ChartCard>
  );
};

// Teams by Division and Sport Chart
export const TeamsByDivisionSportChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard
        title="Teams by Division & Sport"
        description="Team distribution across sports by division"
        hasData={false}
        emptyMessage="No team division data available"
        height={256}
      />
    );
  }

  // Group data by sport
  const sportData = data.reduce((acc, item) => {
    const sport = item.sport__name;
    if (!acc[sport]) {
      acc[sport] = { male: 0, female: 0 };
    }
    acc[sport][item.division] = item.count;
    return acc;
  }, {});

  const sports = Object.keys(sportData);
  const maleData = sports.map((sport) => sportData[sport].male || 0);
  const femaleData = sports.map((sport) => sportData[sport].female || 0);
  const chartData = {
    labels: sports,
    datasets: [
      {
        label: "Men's Division",
        data: maleData,
        backgroundColor: "#8B153890", // Maroon with transparency
        borderColor: "#8B1538", // Maroon border
        borderWidth: 2,
      },
      {
        label: "Women's Division",
        data: femaleData,
        backgroundColor: "#FFD70090", // Gold with transparency
        borderColor: "#FFD700", // Gold border
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: "Team Distribution by Division & Sport",
      },
    },
  };

  return (
    <ChartCard
      title="Teams by Division & Sport"
      description="Team distribution across sports by division"
      hasData={true}
      height={256}
    >
      <Bar data={chartData} options={options} />
    </ChartCard>
  );
};

// Sports Distribution Chart
export const SportsDistributionChart = ({ data }) => {
  const prepareChartData = () => {
    const sportsData = data?.teams_by_sport || [];
    const playersData = data?.gender_stats?.players_by_gender_sport || [];
    const teamsData = data?.gender_stats?.teams_by_division_sport || [];

    if (sportsData.length === 0) return null;

    const sports = sportsData.map((sport) => sport.sport__name);

    // Prepare datasets
    const malePlayersData = sports.map((sport) => {
      const playerData = playersData.find(
        (p) => p.team__sport__name === sport && p.user__sex === "male"
      );
      return playerData?.count || 0;
    });

    const femalePlayersData = sports.map((sport) => {
      const playerData = playersData.find(
        (p) => p.team__sport__name === sport && p.user__sex === "female"
      );
      return playerData?.count || 0;
    });

    const maleTeamsData = sports.map((sport) => {
      const teamData = teamsData.find(
        (t) => t.sport__name === sport && t.division === "male"
      );
      return teamData?.count || 0;
    });

    const femaleTeamsData = sports.map((sport) => {
      const teamData = teamsData.find(
        (t) => t.sport__name === sport && t.division === "female"
      );
      return teamData?.count || 0;
    });

    return {
      labels: sports,
      datasets: [
        {
          label: "Male Players",
          data: malePlayersData,
          backgroundColor: "#8B153890", // Maroon with transparency
          borderColor: "#8B1538", // Maroon border
          borderWidth: 2,
        },
        {
          label: "Female Players",
          data: femalePlayersData,
          backgroundColor: "#FFD70090", // Gold with transparency
          borderColor: "#FFD700", // Gold border
          borderWidth: 2,
        },
        {
          label: "Men's Teams",
          data: maleTeamsData,
          backgroundColor: "#f59e0b90", // Amber with transparency
          borderColor: "#f59e0b", // Amber border
          borderWidth: 2,
        },
        {
          label: "Women's Teams",
          data: femaleTeamsData,
          backgroundColor: "#7f1d1d90", // Dark red with transparency
          borderColor: "#7f1d1d", // Dark red border
          borderWidth: 2,
        },
      ],
    };
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false,
        borderWidth: 2,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Sports Distribution by Gender",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: function (context) {
            const datasetLabel = context.dataset.label;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
            return `${percentage}% of total ${datasetLabel.toLowerCase()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (!chartData) {
    return (
      <ChartCard
        title="Sports Distribution"
        description="Teams and players distribution by sport and gender"
        hasData={false}
        emptyMessage="No sports data available"
        height={256}
      />
    );
  }

  return (
    <ChartCard
      title="Sports Distribution"
      description="Teams and players distribution by sport and gender"
      hasData={true}
      height={256}
    >
      <Bar data={chartData} options={chartOptions} />
    </ChartCard>
  );
};
