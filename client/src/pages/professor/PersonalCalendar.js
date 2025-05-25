import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { RiFileDownloadFill, RiExternalLinkFill } from "react-icons/ri";

import "react-big-calendar/lib/css/react-big-calendar.css";
import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import Loader from "../../components/Loader";
import { getPersonalActivities } from "../../services/ActivityService";
import { exportToICS } from "../../utils/ExportICS";

const localizer = momentLocalizer(moment);

const PersonalCalendar = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [myEvents, setMyEvents] = useState([]);
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const activitiesData = await getPersonalActivities(axiosCustom);
        let formattedData = [];

        activitiesData.forEach((a) => {
          a.availableDates.forEach((dateStr) => {
            const date = moment(dateStr, "YYYY-MM-DD");

            const [startHour, startMinute] = a.startTime.split(":");
            const [endHour, endMinute] = a.endTime.split(":");

            const start = date
              .clone()
              .hour(startHour)
              .minute(startMinute)
              .toDate();
            const end = date.clone().hour(endHour).minute(endMinute).toDate();

            formattedData.push({
              title: a.name,
              start: start,
              end: end,
              originalData: a,
            });
          });
        });

        setMyEvents(formattedData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchActivities();
  }, [axiosCustom]);

  const handleSelectEvent = (event) => {
    const selectedEvent = event.originalData;
    navigate(`/professor/attendance/${selectedEvent.uuid}`);
  };

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className="h-[calc(100vh-7.5rem)] flex gap-4 lg:flex-row">
        <div className="flex-1 min-w-0">
          <Calendar
            localizer={localizer}
            events={myEvents}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            min={new Date(2023, 1, 1, 7, 0)}
            max={new Date(2023, 1, 1, 23, 59)}
            onSelectEvent={(event) => handleSelectEvent(event)}
            className="bg-white rounded-lg shadow-sm"
          />
        </div>

        <div className="w-35 flex flex-col gap-3 pt-2">
          <button
            onClick={() => exportToICS(myEvents)}
            className="inline-flex items-center bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            <RiFileDownloadFill className="w-4 h-4 mr-1" />
            Download .ics
          </button>
          <a
            href="https://calendar.google.com/calendar/u/0/r"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <RiExternalLinkFill className="w-4 h-4 mr-1" />
            Google Calendar
          </a>
        </div>
      </div>
    </Layout>
  );
};
export default PersonalCalendar;
