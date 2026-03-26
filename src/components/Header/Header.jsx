import React, { useContext, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Offcanvas, Button } from 'react-bootstrap';
import { FaBars, FaListCheck, FaFolderOpen, FaPlus } from 'react-icons/fa6';
import { TodoContext } from '../../contexts/TodoContext';
import { ETAT_TERMINE } from '../../utils/constants';
import './Header.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Header = ({ onToggleView, isFolderView, onCreateTask, onCreateFolder, onGoTasks, onGoFolders }) => {
  // get tasks from context to calculate stats for the header
  const { tasks } = useContext(TodoContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="header-mobile-actions">
        <button
          type="button"
          className="header-burger btn btn-outline-primary"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <FaBars />
        </button>
      </div>

      <div className="header-brand">
        <h1>Gestion de tâches</h1>
        <button className="btn btn-outline-primary ms-3 header-toggle-view" onClick={onToggleView}>
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

      <Offcanvas
        show={isMenuOpen}
        onHide={() => setIsMenuOpen(false)}
        placement="start"
        className="header-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-grid gap-2">
            <Button
              variant={isFolderView ? 'outline-primary' : 'primary'}
              className="d-flex align-items-center justify-content-between"
              onClick={() => {
                if (typeof onGoTasks === 'function') onGoTasks();
                else if (typeof onToggleView === 'function' && isFolderView) onToggleView();
                setIsMenuOpen(false);
              }}
            >
              <span className="d-inline-flex align-items-center gap-2">
                <FaListCheck /> Tâches
              </span>
            </Button>

            <Button
              variant={isFolderView ? 'primary' : 'outline-primary'}
              className="d-flex align-items-center justify-content-between"
              onClick={() => {
                if (typeof onGoFolders === 'function') onGoFolders();
                else if (typeof onToggleView === 'function' && !isFolderView) onToggleView();
                setIsMenuOpen(false);
              }}
            >
              <span className="d-inline-flex align-items-center gap-2">
                <FaFolderOpen /> Dossiers
              </span>
            </Button>

            <div className="mt-2 text-muted small">Créer</div>

            <Button
              variant="outline-secondary"
              className="d-flex align-items-center justify-content-between"
              onClick={() => {
                if (typeof onCreateTask === 'function') onCreateTask();
                setIsMenuOpen(false);
              }}
            >
              <span className="d-inline-flex align-items-center gap-2">
                <FaPlus /> Nouvelle tâche
              </span>
            </Button>

            <Button
              variant="outline-secondary"
              className="d-flex align-items-center justify-content-between"
              onClick={() => {
                if (typeof onCreateFolder === 'function') onCreateFolder();
                setIsMenuOpen(false);
              }}
            >
              <span className="d-inline-flex align-items-center gap-2">
                <FaPlus /> Nouveau dossier
              </span>
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Header;