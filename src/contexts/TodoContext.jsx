import React, { createContext, useState } from 'react';
import backupData from '../assets/backup.json';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const [tasks, setTasks] = useState(backupData.taches);
    const [folders, setFolders] = useState(backupData.dossiers);
    const [relations, setRelations] = useState(backupData.relations);

    //CRUD for folders
    const addFolder = (newFolder) => {
        //Title must be at least 3 characters
        if (newFolder.title && newFolder.title.length >= 3) {
            const folderWithId = { 
                ...newFolder, 
                id: Date.now() 
            };
            setFolders([...folders, folderWithId]);
            return true;
        }
        return false;
    };

    const deleteFolder = (id) => {
        // Simple deletion of the folder
        setFolders(folders.filter(f => f.id !== id));
        setRelations(relations.filter(r => r.dossier !== id));
    };

    const updateFolder = (id, updatedFields) => {
        setFolders(folders.map(f => f.id === id ? { ...f, ...updatedFields } : f));
    };

    const addTask = (newTask) => {
        const taskWithId = {
            ...newTask,
            id: Date.now() 
        };
        setTasks([...tasks, taskWithId]);
    };

    const updateTask = (id, updatedFields) => {
        setTasks(tasks.map (tasks =>
            tasks.id === id ? { ...tasks, ...updatedFields } : tasks
        ))
    };


    const contextValue = {
        tasks, setTasks,
        folders, setFolders,
        relations, setRelations,
        addFolder,
        deleteFolder,
        updateFolder,
        updateTask,
        addTask
    };

    return (
        <TodoContext.Provider value={contextValue}>
            {children}
        </TodoContext.Provider>
    );
};