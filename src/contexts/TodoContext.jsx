import React, { createContext, useState } from 'react';
import backupData from '../assets/backup.json';

export const TodoContext = createContext();

const DEFAULT_VIEW = 'tasks';
const DEFAULT_FOLDER_FILTER = 'ALL';
const DEFAULT_FOLDER_FILTER_MODE = 'ALL';

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

    const getInitialTasks = () =>
        (backupData.taches || []).map((t) => ({
            ...t,
            equipiers: normalizeEquipiers(t.equipiers),
        }));

    const getInitialFolders = () => (backupData.dossiers || []).map((f) => ({ ...f }));
    const getInitialRelations = () => (backupData.relations || []).map((r) => ({ ...r }));

    const [tasks, setTasks] = useState(getInitialTasks);
    const [folders, setFolders] = useState(getInitialFolders);
    const [relations, setRelations] = useState(getInitialRelations);
    const [currentView, setCurrentView] = useState(DEFAULT_VIEW);
    const [folderFilterMode, setFolderFilterMode] = useState(DEFAULT_FOLDER_FILTER_MODE);
    const [selectedFolderIds, setSelectedFolderIds] = useState([]);
    const [includeNoFolder, setIncludeNoFolder] = useState(false);

    const activeFolderFilter =
        folderFilterMode === 'ALL'
            ? DEFAULT_FOLDER_FILTER
            : includeNoFolder && selectedFolderIds.length === 0
                ? 'NONE'
                : selectedFolderIds.length === 1 && !includeNoFolder
                    ? String(selectedFolderIds[0])
                    : 'MULTI';

    const goToTasksView = () => setCurrentView('tasks');
    const goToFoldersView = () => setCurrentView('folders');

    const setFolderFilter = (filterValue) => {
        if (filterValue === DEFAULT_FOLDER_FILTER) {
            setFolderFilterMode('ALL');
            setSelectedFolderIds([]);
            setIncludeNoFolder(false);
            return;
        }

        if (filterValue === 'NONE') {
            setFolderFilterMode('CUSTOM');
            setSelectedFolderIds([]);
            setIncludeNoFolder(true);
            return;
        }

        const parsedId = Number(filterValue);
        if (Number.isNaN(parsedId)) {
            setFolderFilterMode('ALL');
            setSelectedFolderIds([]);
            setIncludeNoFolder(false);
            return;
        }

        setFolderFilterMode('CUSTOM');
        setSelectedFolderIds([parsedId]);
        setIncludeNoFolder(false);
    };

    const setFolderFilterAll = () => {
        setFolderFilterMode('ALL');
        setSelectedFolderIds([]);
        setIncludeNoFolder(false);
    };

    const setSelectedFolders = (folderIds) => {
        const normalizedIds = Array.from(new Set((folderIds || []).map((id) => Number(id)).filter((id) => !Number.isNaN(id))));
        setFolderFilterMode(normalizedIds.length > 0 || includeNoFolder ? 'CUSTOM' : 'ALL');
        setSelectedFolderIds(normalizedIds);
    };

    const toggleFolderSelection = (folderId) => {
        const normalizedId = Number(folderId);
        if (Number.isNaN(normalizedId)) return;

        setSelectedFolderIds((prev) => {
            const exists = prev.includes(normalizedId);
            const next = exists ? prev.filter((id) => id !== normalizedId) : [...prev, normalizedId];
            setFolderFilterMode(next.length > 0 || includeNoFolder ? 'CUSTOM' : 'ALL');
            return next;
        });
    };

    const toggleIncludeNoFolder = () => {
        setIncludeNoFolder((prev) => {
            const nextValue = !prev;
            setFolderFilterMode(selectedFolderIds.length > 0 || nextValue ? 'CUSTOM' : 'ALL');
            return nextValue;
        });
    };

    const setOnlyFolderFilter = (folderId) => {
        const normalizedId = Number(folderId);
        if (Number.isNaN(normalizedId)) {
            setFolderFilterAll();
            return;
        }
        setFolderFilterMode('CUSTOM');
        setSelectedFolderIds([normalizedId]);
        setIncludeNoFolder(false);
    };

    const selectFolderAndGoToTasks = (folderId) => {
        setOnlyFolderFilter(folderId);
        setCurrentView('tasks');
    };

    const clearActiveFolderFilter = () => {
        setFolderFilterAll();
    };

    //CRUD for folders
    const addFolder = (newFolder) => {
        //Title must be at least 3 characters
        if (newFolder.title && newFolder.title.length >= 3) {
            const folderWithId = { 
                ...newFolder, 
                id: Date.now() 
            };
            setFolders((prev) => [...prev, folderWithId]);
            return true;
        }
        return false;
    };

    const deleteFolder = (id) => {
        setFolders((prev) => prev.filter((f) => f.id !== id));
        setTasks((prev) => prev.filter((t) => t.folderId !== id));
        setRelations((prev) => prev.filter((r) => r.dossier !== id));
        setSelectedFolderIds((prev) => {
            const next = prev.filter((folderId) => folderId !== Number(id));
            setFolderFilterMode(next.length > 0 || includeNoFolder ? 'CUSTOM' : 'ALL');
            return next;
        });
    };

    const updateFolder = (id, updatedFields) => {
        setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, ...updatedFields } : f)));
    };

    const addTask = (newTask) => {
        const { folderId, ...taskData } = newTask;
        const taskWithId = {
            ...taskData,
            equipiers: normalizeEquipiers(taskData.equipiers),
            id: Date.now() 
        };
        setTasks((prev) => [...prev, taskWithId]);

        if (folderId !== null && folderId !== undefined) {
            setRelations((prev) => [...prev, { tache: taskWithId.id, dossier: Number(folderId) }]);
        }
    };

    const updateTask = (id, updatedFields) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, ...updatedFields } : task))
        );
    };

    const deleteTask = (taskId) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setRelations((prev) => prev.filter((r) => r.tache !== taskId)); 
    };

    const addTaskToFolder = (taskId, folderId) => {
        const normalizedFolderId = Number(folderId);
        setRelations((prev) => {
            const alreadyExists = prev.some(
                (r) => r.tache === taskId && r.dossier === normalizedFolderId
            );
            if (alreadyExists) return prev;
            return [...prev, { tache: taskId, dossier: normalizedFolderId }];
        });
    };

    const removeTaskFromFolder = (taskId, folderId) => {
        const normalizedFolderId = Number(folderId);
        setRelations((prev) =>
            prev.filter((r) => !(r.tache === taskId && r.dossier === normalizedFolderId))
        );
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

    const resetFromBackup = () => {
        setTasks(getInitialTasks());
        setFolders(getInitialFolders());
        setRelations(getInitialRelations());
        setCurrentView(DEFAULT_VIEW);
        setFolderFilterMode(DEFAULT_FOLDER_FILTER_MODE);
        setSelectedFolderIds([]);
        setIncludeNoFolder(false);
    };


    const contextValue = {
        tasks, setTasks,
        folders, setFolders,
        relations, setRelations,
        currentView,
        folderFilterMode,
        selectedFolderIds,
        includeNoFolder,
        activeFolderFilter,
        goToTasksView,
        goToFoldersView,
        setFolderFilter,
        setFolderFilterAll,
        setSelectedFolders,
        toggleFolderSelection,
        toggleIncludeNoFolder,
        setOnlyFolderFilter,
        selectFolderAndGoToTasks,
        clearActiveFolderFilter,
        resetFromBackup,
        addFolder,
        deleteFolder,
        updateFolder,
        updateTask,
        addTask,
        deleteTask,
        addTaskToFolder,
        removeTaskFromFolder,
        getTasksByFolder,
        getFoldersByTask
    };



    return (
        <TodoContext.Provider value={contextValue}>
            {children}
        </TodoContext.Provider>
    );
};