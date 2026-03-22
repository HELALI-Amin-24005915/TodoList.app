import React, { useContext, useState } from 'react';
import { TodoContext } from '../../contexts/TodoContext';
import './FolderManager.css';

const FolderManager = () => {
    const { folders, addFolder, deleteFolder } = useContext(TodoContext);
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('orange');

    // List of 10 colors as per requirements
    const availableColors = [
        'orange', 'pink', 'bluesky', 'green', 'red', 
        'purple', 'yellow', 'grey', 'brown', 'cyan'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = addFolder({ title, color, description: '', icon: '' });
        if (success) setTitle('');
        else alert("Le titre doit comporter au moins 3 caractères.");
    };

    return (
        <div className="folder-manager">
            <h3>Manage Categories</h3>
            <form onSubmit={handleSubmit} className="folder-form">
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="New Category..." 
                />
                <select value={color} onChange={(e) => setColor(e.target.value)}>
                    {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="submit">Add</button>
            </form>

            <div className="folder-grid">
                {folders.map(folder => (
                    <div key={folder.id} className="folder-card" style={{ borderTop: `4px solid ${folder.color}` }}>
                        <h4>{folder.title}</h4>
                        <button onClick={() => deleteFolder(folder.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FolderManager;