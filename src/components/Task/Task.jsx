import React from 'react';
import { 
    MdWarning, 
    MdAccessTime, 
    MdKeyboardDoubleArrowUp, 
    MdKeyboardArrowUp, 
    MdKeyboardArrowDown 
} from 'react-icons/md';
import './Task.css';

/**
 * Task component to display individual task details and priority alerts.
 * @param {Object} props.data - The task object.
 */
const Task = ({ data }) => {
    // get task details from data
    const { title, date_echeance, priority, priorite, etat } = data;
    
    // define priority level with fallback to 2 (Moyenne) if not provided
    const taskPriorityLevel = priority || priorite || 2; 

    // logical to determine if the task is overdue or due today
    const dueDate = new Date(date_echeance);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const isOverdue = dueDate < today;
    const isToday = dueDate.getTime() === today.getTime();

    // configure priority levels with labels and icons
    const priorityConfig = {
        1: { label: 'Basse', icon: <MdKeyboardArrowDown /> },
        2: { label: 'Moyenne', icon: <MdKeyboardArrowUp /> },
        3: { label: 'Haute', icon: <MdKeyboardDoubleArrowUp /> }
    };

    const normalizedPriorityLevel = priorityConfig[taskPriorityLevel] ? taskPriorityLevel : 2;
    const currentPriority = priorityConfig[normalizedPriorityLevel];

    return (
        <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
            <div className="task-header">
                <h3>{title}</h3>
                <span 
                    className={`priority-badge priority-badge-${normalizedPriorityLevel}`}
                >
                    {currentPriority.icon}
                    {currentPriority.label}
                </span>
            </div>
            
            <p className="task-status">État : {etat}</p>
            
            <p 
                className={`task-date task-date-content ${isOverdue || isToday ? 'alert' : ''}`}
            >
                <MdAccessTime size={18} /> 
                Échéance : {dueDate.toLocaleDateString('fr-FR')} 
                
                {isOverdue && (
                    <span className="task-overdue-label">
                        <MdWarning size={20} /> EN RETARD
                    </span>
                )}
            </p>
        </div>
    );
};

export default Task;