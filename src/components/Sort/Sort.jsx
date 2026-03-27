import React from 'react';
import { Form } from 'react-bootstrap';
import { FaSort } from 'react-icons/fa';
import './Sort.css';


const Sort = ({ currentSort, onSortChange }) => {
  return (
    <section className="sort-container" aria-labelledby="sort-legend">
      <fieldset className="sort-fieldset">
        <legend id="sort-legend" className="sort-label d-flex align-items-center gap-2"><FaSort /> Trier par :</legend>
        <Form.Select 
          value={currentSort} 
          onChange={(e) => onSortChange(e.target.value)}
          size="sm"
          className="sort-select"
        >
          <option value="date_echeance_desc">Date d'échéance (Plus récente)</option>
          <option value="date_echeance_asc">Date d'échéance (Plus lointaine)</option>
          <option value="name_asc">Nom de la tâche (A-Z)</option>
          <option value="date_creation_desc">Date de création (Plus récente)</option>
        </Form.Select>
      </fieldset>
    </section>
  );
};

export default Sort;