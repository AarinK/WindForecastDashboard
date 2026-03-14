const API_URL = import.meta.env.VITE_API_URL;

export const getWindData = async (startDate, endDate, horizon) => {
  const response = await fetch(`${API_URL}/wind?horizon=${horizon}`);
  const data = await response.json();

  // Fill missing forecasts using last known forecast within horizon
  let lastForecast = null;
  const filledData = data
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .map((d) => {
      if (d.forecastGeneration !== null) {
        lastForecast = d.forecastGeneration;
      }
      return {
        ...d,
        forecastGeneration: d.forecastGeneration !== null ? d.forecastGeneration : lastForecast,
      };
    });

  // Filter by selected date range
  return filledData.filter(
    (d) => d.startTime >= startDate && d.startTime <= endDate
  );
};