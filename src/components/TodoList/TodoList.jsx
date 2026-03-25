import React, { useContext, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { TodoContext } from '../../contexts/TodoContext';
import { ETAT_TERMINE } from '../../utils/constants';
import Task from '../Task/Task';
import Filter from '../Filter/Filter';
import Sort from '../Sort/Sort';

const TodoList = () => {
    const { tasks } = useContext(TodoContext);

    const [filterBy, setFilterBy] = useState('ACTIVE_ONLY');
    const [sortBy, setSortBy] = useState('date_echeance_desc');

    const tachesAffichees = tasks
        .filter(tache => {
            if (filterBy === 'ACTIVE_ONLY') return !ETAT_TERMINE.includes(tache.etat);
            if (filterBy === 'ALL') return true;
            return tache.etat === filterBy;
        })
        .sort((a, b) => {
            if (sortBy === 'date_echeance_desc') return new Date(b.date_echeance) - new Date(a.date_echeance);
            if (sortBy === 'date_echeance_asc') return new Date(a.date_echeance) - new Date(b.date_echeance);
            if (sortBy === 'date_creation_desc') return new Date(b.date_creation) - new Date(a.date_creation);
            if (sortBy === 'name_asc') return a.title.localeCompare(b.title); // Tri alphabétique
            return 0;
        });

    return (
        <div className="todo-list">
            <h2>Liste des tâches ({tachesAffichees.length})</h2>
            
            <div className="bg-light p-3 rounded mb-4 shadow-sm mt-3">
                <Row>
                    <Col md={6}>
                        <Sort currentSort={sortBy} onSortChange={setSortBy} />
                    </Col>
                    <Col md={6}>
                        <Filter currentFilter={filterBy} onFilterChange={setFilterBy} />
                    </Col>
                </Row>
            </div>
            
            {tachesAffichees.length > 0 ? (
                <div className="tasks-container mt-3">
                    {tachesAffichees.map(tache => (
                        <Task key={tache.id} data={tache} />
                    ))}
                </div>
            ) : (
                <div className="alert alert-info mt-3">
                    Aucune tâche ne correspond à vos critères de recherche !
                </div>
            )}
        </div>
    );
};

export default TodoList;