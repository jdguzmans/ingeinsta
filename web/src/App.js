import React, { Component } from 'react'
// https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/
import MapContanier from './MapContainer'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      points: [],
      types: []
    }

    if (!navigator.geolocation) console.log('No navigator geolocation')

    this.backURL = 'http://localhost:3000'
    this.getPoints = this.getPoints.bind(this)
    this.renderFilters = this.renderFilters.bind(this)
    this.getTypes = this.getTypes.bind(this)

    this.getPoints()
    this.getTypes()
  }

  componentDidMount () {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          this.setState({
            coordinates: pos.coords
          })
        },
        (err) => {
          console.log('ERROR' + err)
        }
      )
    }
  }

  render () {
    return (
      <div className='app container-fluid' >
        <div className='container-fluid first-panel'>
          <h1>Ingeniería Visible</h1>
        </div>
        <div className='row second-panel container-fluid'>
          <div className='left-half col-sm-6 container-fluid'>
            <div className='container-fluid'>
              <div className='container-fluid'>
                <h2>Filtros</h2>
              </div>
              <div className='container-fluid'>
                {this.renderFilters()}
              </div>
            </div>
            <div className='container-fluid'>
              <MapContanier
                points={this.state.points}
              />
            </div>
          </div>
          <div className='right-half col-sm-6'>
            <h2>H</h2>
            <h2>H</h2>
          </div>
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
        <div className='container-fluid' key={i}>
          {this.renderTypeFilter(this.state.types[i])}
          {(i + 1) < this.state.types.length ? this.renderTypeFilter(this.state.types[i + 1]) : ' '}
        </div>
      )
      i = i + 2
    }
    return toReturn
  }

  renderTypeFilter (filter) {
    return (
      <div className='col-sm-6' >
        <input type='checkbox' />
        <label>Subscribe to newsletter?</label>
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
