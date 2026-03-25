import React, { useState } from 'react';
import './App.css';
import { TodoProvider } from './contexts/TodoContext';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/TodoList';
import FolderManager from './components/FolderManager/FolderManager';
import Footer from './components/Footer/Footer';
import CreateItemModal from './components/CreateItemModal/CreateItemModal';

function App() {
  const [showFolders, setShowFolders] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleView = () => {
    setShowFolders(prev => !prev);
  };

  return (
    <TodoProvider>
      <div className="App pb-5">
        <Header onToggleView={toggleView} isFolderView={showFolders} />
        
        <main className="app-main container mt-4">
          {showFolders ? (
            <FolderManager />
          ) : (
            <>
              <TodoList />
            </>
          )}
        </main>

        <Footer onOpenModal={() => setIsModalOpen(true)} />

        <CreateItemModal 
          show={isModalOpen} 
          onHide={() => setIsModalOpen(false)} 
        />
      </div>
    </TodoProvider>
  );
}

export default App;
