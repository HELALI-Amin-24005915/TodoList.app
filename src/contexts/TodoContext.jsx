import React, { createContext, useState } from 'react';
import backupData from '../assets/backup.json';

/**
 * Context for managing tasks, folders, and their relations across the app.
 */
export const TodoContext = createContext();

/**
 * Provider component that wraps the application and provides global state.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that need access to the context.
 */
export const TodoProvider = ({ children }) => {
    
    const [taches, setTaches] = useState(backupData.taches);
    const [dossiers, setDossiers] = useState(backupData.dossiers);
    const [relations, setRelations] = useState(backupData.relations);

    const contextValue = {
        taches,
        setTaches,
        dossiers,
        setDossiers,
        relations,
        setRelations
    };

    return (
        <TodoContext.Provider value={contextValue}>
            {children}
        </TodoContext.Provider>
    );
};