import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import Loader from "../../components/Loader";
import { getPersonalActivities } from "../../services/ActivityService";

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
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        min={new Date(2023, 1, 1, 7, 0)}
        max={new Date(2023, 1, 1, 23, 59)}
        onSelectEvent={(event) => handleSelectEvent(event)}
      />
    </Layout>
  );
};
export default PersonalCalendar;
