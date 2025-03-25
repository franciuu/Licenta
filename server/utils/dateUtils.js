import { addDays, format } from "date-fns";

export const getActivityDates = (startDate, endDate, targetDay) => {
  const result = [];
  let start = new Date(startDate);
  let end = new Date(endDate);

  while (start.getDay() !== targetDay) {
    start = addDays(start, 1);
  }

  while (start <= end) {
    result.push(format(start, "yyyy-MM-dd"));
    start = addDays(start, 7);
  }

  return result;
};
