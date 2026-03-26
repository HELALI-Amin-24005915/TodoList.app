import React, { useContext, useMemo, useState } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import { FaFolderOpen, FaTrash, FaListUl, FaPen, FaXmark, FaFloppyDisk } from 'react-icons/fa6'; // Icônes pro
import './FolderManager.css';

const FolderManager = () => {
    const { folders, deleteFolder, getTasksByFolder, updateFolder } = useContext(TodoContext);
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editColor, setEditColor] = useState('bluesky');

    const colorOptions = useMemo(
        () => ([
            { value: 'bluesky', label: 'Bleu ciel' },
            { value: 'orange', label: 'Orange' },
            { value: 'pink', label: 'Rose' },
            { value: 'green', label: 'Vert' },
            { value: 'purple', label: 'Violet' },
            { value: 'red', label: 'Rouge' },
            { value: 'yellow', label: 'Jaune' },
            { value: 'cyan', label: 'Cyan' },
            { value: 'grey', label: 'Gris' },
            { value: 'brown', label: 'Marron' },
        ]),
        []
    );

    const getFolderCardBorderClass = (color) => {
        switch (color) {
            case 'bluesky':
                return 'folder-card-border-bluesky';
            case 'orange':
                return 'folder-card-border-orange';
            case 'pink':
                return 'folder-card-border-pink';
            case 'green':
                return 'folder-card-border-green';
            case 'purple':
                return 'folder-card-border-purple';
            case 'red':
                return 'folder-card-border-red';
            case 'yellow':
                return 'folder-card-border-yellow';
            case 'cyan':
                return 'folder-card-border-cyan';
            case 'grey':
                return 'folder-card-border-grey';
            case 'brown':
                return 'folder-card-border-brown';
            default:
                return 'folder-card-border-default';
        }
    };

    const getFolderTitleColorClass = (color) => {
        switch (color) {
            case 'bluesky':
                return 'folder-title-bluesky';
            case 'orange':
                return 'folder-title-orange';
            case 'pink':
                return 'folder-title-pink';
            case 'green':
                return 'folder-title-green';
            case 'purple':
                return 'folder-title-purple';
            case 'red':
                return 'folder-title-red';
            case 'yellow':
                return 'folder-title-yellow';
            case 'cyan':
                return 'folder-title-cyan';
            case 'grey':
                return 'folder-title-grey';
            case 'brown':
                return 'folder-title-brown';
            default:
                return 'folder-title-default';
        }
    };

    const startEdit = (folder) => {
        setEditingFolderId(folder.id);
        setEditTitle(folder.title || '');
        setEditDescription(folder.description || '');
        setEditColor(folder.color || 'bluesky');
    };

    const cancelEdit = () => {
        setEditingFolderId(null);
        setEditTitle('');
        setEditDescription('');
        setEditColor('bluesky');
    };

    const saveEdit = () => {
        if (editTitle.trim().length < 3) {
            alert("Le nom du dossier doit faire au moins 3 caractères.");
            return;
        }
        updateFolder(editingFolderId, {
            title: editTitle.trim(),
            description: editDescription,
            color: editColor,
        });
        cancelEdit();
    };

    return (
        <div className="folder-manager">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestion des Dossiers ({folders.length})</h2>
            </div>

            {folders.length > 0 ? (
                <div className="row">
                    {folders.map(folder => {
                        const folderTasks = getTasksByFolder(folder.id);
                        const isEditing = editingFolderId === folder.id;

                        return (
                            <div
                                key={folder.id} 
                                className={`col-md-4 mb-4`}
                            >
                                <div
                                    className={`card shadow-sm h-100 folder-card ${getFolderCardBorderClass(folder.color)}`}
                                >
                                    <div className="card-body">
                                        {!isEditing ? (
                                            <>
                                                <h4
                                                    className={`card-title d-flex align-items-center gap-2 mb-2 ${getFolderTitleColorClass(folder.color)}`}
                                                >
                                                    <FaFolderOpen /> {folder.title}
                                                </h4>

                                                {folder.description ? (
                                                    <p className="text-muted small mb-2">{folder.description}</p>
                                                ) : null}
                                            </>
                                        ) : (
                                            <div className="folder-edit">
                                                <div className="mb-2">
                                                    <label className="form-label small fw-bold">Nom *</label>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        minLength={3}
                                                    />
                                                </div>

                                                <div className="mb-2">
                                                    <label className="form-label small fw-bold">Description</label>
                                                    <textarea
                                                        className="form-control form-control-sm"
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                        rows={2}
                                                    />
                                                </div>

                                                <div className="mb-2">
                                                    <label className="form-label small fw-bold">Couleur</label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={editColor}
                                                        onChange={(e) => setEditColor(e.target.value)}
                                                    >
                                                        {colorOptions.map((c) => (
                                                            <option key={c.value} value={c.value}>
                                                                {c.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <p className="card-text text-muted mb-0 d-flex align-items-center gap-2">
                                            <FaListUl /> 
                                            {folderTasks.length} tâche(s) associée(s)
                                        </p>
                                    </div>
                                    <div className="card-footer bg-transparent border-0 text-end">
                                        {!isEditing ? (
                                            <button
                                                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 me-2"
                                                onClick={() => startEdit(folder)}
                                            >
                                                <FaPen /> Modifier
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2 me-2"
                                                    onClick={saveEdit}
                                                >
                                                    <FaFloppyDisk /> Enregistrer
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 me-2"
                                                    onClick={cancelEdit}
                                                >
                                                    <FaXmark /> Annuler
                                                </button>
                                            </>
                                        )}
                                        <button 
                                            className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-2"
                                            onClick={() => {
                                                if(window.confirm(`Voulez-vous vraiment supprimer le dossier "${folder.title}" ?`)) {
                                                    deleteFolder(folder.id);
                                                }
                                            }}
                                        >
                                            <FaTrash /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="alert alert-info shadow-sm">
                    Aucun dossier pour le moment. Cliquez sur le bouton "Créer" pour ajouter votre premier projet !
                </div>
            )}
        </div>
    );
};

export default FolderManager;