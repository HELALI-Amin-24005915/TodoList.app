import React, { useContext } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { TodoContext } from '../../contexts/TodoContext';
import { ETAT_TERMINE } from '../../utils/constants';
import './Header.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Header = ({ onToggleView, isFolderView }) => {
  // get tasks from context to calculate stats for the header
  const { tasks } = useContext(TodoContext);

  // calculate stats for the header
  const totalTasks = tasks.length;
  const unfinishedTasks = tasks.filter(task => !ETAT_TERMINE.includes(task.etat)).length;

  // prepare data for the doughnut chart and count tasks by status
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.etat] = (acc[task.etat] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          '#36A2EB', // new (Blue)
          '#FFCE56', // in progress (Yellow)
          '#4BC0C0', // successful (Teal)
          '#FF6384', // abandoned (Red)
          '#9966FF'  // pending (Purple)
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false } 
    },
    maintainAspectRatio: false
  };

  return (
    <header className="header">
      <div className="header-brand">
        <h1>Gestion de tâches</h1>
        <button className="btn btn-outline-primary ms-3" onClick={onToggleView}>
          {isFolderView ? 'Voir les tâches' : 'Gérer les dossiers'}
        </button>
      </div>

      <div className="header-stats">
        <div className="stats-text">
          <p><strong>Tâches totales :</strong> {totalTasks}</p>
          <p><strong>Tâches non terminées :</strong> {unfinishedTasks}</p>
        </div>
        
        <div className="stats-chart">
          {totalTasks > 0 ? (
            <Doughnut data={chartData} options={chartOptions} />
          ) : (
            <p className="text-muted small">Aucune donnée disponible</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;