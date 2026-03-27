import React, { useContext, useState } from 'react';
import './App.css';
import { TodoContext, TodoProvider } from './contexts/TodoContext';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/TodoList';
import FolderManager from './components/FolderManager/FolderManager';
import Footer from './components/Footer/Footer';
import CreateItemModal from './components/CreateItemModal/CreateItemModal';

function AppContent() {
  const { currentView } = useContext(TodoContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState('task');

  const openCreateModal = (tab = 'task') => {
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="App">
      <Header
        onCreateTask={() => openCreateModal('task')}
        onCreateFolder={() => openCreateModal('folder')}
      />

      <main className="app-main container mt-4">
        {currentView === 'folders' ? <FolderManager /> : <TodoList />}
      </main>

      <Footer onOpenModal={() => openCreateModal('task')} />

      <CreateItemModal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        initialTab={modalInitialTab}
      />
    </div>
  );
}

function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
}

export default App;
