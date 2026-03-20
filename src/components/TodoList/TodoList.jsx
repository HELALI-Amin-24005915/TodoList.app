import React, { useContext } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import { ETAT_TERMINE } from '../../utils/constants';

/**
 * Component that displays the list of active tasks.
 * It filters out finished tasks and sorts them by due date.
 */
const TodoList = () => {
    //on utilise useContexte pour recuperer les taches
    const { taches } = useContext(TodoContext);

    //on filtre pour n'afficher que les taches qui ne sont pas terminées et on trie par date d'expiration
    const tachesAffichees = taches
        .filter(tache => !ETAT_TERMINE.includes(tache.etat))
        .sort((a, b) => new Date(b.date_echeance) - new Date(a.date_echeance));

    return (
        <div className="todo-list">
            <h2>Liste des tâches en cours ({tachesAffichees.length})</h2>
            
            {/*on utilise .map() pour transformer les tâches en éléments HTML */}
            {tachesAffichees.length > 0 ? (
                <ul>
                    {tachesAffichees.map(tache => (
                        <li key={tache.id}>
                            <h3>{tache.title}</h3>
                            <p>Échéance : {tache.date_echeance}</p>
                            <p>État : {tache.etat}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune tâche en cours !</p>
            )}
        </div>
    );
};

export default TodoList;