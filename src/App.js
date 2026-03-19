import logo from './logo.svg';
import './App.css';

function info() {
    const info = "les blocs de construction de l’UI";
    return (
      <p>Les composants : {info}</p>
    );
}






function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
        <article>
          <h1>Mon premier composant</h1>
          {info()}
            <ol>
              <li>Les composants : </li>
              <li>Définir un composant</li>
              <li>Utiliser un composant</li>
            </ol>
        </article>
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
