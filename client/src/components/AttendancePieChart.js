import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { getAttendancePercentageForLecture } from "../services/AttendanceService";
import useAxiosCustom from "../hooks/useAxiosCustom";

const AttendancePieChart = ({
  selectedLecture,
  setSelectedLecture,
  lectures,
  className,
}) => {
  const [pieData, setPieData] = useState([]);
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchPieData = async () => {
      if (!selectedLecture) return;
      try {
        const pieData = await getAttendancePercentageForLecture(
          axiosCustom,
          selectedLecture
        );
        setPieData(pieData);
      } catch (error) {
        console.error("Failed to fetch attendance percentage", error);
      }
    };

    fetchPieData();
  }, [axiosCustom, selectedLecture]);

  const COLORS = ["#8e44ad", "#ce98e6"];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="10"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col ${className}`}
    >
      <div className="px-3 pt-3 pb-1 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-700">
          Course Attendance
        </div>
        <select
          value={selectedLecture}
          onChange={(e) => setSelectedLecture(e.target.value)}
          className="text-xs bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          {lectures.map((l) => (
            <option key={l.uuid} value={l.uuid}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 p-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "#4B5563", fontSize: "11px" }}>
                  {value}
                </span>
              )}
            />
            <Pie
              data={pieData}
              cx="40%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={({ viewBox }) =>
                Math.min(viewBox.width, viewBox.height) / 4.5
              }
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendancePieChart;
