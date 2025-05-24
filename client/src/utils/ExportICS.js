import { createEvents } from "ics";
import { saveAs } from "file-saver";

export const exportToICS = (events) => {
  const icsEvents = events.map((event) => {
    const start = [
      event.start.getFullYear(),
      event.start.getMonth() + 1,
      event.start.getDate(),
      event.start.getHours(),
      event.start.getMinutes(),
    ];
    const end = [
      event.end.getFullYear(),
      event.end.getMonth() + 1,
      event.end.getDate(),
      event.end.getHours(),
      event.end.getMinutes(),
    ];

    return {
      title: event.title,
      start,
      end,
      description: event.originalData?.description || "",
      location: event.originalData?.location || "",
    };
  });

  createEvents(icsEvents, (error, value) => {
    if (error) {
      console.error(error);
      return;
    }

    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
    saveAs(blob, "calendar.ics");
  });
};
