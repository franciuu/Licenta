import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useAxiosCustom from "../hooks/useAxiosCustom";
import Layout from "./Layout";
import style from "../styles/Activity.module.css";

const TakeAttendance = () => {
  const [activity, setActivity] = useState(null);
  const [matches, setMatches] = useState(null);
  const [running, setRunning] = useState(false);
  const [timeStatus, setTimeStatus] = useState(false);
  const axiosCustom = useAxiosCustom();
  const { id } = useParams(); // id-ul activității
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const timeIntervalRef = useRef(null);

  const getActivity = async () => {
    try {
      const response = await axiosCustom.get(`/activities/${id}`);
      setActivity(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const base64Img = canvas.toDataURL("image/jpeg");

    try {
      const response = await axiosCustom.post("/rec", {
        imageData: base64Img,
        activityId: id, // transmis clar către backend
      });

      setMatches(response.data.recognized_faces || []);
    } catch (error) {
      console.log("Eroare la trimiterea imaginii:", error);
    }
  };

  const startCamera = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = streamRef.current;
      intervalRef.current = setInterval(captureImage, 3000); // imagine la fiecare 3 secunde
      setRunning(true);
    } catch (error) {
      console.log(error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
      streamRef.current = null;
      videoRef.current.srcObject = null;
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setRunning(false);
    }
  };

  const checkActivityTime = (activity) => {
    const date = new Date();
    const currentTime = date.toTimeString().split(" ")[0];
    const currentDay = date.getDay();

    if (
      currentDay === activity.dayOfWeek &&
      currentTime >= activity.startTime &&
      currentTime <= activity.endTime
    ) {
      setTimeStatus(true);
    } else {
      setTimeStatus(false);
      if (running) stopCamera();
    }
  };

  useEffect(() => {
    getActivity();
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timeIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (activity) {
      checkActivityTime(activity);
      timeIntervalRef.current = setInterval(
        () => checkActivityTime(activity),
        60000
      );
    }
  }, [activity]);

  return (
    <Layout>
      {activity ? (
        <div>
          <h1>{activity.name}</h1>
          <p>{`Room: ${activity.room}`}</p>
          <p>{activity.startTime}</p>
          <p>{activity.endTime}</p>
          <p>{activity.course.name}</p>
          <p>{activity.user.name}</p>

          <button
            className={style.btn}
            onClick={startCamera}
            disabled={running || !timeStatus}
          >
            Start Attendance
          </button>
          <button
            className={style.btn}
            onClick={stopCamera}
            disabled={!running || !timeStatus}
          >
            Stop Attendance
          </button>

          <video ref={videoRef} autoPlay muted></video>

          <div>
            <h3>Rezultate:</h3>
            {matches?.length > 0 ? (
              <ul>
                {matches.map((match, index) => (
                  <li key={index}>{match.name}</li>
                ))}
              </ul>
            ) : (
              <p>Nicio persoană identificată.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Activity not found</p>
      )}
    </Layout>
  );
};

export default TakeAttendance;
