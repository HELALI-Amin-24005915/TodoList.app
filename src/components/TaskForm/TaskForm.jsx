import React, { useState, useContext } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import './TaskForm.css';

const TaskForm = () => {
    const { addTask } = useContext(TodoContext);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateEcheance, setDateEcheance] = useState('');
    const [priorite, setPriorite] = useState(2); // priority average by default

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (title.trim().length < 3) {
            alert("Le titre de la tâche doit faire au moins 3 caractères.");
            return;
        }

        // add task to context
        addTask({
            title,
            description,
            date_echeance: dateEcheance,
            priorite: Number(priorite),
            etat: "Nouveau", // state to "New" by default
            date_creation: new Date().toISOString().split('T')[0]
        });

        // reset form after submission
        setTitle('');
        setDescription('');
        setDateEcheance('');
        setPriorite(2);
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h3>Ajouter une nouvelle tâche</h3>
            
            <div className="task-form-row">
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Nom de la tâche" 
                    required 
                    className="task-input-title"
                />
                
                <input 
                    type="date" 
                    value={dateEcheance} 
                    onChange={(e) => setDateEcheance(e.target.value)} 
                    required 
                    className="task-input-date"
                />

                <select 
                    value={priorite} 
                    onChange={(e) => setPriorite(e.target.value)}
                    className="task-select-priority"
                >
                    <option value={1}>Priorité Basse</option>
                    <option value={2}>Priorité Moyenne</option>
                    <option value={3}>Priorité Haute</option>
                </select>
            </div>

            <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Description de la tâche (optionnelle)" 
                className="task-textarea"
            />

            <button type="submit" className="task-btn-submit">
                Créer la tâche
            </button>
        </form>
    );
};

export default TaskForm;