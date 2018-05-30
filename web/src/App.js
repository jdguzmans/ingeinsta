import React, { Component } from 'react'

import './App.css'

import Map from './Map'
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
    this.renderFilters = this.renderFilters.bind(this)
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
        <div className='row third-panel container-fluid'>
          <div className='container-fluid row'>
            <div className='container-fluid col-sm-3 centered'>
              <h3>Filtros</h3>
            </div>
            <div className='container-fluid row col-sm-9'>
              {this.renderFilters()}
            </div>
          </div>
          {window.google &&
            <Map
              icons={this.icons}
              types={this.state.types}
              currentPosition={this.state.currentPosition}
              points={this.state.points}
          />
          }
        </div>
        <div className='row fourth-panel container-fluid'>
          <h2>H</h2>
        </div>
        <div className='row fifth-panel container-fluid'>
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

  renderFilters () {
    let toReturn = []

    let i = 0
    while (i < this.state.types.length) {
      toReturn.push(
        <div className='container-fluid row centered' key={i}>
          {this.renderTypeFilter(this.state.types[i])}
          {(i + 1) < this.state.types.length ? this.renderTypeFilter(this.state.types[i + 1]) : ' '}
        </div>
      )
      i = i + 2
    }
    return toReturn
  }

  renderTypeFilter (type) {
    return (
      <div className='col-sm-6 form-check' >
        <input className='form-check-input' type='checkbox' id='defaultCheck1' />
        <label className='form-check-label' htmlFor='defaultCheck1'>
          {type.name}
        </label>
      </div>
    )
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
