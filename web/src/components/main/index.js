/* global FormData fetch */

import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'

import './styles.css'

import Navbar from '../navbar'

import Home from '../home'
import Navigation from '../navigation'
import Upload from '../upload'

import parallel from 'async/parallel'

const { BACKEND_URL } = require('../../config')

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      section: 'Home',
      currentPosition: null,
      points: [],
      types: []
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
          const { coords: { latitude: lat, longitude: lng } } = pos

          const changedLat = !this.state.currentPosition || Math.abs(lat - this.state.currentPosition.lat) > 0.0000005
          const changedLng = !this.state.currentPosition || Math.abs(lng - this.state.currentPosition.lng) > 0.0000005

          if (changedLat || changedLng) {
            this.setState({
              currentPosition: {
                lat,
                lng
              }
            })
          }
        })
    }
    this.getTypesAndPoints()
  }

  render () {
    return (
      <Router>
        <div className='app container-fluid padding-bottom' >
          <Navbar
            title={this.title}
            section={this.state.section}
            sections={this.sections}
            changeSection={this.changeSection}
          />
          {this.state.loading
            ? <div className='loader' />
            : <div>
              <Route exact path='/' component={Home} />
              <Route
                path='/navigate'
                render={(props) =>
                  <Navigation
                    {...props}
                    backURL={this.backURL}
                    types={this.state.types}
                    currentPosition={this.state.currentPosition}
                    points={this.state.points}
                  />
                }
              />
              <Route
                path='/upload'
                render={(props) =>
                  <Upload
                    {...props}
                    currentPosition={this.state.currentPosition}
                    types={this.state.types}
                    uploadPoint={this.uploadPoint}
                  />
                }
              />
            </div>
          }
        </div>
      </Router>
    )
  }

  uploadPoint (point) {
    return new Promise(async (resolve, reject) => {
      const data = new FormData()
      data.append('description', point.description)
      data.append('type', point.type)
      data.append('lat', point.lat)
      data.append('lng', point.lng)

      point.information.images.forEach((image, i) => {
        data.append('information_images_' + i, image)
      })

      await fetch(BACKEND_URL + '/points', {
        mode: 'cors',
        method: 'POST',
        body: data
      })

      this.getTypesAndPoints()
      resolve()
    })
  }

  getTypesAndPoints () {
    parallel([
      async (cb) => {
        const response = await fetch(BACKEND_URL + '/types', {
          mode: 'cors'
        })

        if (response.status === 200) {
          const types = await response.json()
          cb(null, types)
        } else console.log('Problems reaching the server')
      }, async (cb) => {
        const response = await fetch(BACKEND_URL + '/points', {
          mode: 'cors'
        })
        if (response.status === 200) {
          const points = await response.json()
          cb(null, points)
        } else console.log('Problems reaching the server')
      }
    ], (err, res) => {
      if (err) console.log(err)
      else {
        const types = res[0]
        const points = res[1]

        this.setState({
          types: types,
          points: points
        })
      }
    })
  }
}

export default App
