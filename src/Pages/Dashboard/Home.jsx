import React, { useState } from "react";
import { FaCalendarDay, FaDollarSign } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { MdArrowUpward, MdOutlineHome } from "react-icons/md";
import { PiHouseLine } from "react-icons/pi";
import { Bar } from "react-chartjs-2";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import OrderTable from "../../components/home/OrderTable";
import SalesLeaderBoard from "../../components/home/SalesLeaderBoard";
import HomeCard from "../../components/home/HomeCard";
import { Marchant, Revenue } from "../../components/common/Svg";
import { People } from "../../components/common/Svg";
import { Pending } from "../../components/common/Svg";
import { SubscriptionManagement } from "../../components/common/Svg";
import { Sales } from "../../components/common/Svg";
import { Points } from "../../components/common/Svg";
import PieChart from "./PieChart";
import RevenueLineChart from "./LineChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Last 7 Days");

  const options2 = ["Today", "Last 7 Days", "Last 30 Days", "This Month"];

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Subscriptions",
        data: [64, 27, 83, 90, 87, 85, 70, 40, 32, 74, 65, 70],
        backgroundColor: "#3FC7EE",
        borderColor: "#A1A1A1",
        borderWidth: 1,
        barThickness: 24,
        maxBarThickness: 24,
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
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: "#A1A1A1",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          suggestedMin: 0,
          suggestedMax: 100,
        },
        grid: {
          display: true,
          lineWidth: 2,
        },
      },
    },
  };

  return (
    <div className="">
      <div className="flex flex-col xl:flex-row gap-10 rounded-lg">
        {/* Pie Chart Section */}
        <div className="border border-primary rounded-lg xl:w-2/3">
          <RevenueLineChart />
        </div>

        {/* Card Section */}
        <div className="w-full xl:w-1/3 border border-primary p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4 text-white">
            <h2 className="text-secondary mt-4 text-[24px] font-bold">
              Statistics
            </h2>
            <div className="relative inline-block w-[150px]">
              {/* Dropdown Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full font-medium text-[14px] py-[12px] px-[16px] border border-primary text-secondary rounded-lg text-left flex justify-between items-center"
              >
                {selected}
                <span className="ml-2">▼</span>
              </button>

              {/* Dropdown Options */}
              {isOpen && (
                <ul className="absolute z-10 w-full bg-white border border-primary rounded-lg mt-1 shadow-lg">
                  {options2.map((option) => (
                    <li
                      key={option}
                      onClick={() => {
                        setSelected(option);
                        setIsOpen(false);
                      }}
                      className="cursor-pointer px-4 py-2 text-black hover:bg-primary/10"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-auto">
            <div className="bg-white border border-primary rounded-lg flex items-center justify-center p-4">
              <div className="flex flex-col items-baseline">
                <h2 className="text-[16px] font-semibold mb-1">
                  Total Report Submit
                </h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <Sales className="w-[20px] h-[20px] text-secondary" />
                  $4000
                </h3>
              </div>
            </div>

            <div className="bg-white border border-primary rounded-lg flex items-center justify-center p-4">
              <div className="flex flex-col items-baseline">
                <h2 className="text-[16px] font-semibold mb-1">Total User</h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <People className="w-[20px] h-[20px] text-secondary" />
                  50
                </h3>
              </div>
            </div>

            <div className="bg-white border border-primary rounded-lg flex items-center justify-center p-4">
              <div className="flex flex-col items-baseline">
                <h2 className="text-[16px] font-semibold mb-1">
                  Total Report Pending
                </h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <Points className="w-[20px] h-[20px] text-secondary" />
                  8,500
                </h3>
              </div>
            </div>

            <div className="bg-white border border-primary rounded-lg flex items-center justify-center p-4">
              <div className="flex flex-col items-baseline">
                <h2 className="text-[16px] font-semibold mb-1">
                  Total Revenue
                </h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <Revenue className="w-[20px] h-[20px] text-secondary" />
                  23
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Table */}
      <div>
        <OrderTable />
      </div>
    </div>
  );
};

export default Home;
