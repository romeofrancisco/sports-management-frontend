const formatPeriod = (currentPeriod, maxPeriod) => {

  if (maxPeriod == null) return currentPeriod;

  if (currentPeriod <= maxPeriod) {
    return currentPeriod;
  }

  const otCount = currentPeriod - maxPeriod;
  return otCount === 1 ? "OT" : `${otCount}OT`;
};

export default formatPeriod;
