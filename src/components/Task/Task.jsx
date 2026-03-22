import React from 'react';
import './Task.css';

/**
 * Task component to display individual task details and priority alerts.
 * @param {Object} props.data - The task object.
 */
const Task = ({ data }) => {
    const { title, date_echeance, priority, etat } = data;

    // Logic for deadline alert
    const isOverdue = new Date(date_echeance) <= new Date();
    
    // Priority labels and colors
    const priorityLabels = {
        1: { label: 'Low', color: '#28a745' },
        2: { label: 'Medium', color: '#ffc107' },
        3: { label: 'High', color: '#dc3545' }
    };

    return (
        <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
            <div className="task-header">
                <h3>{title}</h3>
                <span 
                    className="priority-badge" 
                    style={{ backgroundColor: priorityLabels[priority]?.color }}
                >
                    {priorityLabels[priority]?.label || 'Level ' + priority}
                </span>
            </div>
            
            <p className="task-status">Status: {etat}</p>
            
            <p className={`task-date ${isOverdue ? 'alert' : ''}`}>
                Deadline: {new Date(date_echeance).toLocaleDateString()} 
                {isOverdue && " ⚠️ OVERDUE"}
            </p>
        </div>
    );
};

export default Task;