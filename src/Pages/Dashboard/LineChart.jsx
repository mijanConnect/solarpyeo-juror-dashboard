// LineChart.jsx
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// import { useGetRevenueQuery } from "../../redux/apiSlices/homeSlice";

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

// Sample data matching your chart
const revenueData = [
  { month: "Jan", revenue: 120000, label: "Jan" },
  { month: "Feb", revenue: 160000, label: "Feb" },
  { month: "Mar", revenue: 170000, label: "Mar" },
  { month: "Apr", revenue: 160000, label: "Apr" },
  { month: "May", revenue: 200000, label: "May" },
  {
    month: "Jun",
    revenue: 387530,
    label: "Jun",
    isHighlight: true,
    value: "$387,530.00",
  },
  { month: "Jul", revenue: 300000, label: "Jul" },
  { month: "Aug", revenue: 200000, label: "Aug" },
  { month: "Sep", revenue: 180000, label: "Sep" },
  {
    month: "Oct",
    revenue: 192670,
    label: "Oct",
    isHighlight: true,
    value: "$192,670.00",
  },
  { month: "Nov", revenue: 230000, label: "Nov" },
  { month: "Dec", revenue: 240000, label: "Dec" },
];
const LineChart = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [yearFilter, setYearFilter] = useState(currentYear);

  const data = {
    labels: revenueData.map((item) => item.month),
    datasets: [
      {
        label: "Total Revenue",
        data: revenueData.map((item) => item.revenue),
        fill: false,
        borderColor: "#B91C1C",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
        pointBorderColor: "#B91C1C",
        pointBackgroundColor: "#B91C1C",
        pointRadius: 4,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: "#ooo",
        },
      },
      tooltip: {
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#B91C1C",
        borderWidth: 2,
        backgroundColor: "#B91C1C",
        padding: 15,
        cornerRadius: 8,
        displayColors: false,
        bodyFont: {
          size: 16,
        },
        boxPadding: 10,
        callbacks: {
          label: (context) =>
            `$${context.raw.toLocaleString()}`.padEnd(15, " "),
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "#000",
        },
        ticks: {
          color: "#000",
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: false,
        ticks: {
          color: "#000",
          padding: 32,
          callback: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "250px" }} className="text-white">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-xl font-bold text-white">Total Revenue</h2>
        {/* <select
          className="px-4 py-2 text-white bg-transparent border-2 rounded-lg outline-"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year} className="text-black">
              {year}
            </option>
          ))}
        </select> */}
      </div>

      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
