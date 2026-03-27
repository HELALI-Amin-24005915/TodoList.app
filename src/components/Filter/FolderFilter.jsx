import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import { FaFolderOpen } from 'react-icons/fa';
import { TodoContext } from '../../contexts/TodoContext';

const FolderFilter = ({
  folderFilterMode,
  selectedFolderIds,
  includeNoFolder,
  onShowAllFolders,
  onToggleFolder,
  onToggleIncludeNoFolder,
  onSelectSingleFolder,
}) => {
  const { folders } = useContext(TodoContext);

  const selectedCount = selectedFolderIds.length + (includeNoFolder ? 1 : 0);

  return (
    <section className="filter-container" aria-labelledby="folder-filter-legend">
      <fieldset className="filter-fieldset">
        <legend id="folder-filter-legend" className="filter-label d-flex align-items-center gap-2"><FaFolderOpen /> Filtrer par dossier</legend>

        <ul className="filter-actions d-flex flex-wrap gap-2 mb-2" aria-label="Actions de filtre dossier">
          <li>
            <button
              type="button"
              className={`btn btn-sm ${folderFilterMode === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={onShowAllFolders}
            >
              Tous
            </button>
          </li>
          <li className="folder-filter-count small text-muted align-self-center">
            {folderFilterMode === 'ALL' ? 'Aucun filtre dossier actif' : `${selectedCount} filtre(s) actif(s)`}
          </li>
        </ul>

        <Form.Check
          id="folder-filter-none"
          type="checkbox"
          className="filter-check"
          label="Taches sans dossier"
          checked={includeNoFolder}
          onChange={onToggleIncludeNoFolder}
        />

        <ul className="filter-checkbox-list mt-2">
          {folders.map((folder) => {
            const isChecked = selectedFolderIds.includes(folder.id);
            return (
              <li key={folder.id} className="folder-filter-item d-flex align-items-center justify-content-between gap-2">
                <Form.Check
                  id={`folder-filter-${folder.id}`}
                  type="checkbox"
                  className="filter-check"
                  label={folder.title}
                  checked={isChecked}
                  onChange={() => onToggleFolder(folder.id)}
                />
                <button
                  type="button"
                  className="folder-filter-single-btn btn btn-sm btn-outline-primary"
                  onClick={() => onSelectSingleFolder(folder.id)}
                  aria-label={`Filtrer uniquement sur ${folder.title}`}
                >
                  Seulement
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </section>
  );
};

export default FolderFilter;