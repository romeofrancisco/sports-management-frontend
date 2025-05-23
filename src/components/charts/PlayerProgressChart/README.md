# Player Charts Components

This directory contains chart components related to player performance and progress tracking.

## Components Overview

### PlayerProgressChart

The main component that displays a player's progress over time. It handles:
- Fetching metrics data
- Displaying appropriate loading, error and empty states
- Allowing metric selection
- Rendering detailed charts with annotations
- Displaying performance analysis

### ChartHeader

Renders the chart header with:
- Player name
- Date range picker
- Metric selector
- Performance indicator badges

### ProgressChart

Renders the actual line chart visualization using Chart.js with:
- Data points from the player's progress
- Trend lines
- Annotations for starting points and best performance
- Responsive tooltips

### PerformanceAnalysis

Provides detailed analysis of the player's performance with:
- Overall improvement metrics
- Recent improvement metrics
- Performance statistics
- Consistency analysis

### State Components

Various state components to handle different UI conditions:
- `LoadingState` - Displays loading spinner
- `ErrorState` - Shows error messages
- `EmptyState` - Shows message when no data available
- `NoMetricsState` - Shows when player has no metrics recorded
- `NoDataState` - Shows when no data available for selected metric
- `SelectMetricPrompt` - Prompts user to select a metric

## Usage

```jsx
import { PlayerProgressChart } from "@/components/charts/player";

function PlayerView({ playerId }) {
  return (
    <div>
      <h1>Player Progress</h1>
      <PlayerProgressChart 
        playerId={playerId}
        dateRange={{
          from: new Date('2023-01-01'),
          to: new Date()
        }}
        onDateChange={(newRange) => console.log('Date range changed', newRange)}
      />
    </div>
  );
}
```
