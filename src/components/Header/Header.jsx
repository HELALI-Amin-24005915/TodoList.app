/**
 * @fileoverview Header module for global navigation and status analytics.
 * It renders task counters, a doughnut summary chart, mobile actions,
 * and startup reset confirmation.
 */
import React, { useContext, useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Offcanvas, Button, Modal } from 'react-bootstrap';
import { FaBars, FaListCheck, FaFolderOpen, FaPlus } from 'react-icons/fa6';
import { TodoContext } from '../../contexts/TodoContext';
import { ETAT_TERMINE } from '../../utils/constants';
import './Header.css';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Top header component displaying statistics, view navigation,
 * mobile off-canvas actions, and startup reset modal.
 *
 * @param {Object} props - Component props.
 * @param {function(): void} props.onCreateTask - Opens task creation flow.
 * @param {function(): void} props.onCreateFolder - Opens folder creation flow.
 * @returns {JSX.Element} Header UI.
 */
const Header = ({ onCreateTask, onCreateFolder }) => {
  // get tasks from context to calculate stats for the header
  const {
    tasks,
    currentView,
    goToTasksView,
    goToFoldersView,
    resetFromBackup,
  } = useContext(TodoContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const isFolderView = currentView === 'folders';

  useEffect(() => {
    setIsResetModalOpen(true);
  }, []);

  const handleToggleView = () => {
    if (isFolderView) goToTasksView();
    else goToFoldersView();
  };

  const closeResetModal = () => {
    setIsResetModalOpen(false);
  };

  const handleResetAll = () => {
    resetFromBackup();
    setIsResetModalOpen(false);
    setIsMenuOpen(false);
  };

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
          '#36A2EB', 
          '#FFCE56', 
          '#4BC0C0', 
          '#FF6384', 
          '#9966FF' 
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
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <button className="btn btn-outline-primary ms-3 header-toggle-view" onClick={handleToggleView}>
            {isFolderView ? 'Voir les tâches' : 'Gérer les dossiers'}
          </button>
        </div>
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
                goToTasksView();
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
                goToFoldersView();
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

      <Modal
        show={isResetModalOpen}
        onHide={closeResetModal}
        centered
        className="header-reset-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Reinitialiser les donnees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Voulez-vous reinitialiser les taches, dossiers et relations des le lancement ?
          <br />
          <span className="text-muted">Si vous confirmez, les donnees seront rechargees depuis la sauvegarde initiale.</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeResetModal}>
            Non, continuer
          </Button>
          <Button variant="danger" onClick={handleResetAll}>
            Oui, reinitialiser
          </Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
};

export default Header;