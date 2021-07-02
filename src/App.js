import './App.css';
import "@reach/dialog/styles.css";
import { Route, Link } from 'react-router-dom'
import Pokedex from "./Pokedex";
import Login from "./Login"

function App() {  
  return (
    <div className="App">
      <Route exact path="/" component={Login} />
    </div>
  )
}

export default App;
