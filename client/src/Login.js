import React, {Component} from 'react';
import './App.css';

class Login extends Component {
  constructor(){
    super();
    this.state = {
        email : "",
        password : "",
        token : "",
    }
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.loginUser.bind(this)}>
          <div>
            <label>Email</label>
            <input type = "text" id="email" name= "email" value = {this.state.email} onChange={this.handleChange}></input>
          </div>
          <div>
          <label>Password</label>
          <input type = "password" id="password" name= "password" value = {this.state.password} onChange={this.handleChange}></input>
          </div>
          <button type = "submit"> Login</button>
        </form>
      </div>
    );
  }
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  async loginUser(e) {
    e.preventDefault();
    try {
      await fetch("http://localhost:3001/login", {
        method: "POST",
        body: JSON.stringify(this.state),
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(
        (result) => {
          localStorage.setItem("Token",result.token);
        },
      )
      this.props.history.push('/');
    } catch (e) {
      console.log(e);
    }
  }
}

export default Login;
