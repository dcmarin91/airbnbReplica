import React, {Component} from 'react';
import {Map, Marker, GoogleApiWrapper, InfoWindow} from 'google-maps-react';

export class MapContainer extends Component {
  constructor() {
    super()
    this.state = {
      latitude: '',
      longitude: '',
      places: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    }
  }
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  async componentDidMount(){
    let response = await fetch("http://localhost:3001");
    let data = await response.json();
    this.setState({places : data});
  }
  render() {
    return (
      <div>
        <Map google={this.props.google}
          zoom={12.5}
          style={{height: '800px', position: 'absolute'}}
          className={'Map'}
          initialCenter={{
            lat: 40.7298716,
            lng: -73.995667
          }}>
          {this.state.places.map(place =>
            <Marker onClick={this.onMarkerClick}
              title = {place.cost}
              position = {{
                lat: place.marker.lat,
                lng: place.marker.lng
            }}/>
          )}
          <InfoWindow
          marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
              <div>
                <h1>{this.state.selectedPlace.title} USD/night</h1>
              </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ("AIzaSyDv8mzlezsF6P5O-O82YLHL6hLoZfxijog")
})(MapContainer)