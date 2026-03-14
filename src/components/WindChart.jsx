import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WindChart = ({ data, darkMode }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window width for responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data || data.length === 0) return <p>No data to display.</p>;

  const sortedData = [...data].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  // Colors
  const gridColor = darkMode ? "#374151" : "#e5e7eb";
  const textColor = darkMode ? "#E5E7EB" : "#111827";
  const tooltipBg = darkMode ? "#1f2937" : "#ffffff";
  const tooltipText = darkMode ? "#E5E7EB" : "#111827";
  const chartBg = darkMode ? "#1f2937" : "#ffffff";

  // Mobile responsive settings
  const isMobile = windowWidth < 500;
  const xAxisInterval = isMobile
    ? Math.max(1, Math.floor(sortedData.length / 4))
    : Math.max(1, Math.floor(sortedData.length / 10));
  const xAxisFontSize = isMobile ? 10 : 12;
  const xAxisLabelOffset = isMobile ? 35 : 20;
  const xAxisTickAngle = isMobile ? -45 : 0;
  const xAxisTickAnchor = isMobile ? "end" : "middle";
  const chartHeight = isMobile ? 300 : 400;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
          style={{
            backgroundColor: chartBg,
            borderRadius: 8,
            transition: "background-color 0.5s",
          }}
        >
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />

          <XAxis
            dataKey="startTime"
            tickFormatter={(time) =>
              new Date(time).toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
              })
            }
            interval={xAxisInterval}
            tick={{
              fill: textColor,
              fontSize: xAxisFontSize,
              angle: xAxisTickAngle,
              textAnchor: xAxisTickAnchor,
            }}
            label={{
              value: "Target Time End (UTC)",
              position: "bottom",
              offset: xAxisLabelOffset,
              style: { textAnchor: "middle", fontWeight: "bold", fontSize: xAxisFontSize, fill: textColor },
            }}
          />

          <YAxis
            tick={{ fill: textColor, fontSize: xAxisFontSize }}
            label={{
              value: "Power (MW)",
              angle: -90,
              position: "insideLeft",
              offset: -20,
              style: { textAnchor: "middle", fontWeight: "bold", fill: textColor, fontSize: xAxisFontSize },
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderRadius: "8px",
              border: "none",
              color: tooltipText,
            }}
            labelFormatter={(time) =>
              new Date(time).toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
              })
            }
            formatter={(value, name) => {
              if (name === "Actual") return [`${value} MW`, "Actual"];
              if (name === "Forecast") return [`${value} MW`, "Forecast"];
              return [`${value} MW`, name];
            }}
          />

          <Legend
              verticalAlign={isMobile ? "top" : "top"} // bottom on mobile, top on desktop
              align="center"
              wrapperStyle={{
                color: textColor,
                fontSize: isMobile ? 10 : 12,
                marginTop: isMobile ? -10 : -10,
                padding: "0 5px",
                display: "flex",
                justifyContent: "center",
                flexWrap: isMobile ? "wrap" : "nowrap",
              }}
              iconType="circle" // small circles instead of squares
                  />

          <Line
            type="monotone"
            dataKey="actualGeneration"
            stroke="#0074D9"
            dot={false}
            name="Actual"
          />
          <Line
            type="monotone"
            dataKey="forecastGeneration"
            stroke="#2ECC40"
            dot={false}
            name="Forecast"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WindChart;