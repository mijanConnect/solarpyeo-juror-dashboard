import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [chartHeight, setChartHeight] = useState("200px");

  // Effect to update chart height based on screen size
  useEffect(() => {
    const updateChartHeight = () => {
      if (window.innerWidth < 768) setChartHeight("150px");
      else if (window.innerWidth < 1024) setChartHeight("200px");
      else setChartHeight("250px");
    };

    updateChartHeight();
    window.addEventListener("resize", updateChartHeight);
    return () => window.removeEventListener("resize", updateChartHeight);
  }, []);

  // 7-day raw data
  const rawData = [50, 70, 100, 80, 40, 60, 90];

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Sale",
        data: rawData, // Use actual values
        backgroundColor: "#3fae6a",
        borderRadius: 0,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // Show raw value only
          label: (context) => `${context.raw}`,
        },
        backgroundColor: "#3fae6a",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 0,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#181818",
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#eaeaea",
        },
        ticks: {
          color: "#181818",
        },
      },
    },
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
        <div className="flex justify-between items-center text-white w-full">
          <h2 className="text-secondary mt-4 text-[24px] font-bold">
            Customer Chart
          </h2>
          <p className="font-medium text-[14px] py-[12px] px-[16px] border border-primary text-secondary rounded-lg">
            Last 7 Days
          </p>
        </div>
      </div>
      <div style={{ width: "100%", height: chartHeight }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
