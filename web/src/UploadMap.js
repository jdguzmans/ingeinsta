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
      zoom: 13,
      center: {
        lat: 4.687668,
        lng: -74.0524933
      }
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
        map: this.map,
        icon: this.props.uploadPointIcon
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
    let coords = this.props.currentPosition
    let lat = coords.lat
    let lng = coords.lng

    let marker = new window.google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      animation: window.google.maps.Animation.DROP,
      map: this.map,
      icon: this.props.uploadPointIcon
    })

    this.setState({
      positionMarker: marker
    })

    this.props.handlePositionChange(lat, lng)
  }

  render () {
    return (
      <div className='container-fluid'>
        <div className='centered'>
          <label>Posición</label>
        </div>
        <div ref={this.uploadMapRef} id='upload-map' />
        <div className='col-sm-4 offset-sm-3'>
          <button type='button' className='btn btn-secondary' onClick={this.useCurrentPositionCoords} disabled={!this.props.currentPosition}>Utilizar mi posición actual</button>
        </div>
      </div>
    )
  }
}

export default Map