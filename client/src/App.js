import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Profile from './Profile'


class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Home} />
        <Route path="/Login" component={Login} />
        <Route path="/Register" component={Register} />
        <Route path="/Profile" component={Profile} />
      </Router>
    );
  }
}

export default App;
