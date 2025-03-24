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
        const startDate = moment("2024-10-01");
        const endDate = moment("2025-06-04");
        let formattedData = [];

        activitiesData.forEach((a) => {
          let currentDate = startDate.clone();

          while (currentDate.isBefore(endDate)) {
            if (currentDate.day() === a.dayOfWeek) {
              const start = currentDate
                .hour(a.startTime.split(":")[0])
                .minute(a.startTime.split(":")[1])
                .toDate();
              const end = currentDate
                .hour(a.endTime.split(":")[0])
                .minute(a.endTime.split(":")[1])
                .toDate();
              formattedData.push({
                title: a.name,
                start: start,
                end: end,
                originalData: a,
              });
            }
            currentDate.add(1, "days");
          }
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
