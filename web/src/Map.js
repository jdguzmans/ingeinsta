import React, { Component } from 'react'

export class Map extends Component {
  constructor (props) {
    super(props)
    this.mapRef = React.createRef()
    this.google = window.google

    this.renderPoints = this.renderPoints.bind(this)
    this.markerLinkClicked = this.markerLinkClicked.bind(this)
  }

  componentDidMount () {
    this.map = new this.google.maps.Map(this.mapRef.current, {
      zoom: 13,
      center: {
        lat: 4.687668,
        lng: -74.0524933
      }
    })
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props === prevProps) console.log('props iguales')
    if (this.props.currentPosition) {
      let marker = new this.google.maps.Marker({
        position: {
          lat: this.props.currentPosition.latitude,
          lng: this.props.currentPosition.longitude
        },
        map: this.map,
        icon: this.props.icons['currentPosition']
      })
      marker.addListener('click', (e) => {
        let infowindow = new this.google.maps.InfoWindow({
          content: 'Usted está acá'
        })
        infowindow.open(this.map, marker)
      })
    }

    this.renderPoints()
  }

  renderPoints () {
    this.props.points.forEach(point => {
      let type
      this.props.types.forEach(t => {
        type = t._id === point.type ? t : type
      })

      let marker = new this.google.maps.Marker({
        position: {
          lat: point.lat,
          lng: point.lng
        },
        map: this.map,
        icon: this.props.icons[type.name]
      })

      marker.addListener('click', (e) => {
        let infowindow = new this.google.maps.InfoWindow({
          content: '<a onClick={changedShowedPoint(' + point._id + ')} > + point.description + </a>'
        })
        infowindow.open(this.map, marker)
      })
    })
  }

  markerLinkClicked () {
    console.log(111)
  }

  render () {
    return (
      <div ref={this.mapRef} id='map' />
    )
  }
}

export default Map
