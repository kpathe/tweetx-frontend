import { formatDistanceToNowStrict, format, isBefore, subDays } from "date-fns";

export const formatRelativeTime = (date) => {
  if (!date) return "";
  const targetDate = new Date(date);
  const now = new Date();

  if (isBefore(targetDate, subDays(now, 6))) {
    return format(targetDate, "d MMM");
  }

  
  const distance = formatDistanceToNowStrict(targetDate);
  
  
  return distance
    .replace(" seconds", "s")
    .replace(" second", "s")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d");
};