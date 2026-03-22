import React, { useState } from 'react';
import './App.css';
import { TodoProvider } from './contexts/TodoContext';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/TodoList';
import FolderManager from './components/FolderManager/FolderManager';

function App() {
  const [showFolders, setShowFolders] = useState(false);

  const toggleView = () => {
    setShowFolders(prev => !prev);
  };

  return (
    <TodoProvider>
      <div className="App">
        <Header onToggleView={toggleView} isFolderView={showFolders} />
        
        <main className="app-main">
          <h1>Ma ToDo-List</h1>
          <p>
            BIEN JOUER LE CONTEXTE ET INITIALISER ET LE COMPONENT TODOLIST MARCHE 👍👍👍👍👍👍👍👍👍
          </p>
          {/*switch between views*/ }
          {showFolders ? (
            <FolderManager />
          ) : (
            <TodoList />
          )}
        </main>

      </div>
    </TodoProvider>
  );
}

export default App;