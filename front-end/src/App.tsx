import Chessboard from 'chessboardjsx';
import React from 'react';
import MainPage from './components/MainPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import "./global.css"

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <MainPage/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
