import React, {Component} from 'react';
import './App.css';



class Home extends Component{
    constructor(){
        super();
        this.state = {
            notes : []
        }
    }

    render(){
        return (
            <div>
                <h3>HOME</h3>
                <button onClick={this.handleRegister.bind(this)} type="submit">Register</button>
                <button onClick={this.handleLogin.bind(this)} type="submit">Login</button>
                <button onClick = {this.checkAuth.bind(this)}>Verificar Autenticacion</button>
            </div>
        )
    }
    
    checkAuth = () =>{
        const token = localStorage.getItem('token');
        const refreshtoken = localStorage.getItem('refreshToken');
        if(!token){
            console.log("No esta autenticado")
        }else{
            console.log("Esta autenticado!")
        }
    }

    handleLogin(){
      this.props.history.push('/login');
    }
    handleRegister(){
        this.props.history.push('/register');
      }

}

export default Home;
