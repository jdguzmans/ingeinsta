/* global FormData */

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
    return new Promise((resolve, reject) => {
      let data = new FormData()
      data.append('description', point.description)
      data.append('type', point.type)
      data.append('lat', point.lat)
      data.append('lng', point.lng)

      point.information.images.forEach((image, i) => {
        data.append('information_images_' + i, image)
      })

      fetch(BACKEND_URL + '/points', {
        mode: 'cors',
        method: 'POST',
        body: data
      })
      .then(response => {
        this.getTypesAndPoints()
        resolve()
      })
    })
  }

  getTypesAndPoints () {
    parallel([
      (cb) => {
        fetch(BACKEND_URL + '/types', {
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
      }, (cb) => {
        fetch(BACKEND_URL + '/points', {
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
    ], (err, res) => {
      if (err) console.log(err)
      else {
        let types = res[0]
        let points = res[1]

        this.setState({
          types: types,
          points: points
        })
      }
    })
  }
}

export default App
