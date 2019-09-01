import React, {Component} from 'react';
import './Map.css';
import Map from './Map'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAirbnb } from '@fortawesome/free-brands-svg-icons'



class Profile extends Component{
  constructor(props){
    super(props);
    this.state = {
      images: [],
    };
    this.fileInput = React.createRef();
  }

  render(){
    return (
      <div className = "Profile">
        <header>
          <FontAwesomeIcon onClick={this.goHome.bind(this)} icon={faAirbnb} className="Logo"></FontAwesomeIcon>
          <button onClick={this.handleLogout.bind(this)} type="submit">Logout</button>
        </header>
        <div style={{ margin: '100px' }}>
          <Map
            google={this.props.google}
            center={{lat: 40.731508, lng: -73.995667}}
            height='300px'
            zoom={15}
          />
        </div>
        <form onSubmit = {this.uploadPhoto.bind(this)}>
          <input type="file" name="image" ref = {this.fileInput}/>
          <input type="submit" value="Enviar" />
        </form>
      </div>
    )
  }
  async uploadPhoto(e) {
    e.preventDefault();

    const image = this.fileInput.current.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);

    const response = await fetch("http://localhost:3001/profile",{
      method: "post",
      body: formData
    })
    this.props.history.push('/profile');
  }
  handleLogout(){
    this.props.history.push('/');
  }
  goHome(){
    this.props.history.push('/');
  }
}

export default Profile;