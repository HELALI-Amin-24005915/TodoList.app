import React, { useContext, useState } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import { ETATS } from '../../utils/constants';
// 1. Importation des icônes professionnelles
import { FaCheck, FaTrash, FaCaretRight, FaCaretDown } from 'react-icons/fa';
import { FaPen, FaXmark, FaFloppyDisk } from 'react-icons/fa6';
import './Task.css';

const Task = ({ data }) => {
    const { updateTask, deleteTask, getFoldersByTask } = useContext(TodoContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(data.title || '');
    const [editDesc, setEditDesc] = useState(data.description || '');
    const [editDate, setEditDate] = useState(data.date_echeance || '');
    const [editEtat, setEditEtat] = useState(data.etat || ETATS.NOUVEAU);
    const [editEquipiers, setEditEquipiers] = useState(
        Array.isArray(data.equipiers) ? data.equipiers.join(', ') : ''
    );
    const taskFolders = getFoldersByTask(data.id);

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

    const getFolderBadgeStyle = (color) => {
        switch (color) {
            case 'bluesky':
                return { backgroundColor: 'rgba(13,110,253,0.12)', borderColor: 'rgba(13,110,253,0.35)', color: '#0b57d0' };
            case 'orange':
                return { backgroundColor: 'rgba(253,126,20,0.12)', borderColor: 'rgba(253,126,20,0.35)', color: '#a85a12' };
            case 'pink':
                return { backgroundColor: 'rgba(214,51,132,0.12)', borderColor: 'rgba(214,51,132,0.35)', color: '#9b2c6b' };
            case 'green':
                return { backgroundColor: 'rgba(25,135,84,0.12)', borderColor: 'rgba(25,135,84,0.32)', color: '#146c43' };
            case 'purple':
                return { backgroundColor: 'rgba(111,66,193,0.12)', borderColor: 'rgba(111,66,193,0.32)', color: '#522e91' };
            case 'red':
                return { backgroundColor: 'rgba(220,53,69,0.12)', borderColor: 'rgba(220,53,69,0.25)', color: '#b02a37' };
            case 'yellow':
                return { backgroundColor: 'rgba(255,193,7,0.16)', borderColor: 'rgba(255,193,7,0.35)', color: '#7a5600' };
            case 'cyan':
                return { backgroundColor: 'rgba(13,202,240,0.12)', borderColor: 'rgba(13,202,240,0.35)', color: '#087990' };
            case 'grey':
                return { backgroundColor: 'rgba(108,117,125,0.12)', borderColor: 'rgba(108,117,125,0.32)', color: '#495057' };
            case 'brown':
                return { backgroundColor: 'rgba(121,85,72,0.12)', borderColor: 'rgba(121,85,72,0.32)', color: '#4e342e' };
            default:
                return { backgroundColor: 'rgba(100,116,139,0.12)', borderColor: 'rgba(100,116,139,0.32)', color: '#475569' };
        }
    };

    return (
        <div className={`task-card border-start border-4 border-primary ${isExpanded ? 'is-expanded' : ''}`}>
            <div className="d-flex justify-content-between align-items-center mb-2">
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
                <span className="text-muted small">Échéance : {data.date_echeance}</span>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-2">
                {taskFolders.slice(0, 2).map(folder => (
                    <span
                        key={folder.id}
                        className="badge border folder-badge"
                        style={getFolderBadgeStyle(folder.color)}
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
                                className="badge border folder-badge"
                                style={getFolderBadgeStyle(folder.color)}
                            >
                                {folder.title}
                            </span>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className={`etat-badge ${getEtatBadgeClass(data.etat)}`}>{data.etat}</span>
                        <span className={getPriorityBadgeClass(data.priorite)}>
                            Priorité : {data.priorite}
                        </span>
                    </div>

                    <div className="d-flex gap-2 border-top pt-3 mt-2 task-actions">
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
                            onClick={() => deleteTask(data.id)}
                        >
                            <FaTrash /> Supprimer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Task;