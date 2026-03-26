import React, { createContext, useState } from 'react';
import backupData from '../assets/backup.json';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const normalizeEquipiers = (equipiers) => {
        if (!Array.isArray(equipiers)) return [];
        return equipiers
            .map((e) => {
                if (typeof e === 'string') return e.trim();
                if (e && typeof e === 'object' && typeof e.name === 'string') return e.name.trim();
                return '';
            })
            .filter(Boolean);
    };

    const [tasks, setTasks] = useState(
        (backupData.taches || []).map((t) => ({
            ...t,
            equipiers: normalizeEquipiers(t.equipiers),
        }))
    );
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
        setFolders(folders.filter(f => f.id !== id));
        setTasks(tasks.filter(t => t.folderId !== id));
        setRelations(relations.filter(r => r.dossier !== id));
    };

    const updateFolder = (id, updatedFields) => {
        setFolders(folders.map(f => f.id === id ? { ...f, ...updatedFields } : f));
    };

    const addTask = (newTask) => {
        const { folderId, ...taskData } = newTask;
        const taskWithId = {
            ...taskData,
            equipiers: normalizeEquipiers(taskData.equipiers),
            id: Date.now() 
        };
        setTasks([...tasks, taskWithId]);

        if (folderId !== null && folderId !== undefined) {
            setRelations([...relations, { tache: taskWithId.id, dossier: Number(folderId) }]);
        }
    };

    const updateTask = (id, updatedFields) => {
        setTasks(tasks.map (tasks =>
            tasks.id === id ? { ...tasks, ...updatedFields } : tasks
        ))
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(t => t.id !== taskId));
        setRelations(relations.filter(r => r.tache !== taskId)); 
    };

    const getTasksByFolder = (folderId) => {
        const taskIds = relations
            .filter(relation => relation.dossier === Number(folderId))
            .map(relation => relation.tache);

        return tasks.filter(task => taskIds.includes(task.id));
    };

    const getFoldersByTask = (taskId) => {
        const folderIds = relations
            .filter(relation => relation.tache === taskId)
            .map(relation => relation.dossier);

        return folders.filter(folder => folderIds.includes(folder.id));
    };


    const contextValue = {
        tasks, setTasks,
        folders, setFolders,
        relations, setRelations,
        addFolder,
        deleteFolder,
        updateFolder,
        updateTask,
        addTask,
        deleteTask,
        getTasksByFolder,
        getFoldersByTask
    };



    return (
        <TodoContext.Provider value={contextValue}>
            {children}
        </TodoContext.Provider>
    );
};