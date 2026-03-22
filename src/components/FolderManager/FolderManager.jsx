import React, { useContext, useState } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import { 
    MdFolder, MdHome, MdWork, MdSchool, 
    MdRocketLaunch, MdFavorite, MdShoppingCart, MdPeople 
} from 'react-icons/md';
import './FolderManager.css';

// association of icon keys to their respective components for easy rendering
const ICON_COMPONENTS = {
    folder: <MdFolder />,
    home: <MdHome />,
    work: <MdWork />,
    school: <MdSchool />,
    rocket: <MdRocketLaunch />,
    heart: <MdFavorite />,
    cart: <MdShoppingCart />,
    team: <MdPeople />
};

// dictionaries to map icon and color keys to their French labels for user-friendly display in dropdowns
const ICON_LABELS_FR = {
    folder: "Dossier Standard",
    home: "Maison / Personnel",
    work: "Travail / Pro",
    school: "Études / Cours",
    rocket: "Projet Urgent",
    heart: "Favoris",
    cart: "Achats",
    team: "Équipe / Groupe"
};

const COLOR_LABELS_FR = {
    orange: "Orange",
    pink: "Rose",
    bluesky: "Bleu Ciel",
    green: "Vert",
    red: "Rouge",
    purple: "Violet",
    yellow: "Jaune",
    grey: "Gris",
    brown: "Marron",
    cyan: "Cyan"
};

const COLOR_CLASS_NAMES = Object.keys(COLOR_LABELS_FR).reduce((acc, key) => {
    acc[key] = `folder-color-${key}`;
    return acc;
}, {});

const FolderManager = () => {
    // get data and functions from context
    const { folders, addFolder, deleteFolder, updateFolder } = useContext(TodoContext);
    
    // state for form inputs (title, description, color, icon) and editing mode
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('bluesky');
    const [iconKey, setIconKey] = useState('folder');

    // state to track which folder is being edited (null if creating a new one)
    const [editingId, setEditingId] = useState(null);

    // 10 colors
    const availableColors = Object.keys(COLOR_LABELS_FR);

    const getFolderColorClass = (folderColor) => COLOR_CLASS_NAMES[folderColor] || 'folder-color-default';

    //function to handle click on edit button, pre-filling the form with the folder's current data and switching to edit mode
    const handleEditClick = (folder) => {
        setTitle(folder.title);
        setDescription(folder.description || '');
        setColor(folder.color || 'bluesky');
        setIconKey(folder.icon || 'folder');
        setEditingId(folder.id);
    };

    // function to cancel editing, resetting the form and exiting edit mode
    const cancelEdit = () => {
        setTitle('');
        setDescription('');
        setColor('bluesky');
        setIconKey('folder');
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (title.trim().length < 3) {
            alert("Le titre doit comporter au moins 3 caractères.");
            return;
        }

        if (editingId) {
            // UPDATE MODE : modify the existing folder
            updateFolder(editingId, { title, description, color, icon: iconKey });
            setEditingId(null);
        } else {
            // CREATE MODE : add a new folder
            addFolder({ title, description, color, icon: iconKey, type: "custom" });
        }
        
        // reset form after submission
        setTitle('');
        setDescription('');
        setIconKey('folder');
        setColor('bluesky');
    };

    return (
        <div className="folder-manager">
            <h3>{editingId ? "Modifier la Catégorie" : "Créer une Catégorie"}</h3>
            
            <form onSubmit={handleSubmit} className="folder-form">
                <div className="form-group">
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Titre (min 3 caractères)" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Description (optionnelle)"
                    />
                </div>

                <div className="form-row">
                    <select value={color} onChange={(e) => setColor(e.target.value)}>
                        {availableColors.map(c => (
                            <option key={c} value={c}>{COLOR_LABELS_FR[c]}</option>
                        ))}
                    </select>

                    <select value={iconKey} onChange={(e) => setIconKey(e.target.value)}>
                        {Object.keys(ICON_COMPONENTS).map(key => (
                            <option key={key} value={key}>{ICON_LABELS_FR[key]}</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions folder-form-actions">
                    <button type="submit" className="btn-add">
                        {editingId ? "Mettre à jour" : "Créer la catégorie"}
                    </button>
                    {editingId && (
                        <button 
                            type="button" 
                            className="btn-cancel" 
                            onClick={cancelEdit} 
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            <div className="folder-grid">
                {folders.map(folder => (
                    <div 
                        key={folder.id} 
                        className={`folder-card ${getFolderColorClass(folder.color)}`}
                    >
                        <div className="folder-header">
                            <span className="icon-wrapper">
                                {ICON_COMPONENTS[folder.icon] || <MdFolder />}
                            </span>
                            <h4 className="folder-title">{folder.title}</h4>
                        </div>
                        
                        {/* display description if it exists */}
                        {folder.description && (
                            <p className="folder-description">
                                {folder.description}
                            </p>
                        )}
                        
                        <div className="folder-actions">
                            <button 
                                className="btn-edit" 
                                onClick={() => handleEditClick(folder)}
                            >
                                Modifier
                            </button>
                                <button 
                                    className="btn-delete" 
                                    onClick={() => deleteFolder(folder.id)}
                            >
                                    Supprimer
                                </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FolderManager;