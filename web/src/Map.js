import React, { Component } from 'react'

export class Map extends Component {
  constructor (props) {
    super(props)
    this.mapRef = React.createRef()

    this.state = {
      points: [],
      selectedMarkerId: null,
      selectedMarkerInfoWindow: null
    }
  }

  componentDidMount () {
    this.map = new window.google.maps.Map(this.mapRef.current, {
      zoom: 13,
      center: {
        lat: 4.687668,
        lng: -74.0524933
      }
    })
  }

  componentDidUpdate (prevProps, prevState) {
    this.props.points.forEach(point => {
      if (!prevProps.points.includes(point)) {
        let marker = new window.google.maps.Marker({
          position: {
            lat: point.lat,
            lng: point.lng
          },
          animation: window.google.maps.Animation.DROP,
          map: this.map,
          icon: this.props.icons[point.type.name]
        })

        marker.addListener('click', (e) => {
          if (!this.state.selectedMarkerId || this.state.selectedMarkerId !== point._id) {
            if (this.state.selectedMarkerInfoWindow) this.state.selectedMarkerInfoWindow.close()

            let infowindow = new window.google.maps.InfoWindow({
              content: point.description
            })
            marker.setAnimation(window.google.maps.Animation.BOUNCE)

            setTimeout(() => {
              marker.setAnimation(null)
            }, 3000)

            infowindow.open(this.map, marker)

            this.props.changeSelectedPoint(point)

            this.setState({
              selectedMarkerId: point._id,
              selectedMarkerInfoWindow: infowindow
            })
          }
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
