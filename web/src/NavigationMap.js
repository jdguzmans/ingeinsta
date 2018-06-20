import React, { Component } from 'react'

export class NavigationMap extends Component {
  constructor (props) {
    super(props)
    this.mapRef = React.createRef()

    this.state = {
      markers: [],
      selectedMarkerId: null,
      selectedMarkerInfoWindow: null
    }
  }

  componentDidMount () {
    this.map = new window.google.maps.Map(this.mapRef.current, {
      zoom: 12,
      center: {
        lat: 4.607668,
        lng: -74.0524933
      },
      mapTypeId: window.google.maps.MapTypeId.HYBRID
    })

    this.setState({
      markers: []
    })
  }

  componentDidUpdate (prevProps, prevState) {
    let change = false

    if (prevProps.points.length !== this.props.points.length) change = true
    if (this.props.points.length !== prevState.markers.length) change = true

    for (let i = 0; i < prevProps.points.length; i++) {
      change = change || prevProps.points[i] !== this.props.points[i]
    }

    if (change) {
      this.state.markers.forEach(marker => {
        marker.setMap(null)
      })

      let markers = []

      this.props.points.forEach(newPoint => {
        let icon
        this.props.types.forEach(type => {
          icon = newPoint.type === type._id ? type.url : icon
        })

        let marker = new window.google.maps.Marker({
          position: {
            lat: newPoint.lat,
            lng: newPoint.lng
          },
          animation: window.google.maps.Animation.DROP,
          map: this.map,
          icon: icon
        })

        markers.push(marker)

        marker.addListener('click', (e) => {
          if (!this.state.selectedMarkerId || this.state.selectedMarkerId !== newPoint._id) {
            if (this.state.selectedMarkerInfoWindow) this.state.selectedMarkerInfoWindow.close()

            let infowindow = new window.google.maps.InfoWindow({
              content: newPoint.description
            })
            marker.setAnimation(window.google.maps.Animation.BOUNCE)

            setTimeout(() => {
              marker.setAnimation(null)
            }, 3000)

            infowindow.open(this.map, marker)

            this.props.changeSelectedPoint(newPoint)

            this.setState({
              selectedMarkerId: newPoint._id,
              selectedMarkerInfoWindow: infowindow
            })
          }
        })
      })
      this.setState({
        markers: markers
      })
    }
  }

  render () {
    return (
      <div ref={this.mapRef} id='map' />
    )
  }
}

export default NavigationMap
