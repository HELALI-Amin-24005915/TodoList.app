import React, { useContext } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import { ETAT_TERMINE } from '../../utils/constants';
import Task from '../Task/Task';

const TodoList = () => {
    //use useContext to get the tasks from the context
    const { tasks } = useContext(TodoContext);

    //filter to display only tasks that are not finished and sort by due date
    const tachesAffichees = tasks
        .filter(tache => !ETAT_TERMINE.includes(tache.etat))
        .sort((a, b) => new Date(b.date_echeance) - new Date(a.date_echeance));

    return (
        <div className="todo-list">
            <h2>Liste des tâches en cours ({tachesAffichees.length})</h2>
            
            {/*use .map() to transform tasks into HTML elements */}
            {tachesAffichees.length > 0 ? (
                <div className="tasks-container">
                    {tachesAffichees.map(tache => (
                        <Task key={tache.id} data={tache} />
                        
                    ))}
                </div>
            ) : (
                <p>Aucune tâche en cours !</p>
            )}
        </div>
    );
};

export default TodoList;