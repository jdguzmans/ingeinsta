import React, { Component } from 'react'

export class Map extends Component {
  constructor (props) {
    super(props)
    this.uploadMapRef = React.createRef()

    this.state = {
      positionMarker: null
    }

    this.useCurrentPositionCoords = this.useCurrentPositionCoords.bind(this)
  }

  componentDidMount () {
    let map = new window.google.maps.Map(this.uploadMapRef.current, {
      zoom: 12,
      center: {
        lat: 4.607668,
        lng: -74.0524933
      },
      mapTypeId: window.google.maps.MapTypeId.HYBRID
    })

    map.addListener('click', (e) => {
      if (this.state.positionMarker) this.state.positionMarker.setMap(null)
      let coords = e.latLng
      let lat = coords.lat()
      let lng = coords.lng()

      let marker = new window.google.maps.Marker({
        position: {
          lat: lat,
          lng: lng
        },
        animation: window.google.maps.Animation.DROP,
        map: map,
        icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
      })

      this.setState({
        positionMarker: marker
      })

      this.props.handlePositionChange(lat, lng)
    })

    this.map = map
  }

  useCurrentPositionCoords () {
    if (this.state.positionMarker) this.state.positionMarker.setMap(null)
    const { lat, lng } = this.props.currentPosition

    this.map.setCenter({ lat: lat, lng: lng })

    let marker = new window.google.maps.Marker({
      position: {
        lat,
        lng
      },
      animation: window.google.maps.Animation.DROP,
      map: this.map,
      icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    })

    this.setState({
      positionMarker: marker
    })

    this.props.handlePositionChange(lat, lng)
  }

  render () {
    return (
      <div className='container-fluid'>
        <div className='centered-text'>
          <label><b>Posición</b></label>
        </div>
        <div className='centered-text'>
          <h6>Seleccione la ubicación manualmente o utilice la de su dispositivo</h6>
        </div>
        <div ref={this.uploadMapRef} id='upload-map' />
        <div className='col-sm-6 offset-sm-6'>
          {this.props.currentPosition
            ? <button type='button' className='btn btn-secondary btn-sm' onClick={this.useCurrentPositionCoords} disabled={!this.props.currentPosition}>Utilizar mi posición actual</button>
            : <label>Geolocalización deshabilitada</label>
          }
        </div>
      </div>
    )
  }
}

export default Map
