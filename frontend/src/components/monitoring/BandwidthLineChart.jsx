import { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/**
 * Real-time bandwidth traffic chart — Winbox/MikroTik inspired dark theme.
 */
const BandwidthLineChart = ({ data }) => {
  const chartRef = useRef(null);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Inbound",
        data: data.inbound,
        borderColor: "#00e676",
        backgroundColor: "rgba(0, 230, 118, 0.08)",
        fill: true,
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#00e676",
        borderWidth: 1.5,
      },
      {
        label: "Outbound",
        data: data.outbound,
        borderColor: "#448aff",
        backgroundColor: "rgba(68, 138, 255, 0.08)",
        fill: true,
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#448aff",
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    interaction: { mode: "index", intersect: false },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Mbps", color: "#94a3b8", font: { size: 11, family: "JetBrains Mono, monospace" } },
        grid: { color: "rgba(148, 163, 184, 0.08)", drawBorder: false },
        ticks: { color: "#64748b", font: { size: 10, family: "JetBrains Mono, monospace" }, padding: 8, maxTicksLimit: 6 },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 9, family: "JetBrains Mono, monospace" }, maxTicksLimit: 8, maxRotation: 0 },
      },
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: "#94a3b8",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          font: { size: 11, family: "JetBrains Mono, monospace" },
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#e2e8f0",
        bodyColor: "#cbd5e1",
        titleFont: { size: 11, family: "JetBrains Mono, monospace" },
        bodyFont: { size: 11, family: "JetBrains Mono, monospace" },
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        boxPadding: 4,
      },
    },
  };

  return (
    <div className="h-72 w-full">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default BandwidthLineChart;
