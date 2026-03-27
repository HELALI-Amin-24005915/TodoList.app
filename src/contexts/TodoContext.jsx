/**
 * @fileoverview Global state container for tasks, folders, and relations.
 * It provides CRUD operations, derived filters, and view-navigation helpers
 * through React Context.
 */
import React, { createContext, useState } from 'react';
import backupData from '../assets/backup.json';

/**
 * React context exposing task/folder data and UI state actions.
 */
export const TodoContext = createContext();

const DEFAULT_VIEW = 'tasks';
const DEFAULT_FOLDER_FILTER = 'ALL';
const DEFAULT_FOLDER_FILTER_MODE = 'ALL';
const STORAGE_TASKS_KEY = 'todo_app_tasks';
const STORAGE_FOLDERS_KEY = 'todo_app_folders';
const STORAGE_RELATIONS_KEY = 'todo_app_relations';

/**
 * Provider exposing the global Todo domain state and all mutation helpers.
 *
 * @param {Object} props - Provider props.
 * @param {React.ReactNode} props.children - Child tree wrapped by the provider.
 * @returns {JSX.Element} Context provider element.
 */
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

    const readStoredArray = (key) => {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        } catch (error) {
            return null;
        }
    };

    const persistData = (nextTasks, nextFolders, nextRelations) => {
        try {
            localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(nextTasks));
            localStorage.setItem(STORAGE_FOLDERS_KEY, JSON.stringify(nextFolders));
            localStorage.setItem(STORAGE_RELATIONS_KEY, JSON.stringify(nextRelations));
        } catch (error) {
            // Ignore persistence errors (e.g. private mode quota restrictions)
        }
    };

    const sanitizeRelations = (relationItems, taskItems, folderItems) => {
        const taskIdSet = new Set(taskItems.map((task) => task.id));
        const folderIdSet = new Set(folderItems.map((folder) => folder.id));

        return relationItems.filter((relation) =>
            taskIdSet.has(relation.tache) && folderIdSet.has(relation.dossier)
        );
    };

    const getBootstrappedData = () => {
        const storedTasks = readStoredArray(STORAGE_TASKS_KEY);
        const storedFolders = readStoredArray(STORAGE_FOLDERS_KEY);
        const storedRelations = readStoredArray(STORAGE_RELATIONS_KEY);

        if (!storedTasks || !storedFolders || !storedRelations) {
            return {
                tasks: getInitialTasks(),
                folders: getInitialFolders(),
                relations: getInitialRelations(),
            };
        }

        const normalizedTasks = storedTasks.map((task) => ({
            ...task,
            equipiers: normalizeEquipiers(task.equipiers),
        }));
        const normalizedFolders = storedFolders.map((folder) => ({ ...folder }));
        const normalizedRelations = sanitizeRelations(
            storedRelations.map((relation) => ({
                ...relation,
                tache: Number(relation.tache),
                dossier: Number(relation.dossier),
            })),
            normalizedTasks,
            normalizedFolders
        );

        return {
            tasks: normalizedTasks,
            folders: normalizedFolders,
            relations: normalizedRelations,
        };
    };

    const bootstrappedData = getBootstrappedData();

    const [tasks, setTasks] = useState(bootstrappedData.tasks);
    const [folders, setFolders] = useState(bootstrappedData.folders);
    const [relations, setRelations] = useState(bootstrappedData.relations);
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

    // Folder CRUD operations
    const addFolder = (newFolder) => {
        // Title must be at least 3 characters.
        if (newFolder.title && newFolder.title.length >= 3) {
            const folderWithId = { 
                ...newFolder, 
                id: Date.now() 
            };
            setFolders((prev) => {
                const nextFolders = [...prev, folderWithId];
                persistData(tasks, nextFolders, relations);
                return nextFolders;
            });
            return true;
        }
        return false;
    };

    const deleteFolder = (id) => {
        const normalizedId = Number(id);
        const nextFolders = folders.filter((folder) => folder.id !== normalizedId);
        const nextTasks = tasks.filter((task) => task.folderId !== normalizedId);
        const nextRelations = relations.filter((relation) => relation.dossier !== normalizedId);

        setFolders(nextFolders);
        setTasks(nextTasks);
        setRelations(nextRelations);
        persistData(nextTasks, nextFolders, nextRelations);

        setSelectedFolderIds((prev) => {
            const next = prev.filter((folderId) => folderId !== normalizedId);
            setFolderFilterMode(next.length > 0 || includeNoFolder ? 'CUSTOM' : 'ALL');
            return next;
        });
    };

    const updateFolder = (id, updatedFields) => {
        const nextFolders = folders.map((folder) => (
            folder.id === id ? { ...folder, ...updatedFields } : folder
        ));
        setFolders(nextFolders);
        persistData(tasks, nextFolders, relations);
    };

    const addTask = (newTask) => {
        const { folderId, ...taskData } = newTask;
        const taskWithId = {
            ...taskData,
            equipiers: normalizeEquipiers(taskData.equipiers),
            id: Date.now() 
        };
        const nextTasks = [...tasks, taskWithId];
        let nextRelations = relations;

        if (folderId !== null && folderId !== undefined) {
            nextRelations = [...relations, { tache: taskWithId.id, dossier: Number(folderId) }];
        }

        setTasks(nextTasks);
        setRelations(nextRelations);
        persistData(nextTasks, folders, nextRelations);
    };

    const updateTask = (id, updatedFields) => {
        const nextTasks = tasks.map((task) => (
            task.id === id ? { ...task, ...updatedFields } : task
        ));
        setTasks(nextTasks);
        persistData(nextTasks, folders, relations);
    };

    const deleteTask = (taskId) => {
        const nextTasks = tasks.filter((task) => task.id !== taskId);
        const nextRelations = relations.filter((relation) => relation.tache !== taskId);

        setTasks(nextTasks);
        setRelations(nextRelations);
        persistData(nextTasks, folders, nextRelations);
    };

    const addTaskToFolder = (taskId, folderId) => {
        const normalizedFolderId = Number(folderId);
        setRelations((prev) => {
            const alreadyExists = prev.some(
                (r) => r.tache === taskId && r.dossier === normalizedFolderId
            );
            if (alreadyExists) return prev;

            const nextRelations = [...prev, { tache: taskId, dossier: normalizedFolderId }];
            persistData(tasks, folders, nextRelations);
            return nextRelations;
        });
    };

    const removeTaskFromFolder = (taskId, folderId) => {
        const normalizedFolderId = Number(folderId);
        setRelations((prev) => {
            const nextRelations = prev.filter(
                (relation) => !(relation.tache === taskId && relation.dossier === normalizedFolderId)
            );
            persistData(tasks, folders, nextRelations);
            return nextRelations;
        });
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
        const nextTasks = getInitialTasks();
        const nextFolders = getInitialFolders();
        const nextRelations = getInitialRelations();

        setTasks(nextTasks);
        setFolders(nextFolders);
        setRelations(nextRelations);
        setCurrentView(DEFAULT_VIEW);
        setFolderFilterMode(DEFAULT_FOLDER_FILTER_MODE);
        setSelectedFolderIds([]);
        setIncludeNoFolder(false);
        persistData(nextTasks, nextFolders, nextRelations);
    };

    const clearAllData = () => {
        const nextTasks = [];
        const nextFolders = [];
        const nextRelations = [];

        setTasks(nextTasks);
        setFolders(nextFolders);
        setRelations(nextRelations);
        setCurrentView(DEFAULT_VIEW);
        setFolderFilterMode(DEFAULT_FOLDER_FILTER_MODE);
        setSelectedFolderIds([]);
        setIncludeNoFolder(false);
        persistData(nextTasks, nextFolders, nextRelations);
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
        clearAllData,
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