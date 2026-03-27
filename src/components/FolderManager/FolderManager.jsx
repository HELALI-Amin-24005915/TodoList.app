/**
 * @fileoverview Folder management module.
 * Handles folder display, inline editing workflows, deletion, and quick navigation
 * into tasks filtered by the selected folder.
 */
import React, { useContext, useMemo, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { TodoContext } from '../../contexts/TodoContext';
import { FaFolderOpen, FaTrash, FaListUl, FaPen, FaXmark, FaFloppyDisk } from 'react-icons/fa6'; // Professional icons
import './FolderManager.css';

/**
 * Folder management page with inline editing, deletion,
 * and quick navigation to tasks filtered by folder.
 *
 * @returns {JSX.Element} Folder manager view.
 */
const FolderManager = () => {
    const {
        folders,
        deleteFolder,
        getTasksByFolder,
        updateFolder,
        selectFolderAndGoToTasks,
    } = useContext(TodoContext);
    const [editingFolder, setEditingFolder] = useState(null);
    const [folderToDelete, setFolderToDelete] = useState(null);

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
        setEditingFolder({
            id: folder.id,
            title: folder.title || '',
            description: folder.description || '',
            color: folder.color || 'bluesky',
        });
    };

    const cancelEdit = () => {
        setEditingFolder(null);
    };

    const handleEditFieldChange = (field, value) => {
        setEditingFolder((prev) => {
            if (!prev) return prev;
            return { ...prev, [field]: value };
        });
    };

    const saveEdit = () => {
        if (!editingFolder?.id) {
            return;
        }

        if (editingFolder.title.trim().length < 3) {
            alert("Le nom du dossier doit faire au moins 3 caractères.");
            return;
        }

        updateFolder(editingFolder.id, {
            title: editingFolder.title.trim(),
            description: editingFolder.description,
            color: editingFolder.color,
        });

        cancelEdit();
    };

    const openDeleteModal = (folder) => {
        setFolderToDelete(folder);
    };

    const closeDeleteModal = () => {
        setFolderToDelete(null);
    };

    const confirmDeleteFolder = () => {
        if (!folderToDelete?.id) {
            return;
        }

        deleteFolder(folderToDelete.id);
        closeDeleteModal();
    };

    return (
        <div className="folder-manager">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestion des Dossiers ({folders.length})</h2>
            </div>

            {folders.length > 0 ? (
                <div className="row g-3 align-items-start">
                    {folders.map(folder => {
                        const folderTasks = getTasksByFolder(folder.id);
                        const isEditing = editingFolder?.id === folder.id;
                        const isAnyEditing = Boolean(editingFolder?.id);

                        return (
                            <div
                                key={folder.id} 
                                className={`col-sm-6 col-lg-4 folder-col`}
                            >
                                <div
                                    className={`card shadow-sm folder-card ${getFolderCardBorderClass(folder.color)}`}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                        if (!isAnyEditing && !isEditing) {
                                            selectFolderAndGoToTasks(folder.id);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if ((e.key === 'Enter' || e.key === ' ') && !isAnyEditing && !isEditing) {
                                            e.preventDefault();
                                            selectFolderAndGoToTasks(folder.id);
                                        }
                                    }}
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
                                                        value={editingFolder?.title || ''}
                                                        onChange={(e) => handleEditFieldChange('title', e.target.value)}
                                                        minLength={3}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>

                                                <div className="mb-2">
                                                    <label className="form-label small fw-bold">Description</label>
                                                    <textarea
                                                        className="form-control form-control-sm"
                                                        value={editingFolder?.description || ''}
                                                        onChange={(e) => handleEditFieldChange('description', e.target.value)}
                                                        rows={2}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>

                                                <div className="mb-2">
                                                    <label className="form-label small fw-bold">Couleur</label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={editingFolder?.color || 'bluesky'}
                                                        onChange={(e) => handleEditFieldChange('color', e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
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
                                    <div className="card-footer bg-transparent border-0">
                                        <div className="folder-actions-group">
                                            {!isEditing ? (
                                                <button
                                                    className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center justify-content-center gap-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEdit(folder);
                                                    }}
                                                >
                                                    <FaPen /> Modifier
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-primary btn-sm d-inline-flex align-items-center justify-content-center gap-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            saveEdit();
                                                        }}
                                                    >
                                                        <FaFloppyDisk /> Enregistrer
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center justify-content-center gap-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            cancelEdit();
                                                        }}
                                                    >
                                                        <FaXmark /> Annuler
                                                    </button>
                                                </>
                                            )}
                                            <button 
                                                className="btn btn-outline-danger btn-sm d-inline-flex align-items-center justify-content-center gap-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteModal(folder);
                                                }}
                                            >
                                                <FaTrash /> Supprimer
                                            </button>
                                        </div>
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

            <Modal
                show={Boolean(folderToDelete)}
                onHide={closeDeleteModal}
                centered
                className="folder-delete-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Supprimer le dossier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Voulez-vous vraiment supprimer le dossier "{folderToDelete?.title}" ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={closeDeleteModal}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteFolder}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FolderManager;