import React, {Component} from 'react'
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import './Map.css';

Geocode.setApiKey("AIzaSyDv8mzlezsF6P5O-O82YLHL6hLoZfxijog");
Geocode.enableDebug();

export class Map extends Component {

  constructor( props ){
    super( props );
    this.state = {
      address: '',
      city: '',
      area: '',
      state: '',
      place_value: '',
      guests: '',
      adress: '',
      cost: '',
      description: '',
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      }
    };
    this.handleplaceChange = this.handleplaceChange.bind(this);
    this.handleguestsChange = this.handleguestsChange.bind(this);
    this.handleMarkerChange = this.handleMarkerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  handleplaceChange(event) {
    event.preventDefault();
  this.setState({place_value: event.target.value});
  }

  handleguestsChange(event) {
    event.preventDefault();
    this.setState({guests: event.target.value})
  }

  handleaddressChange(event) {
    this.setState({address: event.target.value})
  }

  updateAddress(event) {
    event.preventDefault();
    this.setState({adress: event.target.value})
  }

  updateCost(event) {
    event.preventDefault();
    this.setState({cost: event.target.value})
  }

  handleMarkerChange(event) {
    this.setState({markerPosition: event.target.value})
  }

  handleCityChange(event) {
    event.preventDefault();
    this.setState({city: event.target.value})
  }

  updateDescription(event) {
    event.preventDefault();
    this.setState({ description: event.target.value })
  }


  async handleSubmit(event) {
    //event.preventDefault();
    const image = this.fileInput.current.files[0];
    const formData = new FormData();
    const objArr = [];
    formData.append("image", image, image.name);
    formData.append("place_value", this.state.place_value);
    formData.append("guests", this.state.guests);
    formData.append("adress", this.state.adress);
    formData.append("city", this.state.city);
    formData.append("state", this.state.state);
    formData.append("cost", this.state.cost);
    formData.append("marker_lat", this.state.markerPosition.lat);
    formData.append("marker_lng", this.state.markerPosition.lng);
    formData.append("description", this.state.description);
    try {
      await fetch("http://localhost:3001/profile",{
        method: "post",
        body: formData,
        headers: {
          "Contetnt-Type":"multipart/form-data" 
        }
      })
      this.props.history.push('/');
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * Get the current address from the default map position and set those values in the state
   */
  componentDidMount() {
    Geocode.fromLatLng( this.state.mapPosition.lat , this.state.mapPosition.lng ).then(
      response => {
        const address = response.results[0].formatted_address,
              addressArray =  response.results[0].address_components,
              city = this.getCity( addressArray ),
              area = this.getArea( addressArray ),
              state = this.getState( addressArray );

        this.setState( {
          address: ( address ) ? address : '',
          area: ( area ) ? area : '',
          city: ( city ) ? city : '',
          state: ( state ) ? state : '',
        } )
      },
      error => {
        console.error( error );
      }
    );
  };
  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   *
   * @param nextProps
   * @param nextState
   * @return {boolean}
   */
  shouldComponentUpdate( nextProps, nextState ){
    if (
      this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.address !== nextState.address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.state !== nextState.state
    ) {
      return true
    } else if ( this.props.center.lat === nextProps.center.lat ){
      return false
    }
  }
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = ( addressArray ) => {
    let city = '';
    for( let i = 0; i < addressArray.length; i++ ) {
      if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
        city = addressArray[ i ].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = ( addressArray ) => {
    let area = '';
    for( let i = 0; i < addressArray.length; i++ ) {
      if ( addressArray[ i ].types[0]  ) {
        for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
          if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
            area = addressArray[ i ].long_name;
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getState = ( addressArray ) => {
    let state = '';
    for( let i = 0; i < addressArray.length; i++ ) {
      for( let i = 0; i < addressArray.length; i++ ) {
        if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
          state = addressArray[ i ].long_name;
          return state;
        }
      }
    }
  };
  /**
   * And function for city,state and address input
   * @param event
   */
  onChange = ( event ) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  /**
   * This Event triggers when the marker window is closed
   *
   * @param event
   */
  onInfoWindowClose = ( event ) => {

  };

  /**
   * When the marker is dragged you get the lat and long using the functions available from event object.
   * Use geocode to get the address, city, area and state from the lat and lng positions.
   * And then set those values in the state.
   *
   * @param event
   */
  onMarkerDragEnd = ( event ) => {
    let newLat = event.latLng.lat(),
        newLng = event.latLng.lng();

    Geocode.fromLatLng( newLat , newLng ).then(
      response => {
        const address = response.results[0].formatted_address,
              addressArray =  response.results[0].address_components,
              city = this.getCity( addressArray ),
              area = this.getArea( addressArray ),
              state = this.getState( addressArray );
        this.setState( {
          address: ( address ) ? address : '',
          area: ( area ) ? area : '',
          city: ( city ) ? city : '',
          state: ( state ) ? state : '',
          markerPosition: {
            lat: newLat,
            lng: newLng
          },
          mapPosition: {
            lat: newLat,
            lng: newLng
          },
        } )
      },
      error => {
        console.error(error);
      }
    );
  };

  /**
   * When the user types an address in the search box
   * @param place
   */
  
  onPlaceSelected = ( place ) => {
    console.log( 'plc', place );
    const address = place.formatted_address,
          addressArray =  place.address_components,
          city = this.getCity( addressArray ),
          area = this.getArea( addressArray ),
          state = this.getState( addressArray ),
          latValue = place.geometry.location.lat(),
          lngValue = place.geometry.location.lng();
    // Set these values in the state.
    this.setState({
      address: ( address ) ? address : '',
      area: ( area ) ? area : '',
      city: ( city ) ? city : '',
      state: ( state ) ? state : '',
      markerPosition: {
        lat: latValue,
        lng: lngValue
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue
      },
    })
  };

  render(){
    const AsyncMap = withScriptjs(
      withGoogleMap(
        props => (
          <GoogleMap google={ this.props.google }
                    defaultZoom={ this.props.zoom }
                    defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
          >
            {/* InfoWindow on top of marker */}
            <InfoWindow
              onClose={this.onInfoWindowClose}
              position={{ lat: ( this.state.markerPosition.lat + 0.0018 ), lng: this.state.markerPosition.lng }}
            >
              <div>
                <span style={{ padding: 0, margin: 0 }}>{ this.state.address }</span>
              </div>
            </InfoWindow>
            {/*Marker*/}
            <Marker google={this.props.google}
                    draggable={true}
                    onDragEnd={ this.onMarkerDragEnd }
                    position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
            />
            <Marker />
            {/* For Auto complete Search Box */}
            <Autocomplete
              style={{
                width: '100%',
                height: '40px',
                paddingLeft: '16px',
                marginTop: '2px',
                marginBottom: '500px'
              }}
              onPlaceSelected={ this.onPlaceSelected }
              types={['(regions)']}
            />
          </GoogleMap>
        )
      )
    );
    let map;
    if( this.props.center.lat !== undefined ) {
      map = <div>
        <div className = "container">
          <div className = "row">
            <div className = "col-md-6">
              <div className="form-group">
                <label htmlFor="">City</label>
                <input type="text" name="city" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.area }/>
              </div>
              <div className="form-group">
                <label htmlFor="">Area</label>
                <input type="text" name="area" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.city }/>
              </div>
              <div className="form-group">
                <label htmlFor="">State</label>
                <input type="text" name="state" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.state }/>
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className = "Form">
                  <label htmlFor="">Please enter the info</label>
                  <div className = "selector">
                    <select  onChange={this.handleplaceChange} name="Place_Type">
                      <option selected value = "ENTIRE APARTMENT">Entire Place</option>
                      <option value = "PRIVATE ROOM IN APARTMENT">Private Room</option>
                      <option value = "SHARED ROOM IN APARTMENT">Shared Room</option>
                    </select>
                    <select name="Guests" onChange={this.handleguestsChange}>
                      <option value = "1">for 1 guest</option>
                      <option value = "2">for 2 guests</option>
                      <option value = "3">for 3 guests</option>
                      <option selected value = "4">for 4 guests</option>
                      <option value = "5">for 5 guests</option>
                      <option value = "6">for 6 guests</option>
                    </select>
                  </div>
                  <div className = "information">
                    <div className = "input-text">
                      <input type="text" onChange={this.updateAddress.bind(this)} placeholder= "Adress"/>
                    </div>
                    <div className = "input-text">
                      <input type="text" onChange={this.updateCost.bind(this)} placeholder= "Cost per night"/>
                    </div>
                    <div className = "input-text">
                    <textarea onChange={this.updateDescription.bind(this)} placeholder= "Add a description for your place"></textarea>
                    </div>
                    <input type="file" name="image" ref = {this.fileInput}/>
                  </div>
                </div>
                <input type="submit" value="Create Place" />
              </form>
          </div>
          <div className = "col-md-6">
            <AsyncMap
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDv8mzlezsF6P5O-O82YLHL6hLoZfxijog&libraries=places"
              loadingElement={
                <div style={{ height: `100%` }} />
              }
              containerElement={
                <div style={{ height: this.props.height }} />
              }
              mapElement={
                <div style={{ height: `100%` }} />
              }
            />
          </div>
        </div>
      </div>
    </div>
    } else {
      map = <div style={{height: this.props.height}} />
    }
    return( map )
  }
}
export default Map
