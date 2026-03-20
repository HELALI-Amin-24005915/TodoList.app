import './App.css';

function MyButton() {
  return (
    <button>Je suis un bouton</button>
  );
}

function App() {
  return (
    <div className="App">
      <h1>Ma ToDo-List</h1>
      <MyButton />
    </div>
  );
}

export default App;