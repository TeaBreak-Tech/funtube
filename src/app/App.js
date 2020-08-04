import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import PlayerPage from './PlayerPage/PlayerPage'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="App-title">
          Funtube Video
        </p>
      </header>
      <Router>
        <Switch>
          <Route path="/">
            <PlayerPage />
          </Route>
        </Switch>
      </Router>
      <footer className="App-footer">
        <span>Copyright@2020 Prof. Zhang Qiang</span>
      </footer>
    </div>
  );
}

export default App;
