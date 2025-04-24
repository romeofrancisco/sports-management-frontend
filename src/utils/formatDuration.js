export const formatDuration = (duration) => {
  const [h, m, s] = duration.split(":");
  const [seconds, micro] = s.split(".");

  return `${String(m).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
