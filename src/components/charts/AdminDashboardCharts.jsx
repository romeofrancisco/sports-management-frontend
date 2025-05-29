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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <Card>
        <CardHeader>
          <CardTitle>Teams by Sport</CardTitle>
          <CardDescription>
            Distribution of teams across different sports
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }
  const chartData = {
    labels: data.map((item) => item.sport__name || "Unknown"),
    datasets: [
      {
        label: "Number of Teams",
        data: data.map((item) => item.team_count),
        backgroundColor: data.map(
          (_, index) => (index % 2 === 0 ? "#8B1538" : "#FFD700") // Alternating primary and secondary colors
        ),
        borderWidth: 2,
        borderColor: "#fff",
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
    <Card>
      <CardHeader>
        <CardTitle>Teams by Sport</CardTitle>
        <CardDescription>
          Distribution of teams across different sports
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <Doughnut data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

// System Activity Overview Chart
export const SystemActivityChart = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>Recent system activity metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
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
        backgroundColor: "#8B1538", // Primary color
        borderColor: "#B01E47", // Primary light
        borderWidth: 1,
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
    <Card>
      <CardHeader>
        <CardTitle>System Activity</CardTitle>
        <CardDescription>Recent system activity metrics</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

// User Activity Trends Chart
export const UserActivityChart = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Activity & Engagement</CardTitle>
          <CardDescription>
            Comprehensive user activity metrics and growth trends
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
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
        backgroundColor: "rgba(139, 21, 56, 0.2)", // Primary with transparency
        borderColor: "#8B1538", // Primary color
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
    <Card>
      <CardHeader>
        <CardTitle>User Activity & Engagement</CardTitle>
        <CardDescription>
          Comprehensive user activity metrics and growth trends
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

// Training Attendance Chart
export const TrainingAttendanceChart = ({ data }) => {
  if (!data || !data.overall_attendance_rate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Attendance</CardTitle>
          <CardDescription>Overall training attendance metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const attendanceRate = data.overall_attendance_rate;
  const absenteeRate = 100 - attendanceRate;
  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendanceRate, absenteeRate],
        backgroundColor: ["#8B1538", "#FFD700"], // Primary and secondary colors
        borderColor: ["#B01E47", "#FFC107"], // Lighter variations
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
        text: `Overall Attendance: ${attendanceRate.toFixed(1)}%`,
      },
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
    <Card>
      <CardHeader>
        <CardTitle>Training Attendance</CardTitle>
        <CardDescription>Overall training attendance rate</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <Pie data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

// Top Performing Teams Chart
export const TopTeamsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Teams</CardTitle>
          <CardDescription>Teams with highest win rates</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
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
          (_, index) => (index % 2 === 0 ? "#8B1538" : "#FFD700") // Alternating primary and secondary
        ),
        borderColor: topTeams.map(
          (_, index) => (index % 2 === 0 ? "#B01E47" : "#FFC107") // Lighter variations
        ),
        borderWidth: 1,
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
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Teams</CardTitle>
        <CardDescription>Teams with highest win rates</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

// Coach Effectiveness Chart
export const CoachEffectivenessChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Coach Effectiveness</CardTitle>
          <CardDescription>
            Coach performance based on attendance and training frequency
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const topCoaches = data.slice(0, 6); // Show top 6 coaches
  const chartData = {
    labels: topCoaches.map((coach) => coach.coach_name),
    datasets: [
      {
        label: "Effectiveness Score",
        data: topCoaches.map((coach) => coach.effectiveness_score),
        backgroundColor: "#8B1538", // Primary color
        borderColor: "#B01E47", // Primary light
        borderWidth: 1,
      },
      {
        label: "Attendance Rate (%)",
        data: topCoaches.map((coach) => coach.attendance_rate),
        backgroundColor: "#FFD700", // Secondary color
        borderColor: "#FFC107", // Secondary variant
        borderWidth: 1,
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
    <Card>
      <CardHeader>
        <CardTitle>Coach Effectiveness</CardTitle>
        <CardDescription>
          Coach performance based on attendance and training frequency
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

// System Health Score Chart
export const SystemHealthChart = ({ score }) => {
  if (typeof score !== "number") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Overall system health score</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const healthData = {
    labels: ["Health Score", "Issues"],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [
          score >= 80 ? "#8B1538" : score >= 60 ? "#FFD700" : "#EF4444", // Primary, secondary, or red for poor health
          "#E5E7EB",
        ],
        borderColor: [
          score >= 80 ? "#B01E47" : score >= 60 ? "#FFC107" : "#DC2626", // Lighter variations
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
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Overall system health score</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
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
      </CardContent>
    </Card>
  );
};

// Monthly Training Trend Chart
export const TrainingTrendChart = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Trends</CardTitle>
          <CardDescription>Monthly training session trends</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Mock trend data - in real implementation, you'd get this from the backend
  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Training Sessions",
        data: [45, 52, 48, 61, data.monthly_sessions || 0],
        borderColor: "#8B1538", // Primary color
        backgroundColor: "rgba(139, 21, 56, 0.1)", // Primary with transparency
        borderWidth: 3,
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
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: `Trend: ${data.training_trend || "stable"}`,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Trends</CardTitle>
        <CardDescription>Monthly training session trends</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <Line data={trendData} options={options} />
      </CardContent>
    </Card>
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
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
          <CardDescription>
            Players and teams by gender/division
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No gender data available</p>
        </CardContent>
      </Card>
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
        backgroundColor: ["#8B1538", "#FFD700", "#B01E47", "#FFC107"], // University colors pattern
        borderColor: ["#B01E47", "#FFC107", "#8B1538", "#FFD700"], // Alternating pattern
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
    <Card>
      <CardHeader>
        <CardTitle>Gender Distribution</CardTitle>
        <CardDescription>Players and teams by gender/division</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

// Players by Gender and Sport Chart
export const PlayersByGenderSportChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Players by Gender & Sport</CardTitle>
          <CardDescription>
            Player distribution across sports by gender
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">
            No player gender data available
          </p>
        </CardContent>
      </Card>
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
        backgroundColor: "#8B1538", // Primary color
        borderColor: "#B01E47", // Primary light
        borderWidth: 1,
      },
      {
        label: "Female Players",
        data: femaleData,
        backgroundColor: "#FFD700", // Secondary color
        borderColor: "#FFC107", // Secondary variant
        borderWidth: 1,
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
    <Card>
      <CardHeader>
        <CardTitle>Players by Gender & Sport</CardTitle>
        <CardDescription>
          Player distribution across sports by gender
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

// Teams by Division and Sport Chart
export const TeamsByDivisionSportChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Teams by Division & Sport</CardTitle>
          <CardDescription>
            Team distribution across sports by division
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">
            No team division data available
          </p>
        </CardContent>
      </Card>
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
        label: "Male Division",
        data: maleData,
        backgroundColor: "#8B1538", // Primary color
        borderColor: "#B01E47", // Primary light
        borderWidth: 1,
      },
      {
        label: "Female Division",
        data: femaleData,
        backgroundColor: "#FFD700", // Secondary color
        borderColor: "#FFC107", // Secondary variant
        borderWidth: 1,
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
    <Card>
      <CardHeader>
        <CardTitle>Teams by Division & Sport</CardTitle>
        <CardDescription>
          Team distribution across sports by division
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};
