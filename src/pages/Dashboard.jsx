import React, { useState, useEffect } from "react";
import DatePicker from "../components/DatePicker";
import Slider from "../components/Slider";
import WindChart from "../components/WindChart";
import { getWindData } from "../services/WindService";

const Dashboard = () => {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-07");
  const [horizon, setHorizon] = useState(4);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const result = await getWindData(startDate, endDate, horizon);
        setData(result);
      } catch (err) {
        console.error("Error fetching wind data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
  }, [startDate, endDate, horizon]);

  // Calculate MAE (Mean Absolute Error)
  const mae =
  data && data.length > 0
    ? (
        data
          .filter(d => d.actualGeneration != null && d.forecastGeneration != null) // ignore missing
          .reduce(
            (sum, d) => sum + Math.abs(d.actualGeneration - d.forecastGeneration),
            0
          ) /
        data.filter(d => d.actualGeneration != null && d.forecastGeneration != null).length
      ).toFixed(2)
    : 0;  

  // Inline SVGs
  const SunIcon = () => (
    <svg
      className="w-5 h-5 animate-pulse"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 4.636M12 7a5 5 0 100 10 5 5 0 000-10z"
      />
    </svg>
  );

  const MoonIcon = () => (
    <svg
      className="w-5 h-5 animate-pulse"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  );

  return (
    <div
      className={`min-h-screen p-4 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">UK Wind Forecast Dashboard</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 shadow-md"
        >
          {darkMode ? (
            <>
              <SunIcon /> Light Mode
            </>
          ) : (
            <>
              <MoonIcon /> Dark Mode
            </>
          )}
        </button>
      </div>

      {/* Controls Panel */}
      <div
        className={`flex flex-wrap gap-4 mb-4 p-4 rounded-xl shadow-md transition-colors duration-500
        ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
      >
        <DatePicker value={startDate} onChange={setStartDate} label="Start Date" darkMode={darkMode} />
        <DatePicker value={endDate} onChange={setEndDate} label="End Date" darkMode={darkMode} />
        <Slider value={horizon} onChange={setHorizon} min={0} max={48} />

        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium">MAE: {mae} GW</span>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex justify-center items-center mt-8">
    <svg
      className="animate-spin h-12 w-12 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  </div>
      ) : (
        <div
          className={`bg-gray-800 dark:bg-gray-800 p-4 rounded-xl shadow-md transition-colors duration-500`}
        >
          <WindChart data={data} darkMode={darkMode} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;