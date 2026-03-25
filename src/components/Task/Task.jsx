import React, { useContext } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import { ETATS } from '../../utils/constants';
// 1. Importation des icônes professionnelles
import { FaCheck, FaTrash } from 'react-icons/fa'; 
import './Task.css';

const Task = ({ data }) => {
    const { updateTask, deleteTask } = useContext(TodoContext);

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
                <h5 className="m-0 text-dark">{data.title}</h5>
                <span className={getPriorityColor(data.priority)}>
                    Priorité : {data.priorite}
                </span>
            </div>
            
            <p className="text-muted small mb-2">{data.description}</p>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-secondary">{data.etat}</span>
                <span className="text-muted small">Échéance : {data.date_echeance}</span>
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
        </div>
    );
};

export default Task;