import React from 'react';

import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import PlayerPage from './PlayerPage/PlayerPage'
import PluginPlayer from './PluginPlayer/PluginPlayer'
import IndexPage from './IndexPage/IndexPage'
import TagPage from './TagPage/TagPage'

function App() {

  return (
    <div className="App">
      
      <Router>
        <Switch>

          <Route path="/test">
            <Redirect to="/player/default?mode=2&test=1"/>
          </Route>

          <Route path="/player/:videoId">
            <PlayerPage/>
          </Route>
          
          <Route exact path="/player">
            <Redirect to="/player/default?mode=2"/>
          </Route>

          <Route path="/plugin/">
            <PluginPlayer/>
          </Route>
        
          <Route exact path="/:tagTitle">
            <TagPage/>
          </Route>

          <Route exact path="/">
            <IndexPage/>
          </Route>
          
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;