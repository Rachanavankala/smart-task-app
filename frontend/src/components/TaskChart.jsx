// frontend/src/components/TaskChart.jsx
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TaskChart() {
  const { data: statsData, isLoading } = useSelector((state) => state.stats);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Tasks Completed in Last 7 Days' },
    },
  };

  const data = {
    labels: statsData.map(d => d.date),
    datasets: [
      {
        label: 'Tasks Completed',
        data: statsData.map(d => d.count),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  if (isLoading) return null; // Don't show chart while loading

  return <Bar options={options} data={data} />;
}

export default TaskChart;