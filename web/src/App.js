import React, { Component } from 'react'

import './App.css'

import MapContainer from './MapContainer'
import Point from './Point'
import Upload from './Upload'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPosition: null,
      points: [],
      types: []
    }

    this.backURL = 'http://localhost:3000'
    this.isMobile = navigator.platform.includes('Android') || navigator.platform.includes('iPhone')

    this.icons = {
      currentPosition: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/32/Map-Marker-Ball-Chartreuse.png',
      Pavimento: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/32/Map-Marker-Marker-Inside-Pink.png',
      Agua: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/32/Map-Marker-Marker-Outside-Azure.png'
    }

    this.getPoints = this.getPoints.bind(this)
    this.getTypes = this.getTypes.bind(this)

    this.getTypes()
    this.getPoints()
  }

  componentDidMount () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.setState({
            currentPosition: pos.coords
          })
        }
      )
      navigator.geolocation.watchPosition(
        (pos) => {
          this.setState({
            currentPosition: pos.coords
          })
        }
      )
    }
  }

  render () {
    return (
      <div className='app container-fluid' >
        <div className='container-fluid first-panel centered'>
          <h1>Ingeniería Visible</h1>
        </div>
        <div className='container-fluid second-panel centered'>
          <h3>Acá va una descripción</h3>
        </div>
        {window.google &&
        <div className='row third-panel container-fluid'>
          <MapContainer
            icons={this.icons}
            types={this.state.types}
            currentPosition={this.state.currentPosition}
            points={this.state.points}
          />
          <Point
            showedPointId={window.showedPointId}
          />
        </div>
        }
        <div className='row fourth-panel container-fluid'>
          <Upload canUpload={true || (this.isMobile && navigator.geolocation)} />
        </div>
      </div>
    )
  }

  getPoints () {
    fetch(this.backURL + '/points', {
      mode: 'cors'
    })
    .then(response => {
      if (response.status === 200) {
        return response.json()
      }
    })
    .then(points => {
      this.setState({
        points: points
      })
    })
    .catch(e => {
      throw e
    })
  }

  getTypes () {
    fetch(this.backURL + '/types', {
      mode: 'cors'
    })
    .then(response => {
      if (response.status === 200) {
        return response.json()
      }
    })
    .then(types => {
      this.setState({
        types: types
      })
    })
    .catch(e => {
      throw e
    })
  }
}

export default App
