/**
 * @fileoverview Task card presentation and interactions.
 * Implements expand/collapse behavior, inline editing, state transitions,
 * deletion, and folder linking controls.
 */
import React, { useContext, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { TodoContext } from '../../contexts/TodoContext';
import { ETATS } from '../../utils/constants';
// Professional icon imports
import { FaCheck, FaTrash, FaCaretRight, FaCaretDown } from 'react-icons/fa';
import { FaPen, FaXmark, FaFloppyDisk } from 'react-icons/fa6';
import './Task.css';

/**
 * Task card component with expand/collapse, edit, delete,
 * state updates, and folder association controls.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.data - Task data to render.
 * @returns {JSX.Element} Task card.
 */
const Task = ({ data }) => {
    const {
        updateTask,
        deleteTask,
        getFoldersByTask,
        folders,
        addTaskToFolder,
        removeTaskFromFolder,
        selectFolderAndGoToTasks,
    } = useContext(TodoContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(data.title || '');
    const [editDesc, setEditDesc] = useState(data.description || '');
    const [editDate, setEditDate] = useState(data.date_echeance || '');
    const [editEtat, setEditEtat] = useState(data.etat || ETATS.NOUVEAU);
    const [editEquipiers, setEditEquipiers] = useState(
        Array.isArray(data.equipiers) ? data.equipiers.join(', ') : ''
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const taskFolders = getFoldersByTask(data.id);

    const handleDeleteTask = () => {
        deleteTask(data.id);
        setIsDeleteModalOpen(false);
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 1:
                return 'priority-badge priority-badge-1';
            case 2:
                return 'priority-badge priority-badge-2';
            case 3:
                return 'priority-badge priority-badge-3';
            default:
                return 'priority-badge priority-badge-2';
        }
    };

    const getEtatBadgeClass = (etat) => {
        switch (etat) {
            case ETATS.NOUVEAU:
                return 'etat-nouveaux';
            case ETATS.EN_COURS:
                return 'etat-en-cours';
            case ETATS.EN_ATTENTE:
                return 'etat-en-attente';
            case ETATS.REUSSI:
                return 'etat-reussi';
            case ETATS.ABANDONNE:
                return 'etat-abandonne';
            default:
                return '';
        }
    };

    const getFolderBadgeClass = (color) => {
        switch (color) {
            case 'bluesky':
                return 'folder-badge-bluesky';
            case 'orange':
                return 'folder-badge-orange';
            case 'pink':
                return 'folder-badge-pink';
            case 'green':
                return 'folder-badge-green';
            case 'purple':
                return 'folder-badge-purple';
            case 'red':
                return 'folder-badge-red';
            case 'yellow':
                return 'folder-badge-yellow';
            case 'cyan':
                return 'folder-badge-cyan';
            case 'grey':
                return 'folder-badge-grey';
            case 'brown':
                return 'folder-badge-brown';
            default:
                return 'folder-badge-default';
        }
    };

    const handleFolderBadgeActivation = (folderId) => {
        selectFolderAndGoToTasks(folderId);
    };

    return (
        <div className={`task-card border-start border-4 border-primary ${isExpanded ? 'is-expanded' : ''}`}>
            <div className="task-header d-flex justify-content-between align-items-center mb-2">
                <h5 className="m-0 text-dark d-flex align-items-center gap-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-link p-0 text-decoration-none"
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label={isExpanded ? 'Réduire la tâche' : 'Développer la tâche'}
                    >
                        {isExpanded ? <FaCaretDown /> : <FaCaretRight />}
                    </button>
                    {data.title}
                </h5>
                <span className="text-muted small task-deadline">Échéance : {data.date_echeance}</span>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-2">
                {taskFolders.slice(0, 2).map(folder => (
                    <span
                        key={folder.id}
                        className={`badge border folder-badge folder-badge-clickable ${getFolderBadgeClass(folder.color)}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleFolderBadgeActivation(folder.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleFolderBadgeActivation(folder.id);
                            }
                        }}
                        aria-label={`Filtrer sur le dossier ${folder.title}`}
                    >
                        {folder.title}
                    </span>
                ))}
            </div>

            {isExpanded && (
                <div className="task-expanded">
                    {!isEditing ? (
                        <p className="text-muted small mb-2">{data.description}</p>
                    ) : (
                        <div className="task-edit">
                            <div className="mb-2">
                                <label className="form-label small fw-bold">Titre *</label>
                                <input
                                    className="form-control form-control-sm"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    minLength={5}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="form-label small fw-bold">Description</label>
                                <textarea
                                    className="form-control form-control-sm"
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div className="row g-2">
                                <div className="col-6">
                                    <label className="form-label small fw-bold">Échéance *</label>
                                    <input
                                        className="form-control form-control-sm"
                                        type="date"
                                        value={editDate}
                                        onChange={(e) => setEditDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="col-6">
                                    <label className="form-label small fw-bold">Statut</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={editEtat}
                                        onChange={(e) => setEditEtat(e.target.value)}
                                    >
                                        <option value={ETATS.NOUVEAU}>Nouveau</option>
                                        <option value={ETATS.EN_COURS}>En cours</option>
                                        <option value={ETATS.EN_ATTENTE}>En attente</option>
                                        <option value={ETATS.REUSSI}>Réussi</option>
                                        <option value={ETATS.ABANDONNE}>Abandonné</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-2">
                                <label className="form-label small fw-bold">Équipiers (virgules)</label>
                                <input
                                    className="form-control form-control-sm"
                                    value={editEquipiers}
                                    onChange={(e) => setEditEquipiers(e.target.value)}
                                    placeholder="Ex: Paul, Bob"
                                />
                            </div>

                            <div className="mt-3">
                                <label className="form-label small fw-bold">Dossiers associés</label>
                                <div className="d-flex flex-column gap-1">
                                    {folders.length > 0 ? (
                                        folders.map((folder) => {
                                            const isChecked = taskFolders.some((f) => f.id === folder.id);
                                            return (
                                                <div key={folder.id} className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`task-${data.id}-folder-${folder.id}`}
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                addTaskToFolder(data.id, folder.id);
                                                            } else {
                                                                removeTaskFromFolder(data.id, folder.id);
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label small"
                                                        htmlFor={`task-${data.id}-folder-${folder.id}`}
                                                    >
                                                        {folder.title}
                                                    </label>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-muted small">Aucun dossier disponible.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {Array.isArray(data.equipiers) && data.equipiers.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {data.equipiers.map((name) => (
                                <span key={name} className="badge text-bg-light border">
                                    {name}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {taskFolders.map(folder => (
                            <span
                                key={`full-${folder.id}`}
                                className={`badge border folder-badge folder-badge-clickable ${getFolderBadgeClass(folder.color)}`}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleFolderBadgeActivation(folder.id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleFolderBadgeActivation(folder.id);
                                    }
                                }}
                                aria-label={`Filtrer sur le dossier ${folder.title}`}
                            >
                                {folder.title}
                            </span>
                        ))}
                    </div>

                    <div className="task-meta-row d-flex justify-content-between align-items-center mb-3">
                        <span className={`etat-badge ${getEtatBadgeClass(data.etat)}`}>{data.etat}</span>
                        <span className={getPriorityBadgeClass(data.priorite)}>
                            Priorité : {data.priorite}
                        </span>
                    </div>

                    <div className={`d-flex gap-2 border-top pt-3 mt-2 task-actions ${isEditing ? 'is-editing' : ''} ${data.etat !== ETATS.REUSSI ? 'has-complete' : 'without-complete'}`}>
                        {!isEditing && data.etat !== ETATS.REUSSI && (
                            <button 
                                className="btn btn-sm btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                onClick={() => updateTask(data.id, { etat: ETATS.REUSSI })}
                            >
                                <FaCheck /> Terminer
                            </button>
                        )}

                        {!isEditing ? (
                            <button
                                className="btn btn-sm btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                onClick={() => setIsEditing(true)}
                            >
                                <FaPen /> Éditer
                            </button>
                        ) : (
                            <>
                                <button
                                    className="btn btn-sm btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => {
                                        if (editTitle.trim().length < 5 || !editDate) {
                                            alert("Titre (min 5) et date d'échéance obligatoires.");
                                            return;
                                        }
                                        updateTask(data.id, {
                                            title: editTitle.trim(),
                                            description: editDesc,
                                            date_echeance: editDate,
                                            etat: editEtat,
                                            equipiers: editEquipiers
                                                .split(',')
                                                .map((s) => s.trim())
                                                .filter(Boolean),
                                        });
                                        setIsEditing(false);
                                    }}
                                >
                                    <FaFloppyDisk /> Enregistrer
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => {
                                        setEditTitle(data.title || '');
                                        setEditDesc(data.description || '');
                                        setEditDate(data.date_echeance || '');
                                        setEditEtat(data.etat || ETATS.NOUVEAU);
                                        setEditEquipiers(Array.isArray(data.equipiers) ? data.equipiers.join(', ') : '');
                                        setIsEditing(false);
                                    }}
                                >
                                    <FaXmark /> Annuler
                                </button>
                            </>
                        )}
                        
                        <button 
                            className="btn btn-sm btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <FaTrash /> Supprimer
                        </button>
                    </div>
                </div>
            )}

            <Modal
                show={isDeleteModalOpen}
                onHide={() => setIsDeleteModalOpen(false)}
                centered
                className="task-delete-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Supprimer la tâche</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Voulez-vous vraiment supprimer la tâche "{data.title}" ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleDeleteTask}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Task;