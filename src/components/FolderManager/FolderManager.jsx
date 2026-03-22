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

// Dictionnary to map icon keys to their French labels for the dropdown
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
    const { folders, addFolder, deleteFolder } = useContext(TodoContext);
    
    // States for each required field
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('bluesky');
    const [iconKey, setIconKey] = useState('folder');

    // Colors for folder selection
    const availableColors = [
        'orange', 'pink', 'bluesky', 'green', 'red', 
        'purple', 'yellow', 'grey', 'brown', 'cyan'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Title must be at least 3 characters
        const success = addFolder({ 
            title, 
            description, 
            color, 
            icon: iconKey,
            type: "custom" 
        });
        
        if (success) {
            setTitle('');
            setDescription('');
            setIconKey('folder');
            setColor('bluesky');
        } else {
            alert("Le titre doit comporter au moins 3 caractères.");
        }
    };

    return (
        <div className="folder-manager">
            <h3>Gérer les Catégories</h3>
            
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
                        {/* Display the French label for each color */}
                        {availableColors.map(c => (
                            <option key={c} value={c}>{COLOR_LABELS_FR[c]}</option>
                        ))}
                    </select>

                    <select value={iconKey} onChange={(e) => setIconKey(e.target.value)}>
                        {/* Display the French label for each icon */}
                        {Object.keys(ICON_COMPONENTS).map(key => (
                            <option key={key} value={key}>{ICON_LABELS_FR[key]}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn-add">Créer la catégorie</button>
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
                        <button 
                            className="btn-delete" 
                            onClick={() => deleteFolder(folder.id)}
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FolderManager;