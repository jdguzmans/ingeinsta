import React, { Component } from 'react'
import {Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react'

export class MapContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showingInfoWindow: false,
      activePoint: null
    }

    this.renderPoints = this.renderPoints.bind(this)
    this.onMarkerClick = this.onMarkerClick.bind(this)
    this.onMapClicked = this.onMapClicked.bind(this)
  }

  render () {
    let style = {
      width: '75%',
      height: '75%'
    }
    return (
      <Map
        className='container-fluid'
        google={this.props.google}
        zoom={14}
        initialCenter={{
          lat: 4.687668,
          lng: -74.0524933
        }}
        onClick={this.onMapClicked}
        style={style}
      >
        {this.renderPoints()}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h1>{this.state.showingInfoWindow && this.state.activePoint.description}</h1>
            <h2>HHHH</h2>
            <h2>HHHH</h2>
            <h2>HHHH</h2>
            <h2>HHHH</h2>
            <h2>HHHH</h2>
          </div>
        </InfoWindow>
      </Map>
    )
  }

  onMapClicked (props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        locationMarker: false
      })
    }
  };

  onMarkerClick (point, googleMapsMarker) {
    this.setState({
      showingInfoWindow: true,
      activePoint: point,
      activeMarker: googleMapsMarker
    })
  }

  renderPoints () {
    return this.props.points.map((point, i) => {
      return (
        <Marker
          key={'m-' + point.id}
          position={{lat: point.lat, lng: point.lng}}
          title={point.description}
          onClick={(dontKnowWhatThisIsFor1, marker, dontKnowWhatThisIsFor2) => {
            this.onMarkerClick(point, marker)
          }}
        />
      )
    })
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyBIofKMhBAYr1X_3Yj6yBcpuok1M6_Iqww')
})(MapContainer)
