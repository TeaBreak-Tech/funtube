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

  const [ is_fullscreen, setIsFullScreen ] = React.useState(false)

  return (
    <div className="App">
      {is_fullscreen?null:<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <span className="App-title">
          Funtube Video
        </span>
      </header>}
      <Router>
        <Switch>
          <Route path="/">
            <PlayerPage 
              is_fullscreen={is_fullscreen}
              setIsFullScreen={setIsFullScreen}
            />
          </Route>
        </Switch>
      </Router>
      {is_fullscreen?null:<footer className="App-footer">
        <span>Copyright@2020 Prof. Zhang Qiang</span>
      </footer>}
    </div>
  );
}

export default App;
