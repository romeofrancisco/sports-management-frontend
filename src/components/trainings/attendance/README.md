# Attendance Analytics Components

This directory contains the refactored attendance analytics components following the DRY (Don't Repeat Yourself) principle for better organization and maintainability.

## Component Structure

### Main Components

- **`AttendanceAnalyticsTab.jsx`** - Main container component that orchestrates all sub-components
- **`components/OverviewTab.jsx`** - Overview dashboard with stats cards and charts
- **`components/PlayersTab.jsx`** - Players list component
- **`components/PlayerDetailDashboard.jsx`** - Individual player analytics dashboard
- **`components/PlayersTabContainer.jsx`** - Container that manages player list and detail views
- **`components/FiltersSection.jsx`** - Reusable filters component for team and date range selection

### Utility Components

- **`components/StatCard.jsx`** - Reusable stats card component used across multiple views
- **`components/chartConfigs.js`** - Chart configuration utilities and factory functions

### Benefits of Refactoring

1. **Better Organization**: Components are separated into logical, focused files
2. **Reusability**: StatCard and chart configurations can be reused across components
3. **Maintainability**: Each component has a single responsibility
4. **Testing**: Individual components can be tested in isolation
5. **Code Clarity**: Easier to understand and modify specific functionality

## Component Usage

### StatCard
Reusable component for displaying metrics with optional trend indicators:
```jsx
<StatCard
  title="Total Sessions"
  value={42}
  icon={<CalendarDays className="h-4 w-4" />}
  trend={5.2} // Optional trend percentage
/>
```

### Chart Configurations
Utility functions for creating consistent chart configurations:
```jsx
import { createAttendanceDistributionChart, distributionChartOptions } from './chartConfigs';

const chartData = createAttendanceDistributionChart(attendanceData);
<Doughnut data={chartData} options={distributionChartOptions} />
```

### FiltersSection
Reusable filters component:
```jsx
<FiltersSection
  selectedTeam={selectedTeam}
  onTeamChange={handleTeamChange}
  dateRange={dateRange}
  onDateRangeChange={handleDateRangeChange}
  teams={teams}
  teamsLoading={teamsLoading}
/>
```

## File Structure
```
attendance/
├── AttendanceAnalyticsTab.jsx          # Main container component
└── components/
    ├── index.js                        # Barrel exports
    ├── StatCard.jsx                    # Reusable stats card
    ├── OverviewTab.jsx                 # Overview dashboard
    ├── PlayersTab.jsx                  # Players list
    ├── PlayerDetailDashboard.jsx       # Individual player dashboard
    ├── PlayersTabContainer.jsx         # Player views container
    ├── FiltersSection.jsx              # Filters component
    └── chartConfigs.js                 # Chart utilities
```

## Next Steps for Further Enhancement

1. **Add unit tests** for each component
2. **Extract more utilities** like date formatting and status mapping
3. **Create custom hooks** for component-specific logic
4. **Add PropTypes or TypeScript** for better type safety
5. **Consider adding error boundaries** for better error handling
