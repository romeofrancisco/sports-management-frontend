export const formatDate = (dateString, locale = "en-PH") => {
  const date = new Date(dateString);
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  });
};

export const formatShortDate = (dateString, locale = "en-PH") => {
  const date = new Date(dateString);
  return date.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (dateString, locale = "en-PH") => {
  const date = new Date(dateString);
  return date.toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  });
};

