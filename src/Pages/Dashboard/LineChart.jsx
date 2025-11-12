// LineChart.jsx
import { Spin } from "antd";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { useSummaryQuery } from "../../redux/apiSlices/homeSlice";

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

// Sample/fallback data matching your chart
const sampleRevenueData = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 160000 },
  { month: "Mar", revenue: 170000 },
  { month: "Apr", revenue: 160000 },
  { month: "May", revenue: 200000 },
  { month: "Jun", revenue: 387530 },
  { month: "Jul", revenue: 300000 },
  { month: "Aug", revenue: 200000 },
  { month: "Sep", revenue: 180000 },
  { month: "Oct", revenue: 192670 },
  { month: "Nov", revenue: 230000 },
  { month: "Dec", revenue: 240000 },
];
const LineChart = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [yearFilter, setYearFilter] = useState(currentYear);

  // Call API
  const { data: apiResp, isLoading, isError } = useSummaryQuery();

  // API returns { success, message, data: { January: 0, ... } }
  const monthsOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const revenueData =
    apiResp && apiResp.data
      ? monthsOrder.map((m, idx) => ({
          month: m.slice(0, 3),
          revenue: Number(apiResp.data[m] ?? 0),
        }))
      : sampleRevenueData;

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
          color: "#B91C1C",
        },
        ticks: {
          color: "#B91C1C",
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: false,
        ticks: {
          color: "#B91C1C",
          padding: 32,
          callback: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "250px" }} className="text-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="ml-4 text-xl font-bold text-black">Total Revenue</h2>
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

      {isLoading ? (
        <div
          className="flex items-center justify-center"
          style={{ height: 180 }}
        >
          <Spin tip="Loading revenue..." />
        </div>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default LineChart;
