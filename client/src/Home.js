import React, {Component} from 'react';
import './Home.css';
import MapContainer from './MapContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAirbnb } from '@fortawesome/free-brands-svg-icons'




class Home extends Component{
  constructor(){
    super();
    this.state = {
      autenticated : false,
      houses : []
    }
    this.checkAuth =  this.checkAuth.bind(this);
  }

  render(){
    return (
      <div>
        <header>
          <FontAwesomeIcon onClick={this.goHome.bind(this)} icon={faAirbnb} className="Logo"></FontAwesomeIcon>
          <nav>
            <ul className="nav__links">
              {!this.state.autenticated ? <li><button onClick={this.handleRegister.bind(this)} type="submit">Register</button>
              <button onClick={this.handleLogin.bind(this)} type="submit">Login</button>
              </li> :
              <ul className="nav__links">
                <li><button onClick={this.handleLogout.bind(this)} type="submit">Logout</button></li>
                <li><button onClick={this.handleProfile.bind(this)} type="submit">Create</button></li>
              </ul>
              }
            </ul>
          </nav>
        </header>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
        <h4>Where to stay</h4>
        <div className = "container">
          <div className = "row">
            <div className = "col-md-8">
                {this.state.houses.map(house =>
                  <div className="house" key={house._id}>
                    <div className = "container">
                      <div className = "row">
                        <div className = "col-md-6">
                          <img src = {house.image} height="285" width="320"/>
                        </div>
                        <div className = "col-md-6">
                          <h5>{house.placeType} for {house.guests}  guests</h5>
                          <h3>{house.description}</h3>
                          <p>{house.cost} USD/night</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <div className = "col-md-4">
              <MapContainer />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  async componentDidMount(){
    this.checkAuth();
    let response = await fetch("http://localhost:3001");
    let data = await response.json();
    this.setState({houses : data});
    //console.log(this.state.autenticated);
  }

  goHome(){
    this.props.history.push('/');
  }

  checkAuth (){
    let token = localStorage.getItem("Token");
    if(token !== "undefined"){
      this.setState({
        autenticated: true
      })
    }else{
      this.setState({
        autenticated: false
      })
    }
  }

  handleLogin(){
    this.props.history.push('/login');
  }
  handleRegister(){
    this.props.history.push('/register');
  }
  handleLogout(){
    this.setState({
      autenticated: false
    })
    this.props.history.push('/');
  }
  handleProfile(){
    this.props.history.push('/profile')
  }
}

export default Home;
