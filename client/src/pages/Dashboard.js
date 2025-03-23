// Dashboard.js
import React from "react";
import { Icon } from "@chakra-ui/react";
import { FaTasks, FaUserGraduate, FaChartBar } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Layout from "./Layout";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const lineData = [
    { name: "13/02/2025", value: 590 },
    { name: "20/02/2025", value: 868 },
    { name: "27/02/2025", value: 657 },
    { name: "5/03/2025", value: 390 },
  ];

  const pieData = [
    { name: "Prezenti", value: 75 },
    { name: "Absenti", value: 25 },
  ];

  const barData = [
    { name: "1025", value: 300 },
    { name: "1030", value: 400 },
    { name: "1047", value: 300 },
    { name: "1057", value: 350 },
  ];

  const COLORS = ["#38A169", "#1E4034"];
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
    <Layout>
      <div className={styles.dashboardContainer}>
        <div className={styles.topSection}>
          <div className={styles.greeting}>Hello, Name!</div>
          <div className={styles.statsWrapper}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Nr total activitati</span>
                <Icon as={FaTasks} className={styles.statIcon} />
              </div>
              <div className={styles.statValue}>15</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Nr total studenti</span>
                <Icon as={FaUserGraduate} className={styles.statIcon} />
              </div>
              <div className={styles.statValue}>160</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Prezenta medie</span>
                <Icon as={FaChartBar} className={styles.statIcon} />
              </div>
              <div className={styles.statValue}>80%</div>
            </div>
          </div>
        </div>

        {/* Top Right Section: Pie Chart */}
        <div className={styles.chartPie}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Curs x</div>
            <select className={styles.chartSelect}>
              <option>Select</option>
            </select>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={70}
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

        {/* Bottom Left Section: Bar Chart */}
        <div className={styles.chartSeminar}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Seminar x</div>
            <select className={styles.chartSelect}>
              <option>Select</option>
            </select>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={barData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" barSize={25} fill="#8E24AA" />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#999"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Right Section: Line Chart */}
        <div className={styles.chartActivity}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Activitatea x</div>
            <select className={styles.chartSelect}>
              <option>Select</option>
            </select>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8E24AA"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
