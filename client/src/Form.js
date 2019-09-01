import React, {Component} from 'react';
import Map from './Map';

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      place_value: 'entireplace',
      guests: '4',
      adress: ''
    };

    this.handleplaceChange = this.handleplaceChange.bind(this);
    this.handleguestsChange = this.handleguestsChange.bind(this);
    this.handleadressChange = this.handleadressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleplaceChange(event) {
    this.setState({place_value: event.target.value});
  }

  handleguestsChange(event) {
    this.setState({guests: event.target.value})
  }

  handleadressChange(event) {
    this.setState({adress: event.target.value})
  }
  async handleSubmit(event) {
    event.preventDefault();

    try {
      await fetch("http://localhost:3001/profile", {
        method: "POST",
        body: JSON.stringify(this.state),
        headers:{
          'Content-Type': 'application/json'
        }
      });

      this.props.history.push('/profile');
    } catch (e) {
      console.log(e);
    }
  }

  render (){
    return (
      <form onSubmit={this.handleSubmit}>
        <div className = "Form">
          <select value={this.state.place_value} onChange={this.handleplaceChange} name="Place_Type">
            <option selected value = "entireplace">Entire Place</option>
            <option value = "privateroom">Private Room</option>
            <option value = "sharedroom">Shared Room</option>
          </select>
          <select name="Guests" value={this.state.guests} onChange={this.handleguestsChange}>
            <option value = "1">for 1 guest</option>
            <option value = "2">for 2 guests</option>
            <option value = "3">for 3 guests</option>
            <option selected value = "4">for 4 guests</option>
            <option value = "5">for 5 guests</option>
            <option value = "6">for 6 guests</option>
          </select>
          <div>
            <input type="text" value={this.state.adress} onChange={this.handleadressChange} placeholder= "Direccion"/>
          </div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    )
  }
}

export default Form;