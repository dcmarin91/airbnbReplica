import React, {Component} from 'react';
import './Map.css';
import Map from './Map'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAirbnb } from '@fortawesome/free-brands-svg-icons'



class Profile extends Component{
  constructor(props){
    super(props);
    this.state = {
      image: {},
    };
    this.fileInput = React.createRef();
  }

  render(){
    return (
      <div>
        <header>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
          <FontAwesomeIcon onClick={this.goHome.bind(this)} icon={faAirbnb} className="Logo"></FontAwesomeIcon>
          <nav>
            <ul className = "nav__links">
              <li><button onClick={this.handleLogout.bind(this)} type="submit">Logout</button></li>
            </ul>
          </nav>
        </header>
        <div style={{ margin: '100px' }}>
          <Map
            google={this.props.google}
            center={{lat: 40.731508, lng: -73.995667}}
            height='300px'
            zoom={15}
          />
        </div>
      </div>
    )
  }
  handleLogout(){
    this.props.history.push('/');
  }
  goHome(){
    this.props.history.push('/');
  }
}

export default Profile;