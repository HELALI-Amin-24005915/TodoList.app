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
  const [modalInitialTab, setModalInitialTab] = useState('task');

  const toggleView = () => {
    setShowFolders(prev => !prev);
  };

  const openCreateModal = (tab = 'task') => {
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  return (
    <TodoProvider>
      <div className="App">
        <Header
          onToggleView={toggleView}
          isFolderView={showFolders}
          onCreateTask={() => openCreateModal('task')}
          onCreateFolder={() => openCreateModal('folder')}
          onGoTasks={() => setShowFolders(false)}
          onGoFolders={() => setShowFolders(true)}
        />
        
        <main className="app-main container mt-4">
          {showFolders ? (
            <FolderManager />
          ) : (
            <>
              <TodoList />
            </>
          )}
        </main>

        <Footer onOpenModal={() => openCreateModal('task')} />

        <CreateItemModal 
          show={isModalOpen} 
          onHide={() => setIsModalOpen(false)} 
          initialTab={modalInitialTab}
        />
      </div>
    </TodoProvider>
  );
}

export default App;
