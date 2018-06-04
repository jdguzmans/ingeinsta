/* global FormData */

import React, { Component } from 'react'

import './App.css'

import MapContainer from './MapContainer'
import Upload from './Upload'

import parallel from 'async/parallel'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPosition: null,
      // currentPosition: {
      //   lat: '4,6887668',
      //   lng: '-74,0594933'
      // },
      points: [],
      types: []
    }

    this.backURL = 'http://localhost:3000'
    // this.backURL = 'http://45.77.75.20:3000'

    this.isMobile = navigator.platform.includes('Android') || navigator.platform.includes('iPhone')

    this.icons = {
      currentPosition: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/32/Map-Marker-Ball-Chartreuse.png',
      'Espacio público': 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/32/Map-Marker-Marker-Inside-Pink.png',
      Pavimento: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/32/Map-Marker-Marker-Outside-Azure.png'
    }

    this.getTypesAndPoints = this.getTypesAndPoints.bind(this)
    this.uploadPoint = this.uploadPoint.bind(this)
  }

  componentDidMount () {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
      (pos) => {
        this.setState({
          currentPosition: pos.coords
        })
        console.log(1)
      })
    }
    this.getTypesAndPoints()
  }

  render () {
    return (
      <div className='app container-fluid' >
        <div className='container-fluid first-panel centered'>
          <h1>Ingeninsta</h1>
        </div>
        <div className='container-fluid second-panel centered'>
          <h3>Acá va una descripción, zolo miyoz, Duque es el que es</h3>
        </div>
        {window.google &&
        <div className='row third-panel container-fluid'>
          <MapContainer
            backURL={this.backURL}
            icons={this.icons}
            types={this.state.types}
            currentPosition={this.state.currentPosition}
            points={this.state.points}
          />
        </div>
        }
        <div className='row fourth-panel container-fluid'>
          <Upload
            canUpload={true || (this.isMobile && navigator.geolocation)}
            currentPosition={this.state.currentPosition ? this.state.currentPosition : {lat: 1, lng: 1}}
            types={this.state.types}
            uploadPoint={this.uploadPoint}
          />
        </div>
      </div>
    )
  }

  uploadPoint (point) {
    // let data = new FormData()
    // data.append('descripton', point.description)
    // data.append('type', point.type)
    // data.append('lat', point.lat)
    // data.append('lng', point.lng)
    // data.append('files', point.lng)

    fetch(this.backURL + '/points', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(point)
    })
    .then(response => {

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
