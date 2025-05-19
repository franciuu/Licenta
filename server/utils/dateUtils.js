import { addDays, format, isWithinInterval, parseISO } from "date-fns";

export const getActivityDates = (
  startDate,
  endDate,
  targetDay,
  excludedPeriods = []
) => {
  const result = [];
  let start = new Date(startDate);
  let end = new Date(endDate);

  while (start.getDay() !== targetDay) {
    start = addDays(start, 1);
  }

  while (start <= end) {
    const isExcluded = excludedPeriods.some((period) =>
      isWithinInterval(start, {
        start: parseISO(period.startDate),
        end: parseISO(period.endDate),
      })
    );

    if (!isExcluded) {
      result.push(format(start, "yyyy-MM-dd"));
    }
    start = addDays(start, 7);
  }

  return result;
};
