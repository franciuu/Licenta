import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useAxiosCustom from "../hooks/useAxiosCustom";
import Layout from "./Layout";
import style from "../styles/TakeAttendance.module.css";
import Loader from "../components/Loader";

const TakeAttendance = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [activity, setActivity] = useState(null);
  const [presentStudents, setPresentStudents] = useState([]);
  const [running, setRunning] = useState(false);
  const [timeStatus, setTimeStatus] = useState(false);
  const axiosCustom = useAxiosCustom();
  const { id } = useParams();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const timeIntervalRef = useRef(null);

  const getActivity = async () => {
    setLoadingCount((prev) => prev + 1);
    try {
      const response = await axiosCustom.get(`/activities/${id}`);
      setActivity(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCount((prev) => prev - 1);
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
        activityId: id,
      });

      const newlyRecognized = response.data.recognized_faces || [];

      setPresentStudents((prev) => {
        const existingNames = prev.map((item) => item.name);
        const uniqueNew = newlyRecognized.filter(
          (item) => !existingNames.includes(item.name)
        );
        return [...prev, ...uniqueNew];
      });
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
      intervalRef.current = setInterval(captureImage, 3000);
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

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      {activity ? (
        <div className={style.container}>
          <div className={style.leftSection}>
            <h1 className={style.title}>{activity.name}</h1>

            <div
              className={
                style.timeStatus +
                " " +
                (timeStatus ? style.timeActive : style.timeInactive)
              }
            >
              {timeStatus
                ? "This activity is currently in progress"
                : "You are outside the scheduled time for this activity"}
            </div>

            <div className={style.buttonGroup}>
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
            </div>

            <div className={style.videoContainer}>
              <video
                ref={videoRef}
                autoPlay
                muted
                className={style.video}
              ></video>
            </div>
          </div>

          <div className={style.rightSection}>
            <h3 className={style.resultTitle}>Students marked as present:</h3>
            {presentStudents.length > 0 ? (
              <ul className={style.studentList}>
                {presentStudents.map((student, index) => (
                  <li key={index} className={style.studentItem}>
                    {student.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={style.noStudents}>
                Marked students will appear here.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p>Activity not found.</p>
      )}
    </Layout>
  );
};

export default TakeAttendance;
