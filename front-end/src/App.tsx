import Chessboard from 'chessboardjsx';
import React from 'react';
import MainPage from './components/MainPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import "./global.css"
import { useRecoilState } from 'recoil';
import { authAtom } from './atoms/auth';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';

function App() {

  const [auth, setAuth] = useRecoilState(authAtom)

  return (
      <Router>
        <Switch>
          {
            auth ? 
            <Route path="/">
              <MainPage/>
            </Route> :
            <>
            <Route path="/signup">
              <SignUpPage/>
            </Route>
            <Route exact path="/">
              <LoginPage/>
            </Route>
            </>
          }
        </Switch>
      </Router>
  );
}

export default App;
