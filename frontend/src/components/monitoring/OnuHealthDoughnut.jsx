import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Static doughnut chart showing ONU device health (Up vs Down).
 */
const OnuHealthDoughnut = ({ data }) => {
  const chartData = {
    labels: ["Online (UP)", "Offline (DOWN)"],
    datasets: [
      {
        data: [data.up, data.down],
        backgroundColor: ["#10b981", "#ef4444"],
        borderColor: ["#059669", "#dc2626"],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 16, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const total = data.up + data.down;
  const uptimePercent = total > 0 ? ((data.up / total) * 100).toFixed(1) : 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-52 w-52">
        <Doughnut data={chartData} options={options} />
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800">{uptimePercent}%</span>
          <span className="text-xs text-slate-400">Uptime</span>
        </div>
      </div>
    </div>
  );
};

export default OnuHealthDoughnut;
