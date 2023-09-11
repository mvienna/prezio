import { date } from "quasar";

export const formatDateTime = (datetime) => {
  const now = new Date();
  const daysDifference = date.getDateDiff(now, new Date(datetime), "days");

  if (daysDifference <= 0) {
    const hoursDifference = date.getDateDiff(now, new Date(datetime), "hours");

    if (hoursDifference <= 0) {
      const minutesDifference = date.getDateDiff(
        now,
        new Date(datetime),
        "minutes"
      );

      // just now
      if (minutesDifference <= 1) {
        return "Just now";
      }

      // less than and hour ago
      return `${minutesDifference} minutes ago`;
    }

    // less than 12 hours ago
    if (hoursDifference < 12) {
      return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
    }

    // less than 24 hours and more than 12 hours
    return "Today";
  }

  // yesterday
  if (daysDifference === 1) {
    return "Yesterday";
  }

  // less than a week ago
  if (daysDifference <= 7) {
    return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
  }

  // more than a week ago
  return date.formatDate(datetime, "DD.MM.YYYY HH:mm");
};
