import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiCameraOff, FiCamera } from "react-icons/fi";

import TimeStatus from "../../components/professor/TimeStatus";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import Layout from "../Layout";
import Loader from "../../components/Loader";
import { getActivityById } from "../../services/ActivityService";

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

  const fetchActivity = async () => {
    setLoadingCount((prev) => prev + 1);
    try {
      const activityData = await getActivityById(axiosCustom, id);
      setActivity(activityData);
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
      intervalRef.current = setInterval(captureImage, 2000);
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
    fetchActivity();
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
        <div className="min-h-[calc(100vh-7.5rem)]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {activity.name}
              </h1>
              <TimeStatus timeStatus={timeStatus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={startCamera}
                    disabled={running || !timeStatus}
                    className="flex-1 inline-flex items-center justify-center p-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiCamera className="w-5 h-5 mr-2" />
                    Start Attendance
                  </button>
                  <button
                    onClick={stopCamera}
                    disabled={!running || !timeStatus}
                    className="flex-1 inline-flex items-center justify-center p-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiCameraOff className="w-5 h-5 mr-2" />
                    Stop Attendance
                  </button>
                </div>

                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!running && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                      <div className="text-center text-white">
                        <FiCamera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Camera not active</p>
                      </div>
                    </div>
                  )}
                  {running && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                        Recording
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                  <div className="flex items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Present Students
                    </h2>
                    <span className="ml-auto bg-purple-100 text-purple-800 text-sm font-medium px-2 py-1 rounded-full">
                      {presentStudents.length}
                    </span>
                  </div>

                  {presentStudents.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {presentStudents.map((student, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                          <span className="text-sm font-medium text-gray-900">
                            {student.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">
                        Marked students will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[calc(100vh-7.5rem)] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Activity not found
            </h2>
            <p className="text-gray-600">
              The requested activity could not be loaded.
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TakeAttendance;
