import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAttendanceTrendForActivity } from "../../services/AttendanceService";
import useAxiosCustom from "../../hooks/useAxiosCustom";

const WeeklyAttendanceChart = ({
  selectedActivity,
  setSelectedActivity,
  activities,
  className,
}) => {
  const [lineData, setLineData] = useState([]);
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchLineChart = async () => {
      if (!selectedActivity) return;
      try {
        const lineData = await getAttendanceTrendForActivity(
          axiosCustom,
          selectedActivity
        );
        setLineData(lineData);
      } catch (error) {
        console.error("Failed to fetch line chart data", error);
      }
    };

    fetchLineChart();
  }, [axiosCustom, selectedActivity]);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col ${className}`}
    >
      <div className="px-3 pt-3 pb-1 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-700">
          Weekly Attendance Trend
        </div>
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          className="text-xs bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          {activities.map((a) => (
            <option key={a.uuid} value={a.uuid}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 p-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineData}
            margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "4px",
                fontSize: "11px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                border: "1px solid #E5E7EB",
              }}
            />
            <Line
              type="monotone"
              dataKey="presentCount"
              stroke="#8E24AA"
              strokeWidth={2}
              dot={{ r: 2, fill: "#8E24AA" }}
              activeDot={{ r: 4, fill: "#8E24AA" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyAttendanceChart;
