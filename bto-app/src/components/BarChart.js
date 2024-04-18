import { getDistanceFromLatLonInKm } from "../utils/GetDistanceFromLatLonInKm";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  Title,
  CategoryScale,
  LinearScale,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title
);

const ResalePriceChart = ({ title }) => {
  // Sample data (replace with actual resale price data)

  let data = null;

  // Conditionally set data based on the description
  if (title === "Historical HDB Price") {
    data = {
      labels: ["2016", "2017", "2018", "2019", "2020", "2021"],
      datasets: [
        {
          label: "National Average of HDB Resale Prices",
          data: [438838, 443888, 441282, 432137, 452248, 490691],
          fill: true,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  } else if (title === "Historical BTO Price") {
    // Define another data object based on a different condition
    data = {
      labels: ["2016", "2017", "2018", "2019", "2020", "2021"],
      datasets: [
        {
          label: "National Average of BTO Resale Prices",
          data: [244187, 237625, 285708, 298812, 270000, 288125],
          fill: true,
          borderColor: "rgb(192, 75, 192)",
          tension: 0.1,
        },
      ],
    };
  }

  // Chart options
  const options = {
    scales: {
      x: {
        type: "category",
        labels: data.labels,
      },
      y: {
        suggestedMin: 0, // Minimum value for the y-axis
        suggestedMax: 650000, // Maximum value for the y-axis
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ResalePriceChart;
