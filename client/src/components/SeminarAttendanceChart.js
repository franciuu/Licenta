import { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getSeminarAttendancePercentageForCourse } from "../services/AttendanceService";
import useAxiosCustom from "../hooks/useAxiosCustom";

const SeminarAttendanceChart = ({
  selectedCourse,
  setSelectedCourse,
  courses,
  className,
}) => {
  const [barData, setBarData] = useState([]);
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchBarChart = async () => {
      if (!selectedCourse) return;
      try {
        const barData = await getSeminarAttendancePercentageForCourse(
          axiosCustom,
          selectedCourse
        );
        setBarData(barData);
      } catch (error) {
        console.error("Failed to fetch bar chart data", error);
      }
    };

    fetchBarChart();
  }, [axiosCustom, selectedCourse]);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col ${className}`}
    >
      <div className="px-3 pt-3 pb-1 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-700">
          Seminar Attendance Comparison
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="text-xs bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          {courses.map((c) => (
            <option key={c.uuid} value={c.uuid}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 p-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={barData}
            margin={{ top: 10, right: 5, bottom: 20, left: 5 }}
          >
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tickFormatter={(name) => name.split(" ").pop()}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              height={20}
              angle={-30}
              textAnchor="end"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              width={25}
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
            <Bar
              dataKey="percentage"
              barSize={16}
              fill="#8E24AA"
              radius={[3, 3, 0, 0]}
              label={{
                position: "top",
                formatter: (value) => `${value}%`,
                fill: "#6B7280",
                fontSize: 9,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#9CA3AF"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="3 3"
              strokeOpacity={0.6}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeminarAttendanceChart;
