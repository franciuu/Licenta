import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Layout from "./Layout";
import useAxiosCustom from "../hooks/useAxiosCustom";

const localizer = momentLocalizer(moment);

const PersonalCalendar = () => {
  const [myEvents, setMyEvents] = useState([]);
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();
  const [result, setResult] = useState("");

  const getPersonalActivities = async () => {
    try {
      const response = await axiosCustom.get(`/activities/personal`);
      const data = response.data;
      const startDate = moment("2024-10-01");
      const endDate = moment("2025-06-04");
      let formattedData = [];

      data.forEach((a) => {
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
    }
  };
  useEffect(() => {
    getPersonalActivities();
  }, []);

  const handleSelectEvent = (event) => {
    const selectedEvent = event.originalData;
    navigate(`/activities/${selectedEvent.uuid}`);
  };

  const handleClick = async () => {
    const response = await axiosCustom.get("/ai");
    console.log(response.data.message);
  };
  return (
    <Layout>
      <button onClick={handleClick}>Apasa</button>
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        onSelectEvent={(event) => handleSelectEvent(event)}
        style={{ height: "100vh" }}
      />
    </Layout>
  );
};
export default PersonalCalendar;
