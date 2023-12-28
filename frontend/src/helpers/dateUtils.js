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
        return "Только что";
      }

      // less than and hour ago
      return `${minutesDifference} минут назад`;
    }

    // less than 12 hours ago
    if (hoursDifference < 12) {
      return `${hoursDifference} час${hoursDifference > 1 ? "ов" : ""} назад`;
    }

    // less than 24 hours and more than 12 hours
    return "Сегодня";
  }

  // yesterday
  if (daysDifference === 1) {
    return "Вчера";
  }

  // less than a week ago
  if (daysDifference <= 7) {
    return `${daysDifference} ${daysDifference > 1 ? "дней" : "день"} назад`;
  }

  // more than a week ago
  return date.formatDate(datetime, "DD.MM.YYYY HH:mm");
};
