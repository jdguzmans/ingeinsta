import React, { Component } from 'react'

export class Map extends Component {
  constructor (props) {
    super(props)
    this.mapRef = React.createRef()
    this.google = window.google

    this.state = {
      points: []
    }
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

  componentDidUpdate (prevProps, prevState) {
    // WHAT HAPPENS IF THE PERSON MOVES?
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

    this.props.points.forEach(point => {
      if (!prevProps.points.includes(point)) {
        let marker = new this.google.maps.Marker({
          position: {
            lat: point.lat,
            lng: point.lng
          },
          map: this.map,
          icon: this.props.icons[point.type.name]
        })

        marker.addListener('click', (e) => {
          let infowindow = new this.google.maps.InfoWindow({
            content: point.description
          })
          infowindow.open(this.map, marker)
          this.props.changeSelectedPoint(point)
        })
      }
    })

    // WHAT HAPPENS IF A POINT IS DELETED?
  }

  render () {
    return (
      <div ref={this.mapRef} id='map' />
    )
  }
}

export default Map
