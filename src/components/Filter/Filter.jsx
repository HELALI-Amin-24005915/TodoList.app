import React from 'react';
import { Form } from 'react-bootstrap';
import { ETATS } from '../../utils/constants';
import './Filter.css';

/**
 * Filter Component
 * This component displays a dropdown to filter tasks by their status.
 * It uses React-Bootstrap for styling.
 * * @param {string} currentFilter - The currently selected filter value
 * @param {function} onFilterChange - Callback function to update the filter state in the parent
 */
const Filter = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="filter-container">
      <Form.Group controlId="taskStatusFilter">
        <Form.Label className="filter-label">Filtrer par statut</Form.Label>
        <Form.Select 
          value={currentFilter} 
          onChange={(e) => onFilterChange(e.target.value)}
          size="sm"
          className="filter-select"
        >
          {/* Default view according to project specs */}
          <option value="ACTIVE_ONLY">Tâches en cours</option>
          <option value="ALL">Toute les tâches</option>
                    
          <option value={ETATS.NOUVEAU}>Nouveau</option>
          <option value={ETATS.EN_COURS}>En cours</option>
          <option value={ETATS.EN_ATTENTE}>En attente</option>
          <option value={ETATS.REUSSI}>Réussi (Terminé)</option>
          <option value={ETATS.ABANDONNE}>Abandonné</option>
        </Form.Select>
      </Form.Group>
    </div>
  );
};

export default Filter;