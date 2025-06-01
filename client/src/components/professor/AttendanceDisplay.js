import { useState, useEffect, useMemo } from "react";
import dateFormat from "dateformat";
import { FaFileAlt, FaFileDownload } from "react-icons/fa";
import { FiCheck, FiAlertCircle } from "react-icons/fi";
import { ExportAsExcel, ExportAsPdf } from "@siamf/react-export";

import useAxiosCustom from "../../hooks/useAxiosCustom";
import { getAttendancesByActivityAndDate } from "../../services/AttendanceService";

const AttendanceDisplay = ({
  activityId,
  activity,
  selectedDate,
  setSelectedDate,
}) => {
  const [loading, setLoading] = useState(false);
  const [attendances, setAttendances] = useState([]);
  const axiosCustom = useAxiosCustom();

  const exportData = useMemo(
    () =>
      (attendances || [])
        .filter((a) => a && typeof a === "object")
        .map((a) => ({
          "Student Name": a.name || "",
          "Arrival Time": a.arrivalTime || "",
        })),
    [attendances]
  );

  const fileName = useMemo(() => {
    const safeName = activity?.name
      ? activity.name.replace(/\s+/g, "_")
      : "Activity";
    return `Prezențe_${safeName}_${selectedDate || "Data"}`;
  }, [activity, selectedDate]);
  const title = `${activity?.name} - ${dateFormat(selectedDate, "dd-mm-yyyy")}`;
  const headers = ["Student Name", "Arrival Time"];

  useEffect(() => {
    if (!selectedDate) return;

    const fetchAttendances = async () => {
      setLoading(true);
      try {
        const attendancesData = await getAttendancesByActivityAndDate(
          axiosCustom,
          activityId,
          selectedDate
        );
        setAttendances(attendancesData || []);
      } catch (error) {
        console.error("Failed to fetch attendances data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, [selectedDate, axiosCustom, activityId]);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{`Attendance for ${dateFormat(
              selectedDate,
              "dd-mm-yyyy"
            )}`}</h3>
            <p className="text-gray-600 mt-1">{`${
              attendances.length === 0
                ? "No students"
                : attendances.length === 1
                ? "1 present student"
                : `${attendances.length} present students`
            }`}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ExportAsExcel
              data={exportData}
              fileName={fileName}
              headers={headers}
              disabled={!exportData.length}
            >
              {(props) => (
                <button
                  {...props}
                  disabled={!exportData.length}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaFileAlt className="w-4 h-4 mr-2"></FaFileAlt>
                  Export EXCEL
                </button>
              )}
            </ExportAsExcel>
            <ExportAsPdf
              data={exportData}
              fileName={fileName}
              title={title}
              headers={headers}
              disabled={!exportData.length}
            >
              {(props) => (
                <button
                  {...props}
                  disabled={!exportData.length}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaFileDownload className="w-4 h-4 mr-2"></FaFileDownload>
                  Export PDF
                </button>
              )}
            </ExportAsPdf>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="activityDate"
          >
            Select a date:
          </label>
          <select
            id="activityDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {(activity.availableDates || []).map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div>
            {attendances?.length ? (
              <div className="border border-gray-200 rounded-lg">
                <div className="p-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Present students:
                  </h3>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto">
                    {attendances.map((student, index) => (
                      <div
                        key={index}
                        className="flex items-start p-2 bg-green-50 border border-green-100 rounded-md"
                      >
                        <FiCheck className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-600">{`Arrival Time: ${student.arrivalTime}`}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center p-3 bg-blue-50 text-blue-800 rounded-md">
                <FiAlertCircle className="w-5 h-5 mr-2" />
                <h4 className="font-medium">
                  Looks like no one was marked present on this day.
                </h4>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default AttendanceDisplay;
