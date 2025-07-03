// frontend/src/components/ComparisonChart.jsx
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ComparisonChart() {
  const { createdVsCompleted, isLoading } = useSelector((state) => state.stats);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Tasks Created vs. Completed (Last 7 Days)' },
    },
    scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  const data = {
    labels: createdVsCompleted.labels,
    datasets: [
      {
        label: 'Tasks Created',
        data: createdVsCompleted.createdData,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Tasks Completed',
        data: createdVsCompleted.completedData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  if (isLoading) return null;

  return <Bar options={options} data={data} />;
}

export default ComparisonChart;