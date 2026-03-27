/**
 * @fileoverview Main tasks page module.
 * Orchestrates filtering, sorting, and task-card rendering with memoized derivation.
 */
import React, { useContext, useMemo, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { TodoContext } from '../../contexts/TodoContext';
import { ETATS, ETAT_TERMINE } from '../../utils/constants';
import Task from '../Task/Task';

import Filter from '../Filter/Filter';
import Sort from '../Sort/Sort';
import FolderFilter from '../Filter/FolderFilter'; 
import './TodoList.css';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Main tasks page: combines sorting, filters, and memoized task rendering.
 * It reads global state from context and computes display-ready tasks.
 *
 * @returns {JSX.Element} Todo list view.
 */
const TodoList = () => {
    const {
        tasks,
        relations,
        folderFilterMode,
        selectedFolderIds,
        includeNoFolder,
        setFolderFilterAll,
        toggleFolderSelection,
        toggleIncludeNoFolder,
        setOnlyFolderFilter,
    } = useContext(TodoContext);

    const [selectedStatuses, setSelectedStatuses] = useState(() =>
        Object.values(ETATS).filter((etat) => !ETAT_TERMINE.includes(etat))
    );
    const [hideOverdue7Plus, setHideOverdue7Plus] = useState(false);
    const [sortBy, setSortBy] = useState('date_echeance_desc');
    const [searchTerm, setSearchTerm] = useState('');

    const tachesAffichees = useMemo(() => {
        const selectedStatusSet = new Set(selectedStatuses);
        const selectedFolderSet = new Set(selectedFolderIds.map((id) => Number(id)));
        const normalizedSearch = searchTerm.trim().toLowerCase();

        const folderIdsByTask = new Map();
        relations.forEach((relation) => {
            const taskId = relation.tache;
            const folderId = Number(relation.dossier);
            if (!folderIdsByTask.has(taskId)) {
                folderIdsByTask.set(taskId, []);
            }
            folderIdsByTask.get(taskId).push(folderId);
        });

        const now = new Date();

        const filtered = tasks
            .filter((tache) => {
                if (folderFilterMode === 'ALL') return true;

                const taskFolderIds = folderIdsByTask.get(tache.id) || [];
                const hasNoFolder = taskFolderIds.length === 0;
                const inSelectedFolder = taskFolderIds.some((folderId) => selectedFolderSet.has(folderId));

                return (includeNoFolder && hasNoFolder) || inSelectedFolder;
            })
            .filter((tache) => {
                if (selectedStatusSet.size === 0) return true;
                return selectedStatusSet.has(tache.etat);
            })
            .filter((tache) => {
                if (!hideOverdue7Plus) return true;
                if (!tache.date_echeance) return true;

                const dueDate = new Date(tache.date_echeance);
                if (Number.isNaN(dueDate.getTime())) return true;

                const overdueDays = Math.floor((now - dueDate) / DAY_IN_MS);
                return overdueDays <= 7;
            })
            .filter((tache) => {
                if (!normalizedSearch) return true;

                const titleText = (tache.title || '').toLowerCase();
                const descriptionText = (tache.description || '').toLowerCase();
                const equipiersText = Array.isArray(tache.equipiers)
                    ? tache.equipiers.join(' ').toLowerCase()
                    : '';

                return (
                    titleText.includes(normalizedSearch)
                    || descriptionText.includes(normalizedSearch)
                    || equipiersText.includes(normalizedSearch)
                );
            });

        return filtered.sort((a, b) => {
            if (sortBy === 'date_echeance_desc') return new Date(b.date_echeance) - new Date(a.date_echeance);
            if (sortBy === 'date_echeance_asc') return new Date(a.date_echeance) - new Date(b.date_echeance);
            if (sortBy === 'date_creation_desc') return new Date(b.date_creation) - new Date(a.date_creation);
            if (sortBy === 'name_asc') return a.title.localeCompare(b.title);
            return 0;
        });
    }, [
        tasks,
        relations,
        folderFilterMode,
        selectedFolderIds,
        includeNoFolder,
        selectedStatuses,
        hideOverdue7Plus,
        sortBy,
        searchTerm,
    ]);

    const handleToggleStatus = (status) => {
        setSelectedStatuses((prev) => {
            if (prev.includes(status)) {
                return prev.filter((s) => s !== status);
            }
            return [...prev, status];
        });
    };

    const handleApplyActiveOnlyPreset = () => {
        setSelectedStatuses(Object.values(ETATS).filter((etat) => !ETAT_TERMINE.includes(etat)));
    };

    const handleSelectAllStatuses = () => {
        setSelectedStatuses(Object.values(ETATS));
    };

    return (
        <section className="todo-list" aria-label="Liste des tâches">
            <header className="todo-list-header">
                <h2>Liste des tâches ({tachesAffichees.length})</h2>
            </header>

            <section className="todo-controls p-3 rounded mb-4 shadow-sm mt-3" aria-label="Tri et filtres">
                <div className="task-search-wrap mb-3" role="search" aria-label="Recherche de tâches">
                    <label htmlFor="task-search-input" className="task-search-label">Recherche</label>
                    <div className="task-search-input-group">
                        <span className="task-search-icon" aria-hidden="true">
                            <FaMagnifyingGlass />
                        </span>
                        <input
                            id="task-search-input"
                            type="search"
                            className="form-control task-search-input"
                            placeholder="Rechercher par titre, description ou équipier"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Row className="g-3">
                    <Col xs={12} lg={3}>
                        <Sort currentSort={sortBy} onSortChange={setSortBy} />
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <Filter
                            selectedStatuses={selectedStatuses}
                            onToggleStatus={handleToggleStatus}
                            onApplyActiveOnlyPreset={handleApplyActiveOnlyPreset}
                            onSelectAllStatuses={handleSelectAllStatuses}
                            hideOverdue7Plus={hideOverdue7Plus}
                            onToggleHideOverdue={() => setHideOverdue7Plus((prev) => !prev)}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={5}>
                        <FolderFilter
                            folderFilterMode={folderFilterMode}
                            selectedFolderIds={selectedFolderIds}
                            includeNoFolder={includeNoFolder}
                            onShowAllFolders={setFolderFilterAll}
                            onToggleFolder={toggleFolderSelection}
                            onToggleIncludeNoFolder={toggleIncludeNoFolder}
                            onSelectSingleFolder={setOnlyFolderFilter}
                        />
                    </Col>
                </Row>
            </section>
            
            {tachesAffichees.length > 0 ? (
                <section className="tasks-container" aria-label="Tâches filtrées">
                    {tachesAffichees.map(tache => (
                        <Task key={tache.id} data={tache} />
                    ))}
                </section>
            ) : (
                <div className="alert alert-info mt-3">
                    Aucune tâche ne correspond à vos critères de recherche !
                </div>
            )}
        </section>
    );
};

export default TodoList;