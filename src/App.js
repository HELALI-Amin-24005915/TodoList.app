/**
 * @fileoverview Root composition module for the Todo application.
 * It wires global providers, high-level layout regions, and top-level feature views.
 */
import React, { useContext, useState } from 'react';
import './App.css';
import { TodoContext, TodoProvider } from './contexts/TodoContext';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/TodoList';
import FolderManager from './components/FolderManager/FolderManager';
import Footer from './components/Footer/Footer';
import CreateItemModal from './components/CreateItemModal/CreateItemModal';

/**
 * Main application content rendered inside the global provider.
 * It handles view switching and shared create modal orchestration.
 *
 * @returns {JSX.Element} The application shell.
 */
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

/**
 * Root application component.
 * Wraps the complete UI in the Todo context provider.
 *
 * @returns {JSX.Element} The context-enabled app.
 */
function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
}

export default App;
