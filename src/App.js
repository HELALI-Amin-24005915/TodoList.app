import React, { useState } from 'react';
import './App.css';
import { TodoProvider } from './contexts/TodoContext';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/TodoList';
import FolderManager from './components/FolderManager/FolderManager';
import TaskForm from './components/TaskForm/TaskForm';

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
            BIEN JOUÉ LE CONTEXTE EST INITIALISÉ ET LE COMPONENT TODOLIST MARCHE 👍👍👍👍👍👍👍👍👍
          </p>
          
          {/* switch between views*/}
          {showFolders ? (
            <FolderManager />
          ) : (
            <>
              <TaskForm />
              <TodoList />
            </>
          )}
        </main>

      </div>
    </TodoProvider>
  );
}

export default App;