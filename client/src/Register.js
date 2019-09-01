import React, {Component} from 'react';
import './App.css';

class Register extends Component {
  constructor(){
    super();
    this.state = {
        email : "",
        password : ""
    }
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.registerUser.bind(this)}>
          <div>
            <label>Email</label>
            <input type = "text" id="email" name= "email" value = {this.state.email} onChange={this.handleChange}></input>
          </div>
          <div>
          <label>Password</label>
          <input type = "password" id="password" name= "password" value = {this.state.password} onChange={this.handleChange}></input>
          </div>
          <button type = "submit"> Register</button>
        </form>
      </div>
    );
  }
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  async registerUser(e) {
    e.preventDefault();

    try {
      await fetch("http://localhost:3001/register", {
        method: "POST",
        body: JSON.stringify(this.state),
        headers:{
          'Content-Type': 'application/json'
        }
      });

      this.props.history.push('/login');
    } catch (e) {
      console.log(e);
    }
  }
}

export default Register;
