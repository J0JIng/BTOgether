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

const ResalePriceChart = () => {
  // Sample data (replace with actual resale price data)
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Resale Price",
        data: [300000, 320000, 310000, 330000, 335000, 670000],
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const options = {
    scales: {
      x: {
        type: "category",
        labels: data.labels,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ResalePriceChart;
