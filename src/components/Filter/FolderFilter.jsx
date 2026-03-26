import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import { FaFolderOpen } from 'react-icons/fa';
import { TodoContext } from '../../contexts/TodoContext';

const FolderFilter = ({ currentFolder, onFolderChange }) => {
  const { folders } = useContext(TodoContext);

  return (
    <div className="filter-container">
      <Form.Group controlId="taskFolderFilter">
        <Form.Label className="filter-label d-flex align-items-center gap-2"><FaFolderOpen /> Filtrer par dossier</Form.Label>
        <Form.Select 
          value={currentFolder} 
          onChange={(e) => onFolderChange(e.target.value)}
          size="sm"
          className="filter-select shadow-sm"
        >
          <option value="ALL">Tous les dossiers</option>
          <option value="NONE">Tâches sans dossier</option>
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>
              {folder.title}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  );
};

export default FolderFilter;