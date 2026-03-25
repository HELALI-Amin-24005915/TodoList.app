import React, { useContext } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import { FaFolderOpen, FaTrash, FaListUl } from 'react-icons/fa'; // Icônes pro
import './FolderManager.css';

const FolderManager = () => {
    const { folders, deleteFolder, getTasksByFolder } = useContext(TodoContext);

    const getBorderColor = (color) => {
        switch(color) {
            case 'bluesky': return 'border-primary text-primary';
            case 'orange': return 'border-warning text-warning';
            case 'pink': return 'border-danger text-danger';
            case 'green': return 'border-success text-success';
            default: return 'border-secondary text-secondary';
        }
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

                        return (
                            <div key={folder.id} className="col-md-4 mb-4">
                                <div className={`card shadow-sm h-100 folder-card ${getBorderColor(folder.color)}`} style={{ borderLeftWidth: '5px' }}>
                                    <div className="card-body">
                                        <h4 className="card-title d-flex align-items-center gap-2 mb-3">
                                            <FaFolderOpen /> {folder.title}
                                        </h4>
                                        
                                        <p className="card-text text-muted mb-0 d-flex align-items-center gap-2">
                                            <FaListUl /> 
                                            {folderTasks.length} tâche(s) associée(s)
                                        </p>
                                    </div>
                                    <div className="card-footer bg-transparent border-0 text-end">
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