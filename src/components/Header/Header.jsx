import React from 'react';
import './Header.css';

const Header = ({ onToggleView, isFolderView }) => {
  return (
    <header className="header">
      <h1>Gestionnaire de Tâches</h1>
      <button onClick={onToggleView}>
        {isFolderView ? 'Voir les Tâches' : 'Gérer les Dossiers'}
      </button>
    </header>
  );
};

export default Header;