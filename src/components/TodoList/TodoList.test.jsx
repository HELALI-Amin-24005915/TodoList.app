/**
 * @fileoverview Test suite for TodoList rendering behavior.
 * Verifies that unfinished tasks are visible by default while terminal tasks are hidden.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from './TodoList';
import { TodoProvider } from '../../contexts/TodoContext';

/**
 * Unit tests for the TodoList component
 */
describe('TodoList Component', () => {
    
    test('renders active tasks and filters out finished ones', () => {
        render(
            <TodoProvider>
                <TodoList />
            </TodoProvider>
        );

        expect(screen.getByText(/Liste des tâches/i)).toBeInTheDocument();
        expect(screen.getByText(/3. Wireframes/i)).toBeInTheDocument();
        expect(screen.getByText(/4. Design/i)).toBeInTheDocument();

        expect(screen.queryByText(/1. Fonctionnalités/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/2. Etude de marché/i)).not.toBeInTheDocument();
    });

});