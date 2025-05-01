export const getPeriodEvents = (events, scoring, selectedPeriodIndex, isSetBased) => {
  if (isSetBased) {
    const currentPeriod = scoring.periods[selectedPeriodIndex];
    return events[currentPeriod?.number] || [];
  }
  return Array.isArray(events) ? events : Object.values(events).flat();
};

export const buildChartData = (periodEvents, scoring) => {
  const labels = [];
  const homeScores = [];
  const awayScores = [];
  let homeTotal = 0;
  let awayTotal = 0;

  periodEvents.forEach((event) => {
    if (event.team_side === "home") homeTotal += event.point_value || 0;
    else awayTotal += event.point_value || 0;

    labels.push("");
    homeScores.push(homeTotal);
    awayScores.push(awayTotal);
  });

  scoring.periods?.reduce((start, period) => {
    const count = period.events_count || 0;
    const mid = start + Math.floor(count / 2);
    if (labels[mid] !== undefined) labels[mid] = period.label;
    return start + count;
  }, 0);

  return { labels, homeScores, awayScores };
};