import React from 'react';
import './App.css';
import { TodoProvider } from './contexts/TodoContext';
import TodoList from './components/TodoList/TodoList';


function App() {

 
  return (
    <TodoProvider>
      <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Ma ToDo-List</h1>
        <p>BIEN JOUER LE CONTEXTE ET INITIALISER ET LE COMPONENT TODOLIST MARCHE 👍👍👍👍👍👍👍👍👍 </p>

        <TodoList />
      </div>
    </TodoProvider>
  );
}

export default App;