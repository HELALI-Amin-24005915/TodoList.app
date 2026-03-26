import React, { useContext, useState } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import { ETATS } from '../../utils/constants';
// 1. Importation des icônes professionnelles
import { FaCheck, FaTrash, FaCaretRight, FaCaretDown } from 'react-icons/fa'; 
import './Task.css';

const Task = ({ data }) => {
    const { updateTask, deleteTask, getFoldersByTask } = useContext(TodoContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const taskFolders = getFoldersByTask(data.id);

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 1: return 'text-danger fw-bold';
            case 2: return 'text-warning fw-bold';
            case 3: return 'text-info fw-bold';
            default: return 'text-secondary';
        }
    };

    return (
        <div className="task-card p-3 mb-3 bg-white rounded shadow-sm border-start border-4 border-primary">
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
                    <span key={folder.id} className="badge bg-light text-dark border">
                        {folder.title}
                    </span>
                ))}
            </div>

            {isExpanded && (
                <>
                    <p className="text-muted small mb-2">{data.description}</p>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {taskFolders.map(folder => (
                            <span key={`full-${folder.id}`} className="badge bg-light text-dark border">
                                {folder.title}
                            </span>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-secondary">{data.etat}</span>
                        <span className={`badge ${getPriorityColor(data.priorite)}`}>
                            Priorité : {data.priorite}
                        </span>
                    </div>

                    <div className="d-flex gap-2 border-top pt-3 mt-2">
                        {data.etat !== ETATS.REUSSI && (
                            <button 
                                className="btn btn-sm btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                onClick={() => updateTask(data.id, { etat: ETATS.REUSSI })}
                            >
                                <FaCheck /> Terminer
                            </button>
                        )}
                        
                        <button 
                            className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                            onClick={() => deleteTask(data.id)}
                        >
                            <FaTrash /> Supprimer
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Task;