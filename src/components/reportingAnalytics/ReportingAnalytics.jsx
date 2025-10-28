import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, Download } from "lucide-react";

// Sample data matching the chart
const data = [
  { date: "Jan", revenue: 65, submission: 40 },
  { date: "Feb", revenue: 28, submission: 28 },
  { date: "Mar", revenue: 35, submission: 38 },
  { date: "Apr", revenue: 28, submission: 42 },
  { date: "May", revenue: 42, submission: 70 },
  { date: "Jun", revenue: 22, submission: 95 },
  { date: "Jul", revenue: 58, submission: 88 },
  { date: "Aug", revenue: 25, submission: 40 },
  { date: "Sep", revenue: 58, submission: 82 },
  { date: "Oct", revenue: 55, submission: 32 },
  { date: "Nov", revenue: 88, submission: 62 },
  { date: "Dec", revenue: 42, submission: 85 },
];

// Custom 3D-like Bar component
const Custom3DBar = ({ fill, ...props }) => {
  const { x, y, width, height } = props;
  const depth = 6;
  
  return (
    <g>
      {/* Main bar */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        opacity={0.9}
      />
      {/* Top face */}
      <polygon
        points={`${x},${y} ${x + depth},${y - depth} ${x + width + depth},${y - depth} ${x + width},${y}`}
        fill={fill}
        opacity={0.6}
      />
      {/* Right face */}
      <polygon
        points={`${x + width},${y} ${x + width + depth},${y - depth} ${x + width + depth},${y + height - depth} ${x + width},${y + height}`}
        fill={fill}
        opacity={0.4}
      />
    </g>
  );
};

export default function MonthlyStatsDashboard() {
  const [selectedRange, setSelectedRange] = useState("February 2025");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dateRangeOptions = [
    "January 2025",
    "February 2025", 
    "March 2025",
    "April 2025",
    "May 2025",
    "June 2025"
  ];

  return (
    <div className="w-full max-w-6xl mx-auto  min-h-screen">
      {/* Header with Date Range Selector */}
      <div className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="relative inline-block">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between min-w-[200px]"
            >
              <span>{selectedRange}</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedRange(option);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Bar Chart</h2>
          {/* <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Download className="h-4 w-4" />
            Export
          </button> */}
        </div>
        
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="25%"
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              <Bar 
                dataKey="revenue" 
                fill="#6366f1" 
                name="Revenue"
                shape={Custom3DBar}
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="submission" 
                fill="#FFAE4C" 
                name="Submission"
                shape={Custom3DBar}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table Section */}
      {/* <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Data</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.submission}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}