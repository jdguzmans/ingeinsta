/* global FormData */

import React, { Component } from 'react'

import './App.css'

import Navbar from './Navbar'

import Home from './Home'
import Navigation from './Navigation'
import Upload from './Upload'

import parallel from 'async/parallel'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      section: 'Home',
      currentPosition: null,
      points: [],
      types: []
    }

    this.title = 'Ingeinsta'
    this.sections = [ 'Navegar', 'Subir' ]

    // this.backURL = 'http://localhost:3000'
    this.backURL = 'https://api.ingeinsta.com'

    this.icons = {
      newPoint: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/32/Map-Marker-Ball-Chartreuse.png',
      'Espacio público': 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/32/Map-Marker-Marker-Inside-Pink.png',
      Pavimento: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/32/Map-Marker-Marker-Outside-Azure.png'
    }

    this.changeSection = this.changeSection.bind(this)
    this.getTypesAndPoints = this.getTypesAndPoints.bind(this)
    this.uploadPoint = this.uploadPoint.bind(this)
  }

  changeSection (newSectionNumber) {
    this.setState({
      section: newSectionNumber !== this.sections.length ? this.sections[newSectionNumber] : 'Home'
    })
  }

  componentDidMount () {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
      (pos) => {
        let lat = pos.coords.latitude
        let lng = pos.coords.longitude

        let changedLat = !this.state.currentPosition || Math.abs(lat - this.state.currentPosition.lat) > 0.0000005
        let changedLng = !this.state.currentPosition || Math.abs(lng - this.state.currentPosition.lng) > 0.0000005

        if (changedLat || changedLng) {
          this.setState({
            currentPosition: {
              lat: lat,
              lng: lng
            }
          })
        }
      })
    }
    this.getTypesAndPoints()
  }

  render () {
    return (
      <div className='app container-fluid' >
        <Navbar
          title={this.title}
          section={this.state.section}
          sections={this.sections}
          changeSection={this.changeSection}
        />
        {
            this.state.section === 'Home'
            ? <Home />
            : this.state.section === this.sections[0]
            ? <Navigation
              backURL={this.backURL}
              icons={this.icons}
              types={this.state.types}
              currentPosition={this.state.currentPosition}
              points={this.state.points}
            />
            : <Upload
              currentPosition={this.state.currentPosition}
              types={this.state.types}
              uploadPoint={this.uploadPoint}
              uploadPointIcon={this.icons['newPoint']}
            />
          }
      </div>
    )
  }

  uploadPoint (point) {
    let data = new FormData()
    data.append('description', point.description)
    data.append('type', point.type)
    data.append('lat', point.lat)
    data.append('lng', point.lng)

    point.information.images.forEach((image, i) => {
      data.append('information_images_' + i, image)
    })

    fetch(this.backURL + '/points', {
      mode: 'cors',
      method: 'POST',
      body: data
    })
    .then(response => {
      this.getTypesAndPoints()
    })
  }

  getTypesAndPoints () {
    parallel([
      (cb) => {
        fetch(this.backURL + '/types', {
          mode: 'cors'
        })
        .then(response => {
          if (response.status === 200) {
            response.json()
            .then(types => {
              cb(null, types)
            })
          } else console.log('Problems reaching the server')
        })
      },
      (cb) => {
        fetch(this.backURL + '/points', {
          mode: 'cors'
        })
        .then(response => {
          if (response.status === 200) {
            response.json()
            .then(points => {
              cb(null, points)
            })
          } else console.log('Problems reaching the server')
        })
      }
    ],
    (err, res) => {
      if (err) console.log(err)
      else {
        let types = res[0]
        let points = res[1].map(point => {
          let type
          types.forEach(t => {
            type = t._id === point.type ? t : type
          })
          point.type = type
          return point
        })
        this.setState({
          types: types,
          points: points
        })
      }
    })
  }
}

export default App
