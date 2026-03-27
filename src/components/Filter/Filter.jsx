/**
 * @fileoverview Task-status filtering controls.
 * Exposes multi-select status filters, presets, and overdue visibility toggles.
 */
import React from 'react';
import { Form } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';
import { ETATS } from '../../utils/constants';
import './Filter.css';

/**
 * Status filter panel used by the task list.
 * It is stateless and delegates all changes to parent callbacks.
 *
 * @param {Object} props - Component props.
 * @param {string[]} props.selectedStatuses - Currently selected task statuses.
 * @param {function(string): void} props.onToggleStatus - Toggles one status in the active selection.
 * @param {function(): void} props.onApplyActiveOnlyPreset - Applies the "active statuses" preset.
 * @param {function(): void} props.onSelectAllStatuses - Selects all available statuses.
 * @param {boolean} props.hideOverdue7Plus - Whether tasks overdue by more than 7 days are hidden.
 * @param {function(): void} props.onToggleHideOverdue - Toggles overdue-task visibility.
 */
const Filter = ({
  selectedStatuses,
  onToggleStatus,
  onApplyActiveOnlyPreset,
  onSelectAllStatuses,
  hideOverdue7Plus,
  onToggleHideOverdue,
}) => {
  const allStatuses = Object.values(ETATS);

  return (
    <section className="filter-container" aria-labelledby="status-filter-legend">
      <fieldset className="filter-fieldset">
        <legend id="status-filter-legend" className="filter-label d-flex align-items-center gap-2"><FaFilter /> Filtrer par statut</legend>

        <ul className="filter-checkbox-list">
          {allStatuses.map((status) => (
            <li key={status} className="filter-check-item">
              <Form.Check
                id={`status-filter-${status}`}
                type="checkbox"
                className="filter-check"
                label={status}
                checked={selectedStatuses.includes(status)}
                onChange={() => onToggleStatus(status)}
              />
            </li>
          ))}
        </ul>

        <ul className="filter-actions d-flex flex-wrap gap-2 mt-2" aria-label="Actions de filtres statuts">
          <li>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={onApplyActiveOnlyPreset}
            >
              Preset: En cours
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={onSelectAllStatuses}
            >
              Tous les états
            </button>
          </li>
        </ul>

        <Form.Check
          id="hide-overdue-7-plus"
          type="switch"
          className="filter-overdue-toggle mt-3"
          label="Masquer echeues > 7 jours"
          checked={hideOverdue7Plus}
          onChange={onToggleHideOverdue}
        />
      </fieldset>
    </section>
  );
};

export default Filter;