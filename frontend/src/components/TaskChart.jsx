// frontend/src/components/TaskChart.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

// REGISTER all elements required for line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,    // REQUIRED
  LineElement,     // REQUIRED
  Title,
  Tooltip,
  Legend
);

function TaskChart() {
  const { data: statsData, isLoading } = useSelector((state) => state.stats);

  if (isLoading || !statsData?.length) return null;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Tasks Completed in Last 7 Days',
      },
    },
  };

  const data = {
    labels: statsData.map((d) => d.date),
    datasets: [
      {
        label: 'Tasks Completed',
        data: statsData.map((d) => d.count),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
      },
    ],
  };

  return <Line options={options} data={data} />;
}

export default TaskChart;
