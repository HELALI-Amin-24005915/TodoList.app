import React, { useContext, useState } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import { 
    MdFolder, MdHome, MdWork, MdSchool, 
    MdRocketLaunch, MdFavorite, MdShoppingCart, MdPeople 
} from 'react-icons/md';
import './FolderManager.css';

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

const FolderManager = () => {
    // use context to get folders and folder management functions
    const { folders, addFolder, deleteFolder, updateFolder } = useContext(TodoContext);
    
    // state for form inputs
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('bluesky');
    const [iconKey, setIconKey] = useState('folder');

    // state to track if we are in edit mode and which folder is being edited
    const [editingId, setEditingId] = useState(null);

    const availableColors = [
        'orange', 'pink', 'bluesky', 'green', 'red', 
        'purple', 'yellow', 'grey', 'brown', 'cyan'
    ];

    //  function to handle edit button click, it fills the form with the folder's current data and switches to edit mode
    const handleEditClick = (folder) => {
        setTitle(folder.title);
        setDescription(folder.description || '');
        setColor(folder.color);
        setIconKey(folder.icon);
        setEditingId(folder.id); //switch to edit mode by setting the editingId to the folder's id
    };

    // function to handle cancel button click, it resets the form and exits edit mode
    const cancelEdit = () => {
        setTitle('');
        setDescription('');
        setColor('bluesky');
        setIconKey('folder');
        setEditingId(null); //exit edit mode by resetting the editingId
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (title.length < 3) {
            alert("Le titre doit comporter au moins 3 caractères.");
            return;
        }

        if (editingId) {
            // update existing folder
            updateFolder(editingId, { title, description, color, icon: iconKey });
            setEditingId(null);
        } else {
            // update the addFolder function to include type: "custom"
            addFolder({ title, description, color, icon: iconKey, type: "custom" });
        }
        
        // reset form fields after submission
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

                <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-add">
                        {editingId ? "Mettre à jour" : "Créer la catégorie"}
                    </button>
                    {editingId && (
                        <button type="button" className="btn-cancel" onClick={cancelEdit} style={{ background: '#6c757d', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            <div className="folder-grid">
                {folders.map(folder => (
                    <div 
                        key={folder.id} 
                        className="folder-card" 
                        style={{ borderTop: `5px solid var(--${folder.color}, ${folder.color})` }}
                    >
                        <div className="folder-header">
                            <span className="icon-wrapper">
                                {ICON_COMPONENTS[folder.icon] || <MdFolder />}
                            </span>
                            <h4>{folder.title}</h4>
                        </div>
                        <p className="folder-description">{folder.description}</p>
                        
                        {/* add action buttons */}
                        <div className="folder-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: 'auto' }}>
                            <button 
                                className="btn-edit" 
                                onClick={() => handleEditClick(folder)}
                                style={{ background: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
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