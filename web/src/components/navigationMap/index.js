import React, { Component } from 'react'

export class NavigationMap extends Component {
  constructor (props) {
    super(props)
    this.mapRef = React.createRef()

    this.state = {
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
      markers: {}
    })
  }

  componentDidUpdate (prevProps, prevState) {
    let change = false

    let markers = this.state.markers

    for (let markerId in markers) {
      let deleted = true
      this.props.points.forEach(newPoint => {
        deleted = deleted && newPoint._id !== markerId
      })

      if (deleted) {
        change = true
        markers[markerId].setMap(null)
        delete markers[markerId]
      }
    }

    this.props.points.forEach(newPoint => {
      let created = true
      for (let markerId in markers) {
        created = created && newPoint._id !== markerId
      }

      if (created) {
        change = true
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
        markers[newPoint._id] = marker

        marker.addListener('click', (e) => {
          if (!this.state.selectedMarkerId || this.state.selectedMarkerId !== newPoint._id) {
            if (this.state.selectedMarkerInfoWindow) this.state.selectedMarkerInfoWindow.close()

            let infowindow = new window.google.maps.InfoWindow({
              content: newPoint.description
            })
            marker.setAnimation(window.google.maps.Animation.BOUNCE)

            setTimeout(() => {
              marker.setAnimation(null)
            }, 2000)

            infowindow.open(this.map, marker)

            this.props.changeSelectedPoint(newPoint)

            this.setState({
              selectedMarkerId: newPoint._id,
              selectedMarkerInfoWindow: infowindow
            })
          }
        })
      }
    })
    if (change) {
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
