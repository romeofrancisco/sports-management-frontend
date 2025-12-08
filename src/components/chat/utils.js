export function filterAndSortTeamChats(teamChats, search) {
  const lower = search?.trim().toLowerCase();
  const filtered = lower
    ? teamChats.filter(
        (chat) =>
          chat.team_name?.toLowerCase().includes(lower) ||
          chat.latest_message?.message?.toLowerCase().includes(lower)
      )
    : teamChats;
  return [...filtered].sort((a, b) => {
    // Unread chats first
    if (b.unread_count > 0 !== a.unread_count > 0) {
      return b.unread_count - a.unread_count;
    }
    // Then by latest_message timestamp (newest first)
    const aTime = a.latest_message?.timestamp
      ? new Date(a.latest_message.timestamp).getTime()
      : 0;
    const bTime = b.latest_message?.timestamp
      ? new Date(b.latest_message.timestamp).getTime()
      : 0;
    return bTime - aTime;
  });
}

export function formatDateLabel(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();

  // If it's today, show only time
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Check if it's within this week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  if (date >= startOfWeek && date <= endOfWeek) {
    // If it's this week, show day name and time
    return (
      date.toLocaleDateString([], { weekday: "short" }).toUpperCase() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }  // If it's not this week, show full date and time
  const isCurrentYear = date.getFullYear() === today.getFullYear();
  return (
    date.toLocaleDateString([], { 
      month: "short", 
      day: "numeric", 
      ...(isCurrentYear ? {} : { year: "numeric" })
    }) +
    " at " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

export function shouldShowDateSeparator(currentMessage, previousMessage) {
  if (!previousMessage) return true; // Show for first message

  const currentTime = new Date(currentMessage.timestamp);
  const prevTime = new Date(previousMessage.timestamp);
  const today = new Date();

  // If messages are on different dates, show separator
  if (currentTime.toDateString() !== prevTime.toDateString()) {
    return true;
  }

  // If both messages are from today, check if there's a 30+ minute gap
  if (currentTime.toDateString() === today.toDateString()) {
    const timeDiffMinutes = (currentTime - prevTime) / (1000 * 60);
    return timeDiffMinutes >= 25;
  }

  // For non-today messages, don't show separator unless different dates
  return false;
}
