import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Auto-collapse below 992px on mount + resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) setCollapsed(true);
      else setCollapsed(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="grid grid-cols-12 h-screen">
      {/* Sidebar */}
      <div className="col-span-2 h-full bg-primary overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="col-span-10 flex flex-col">
        {/* Header */}
        <div className="h-[68px] bg-white flex items-center justify-end pr-5">
          <Header />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-7 bg-white rounded-t-3xl">
          <div className="min-w-full overflow-x-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
