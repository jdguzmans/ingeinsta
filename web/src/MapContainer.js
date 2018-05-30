import React, { Component } from 'react'

import Map from './Map'
import Point from './Point'

export class MapContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedPoint: null,
      fetchedPoint: null
    }

    this.renderFilters = this.renderFilters.bind(this)
    this.changeSelectedPoint = this.changeSelectedPoint.bind(this)
    this.fetchPoint = this.fetchPoint.bind(this)
  }

  render () {
    return (
      <div className='container-fluid row'>
        <div className='container-fluid col-sm-3 centered'>
          <h3>Filtros</h3>
        </div>
        <div className='container-fluid row col-sm-9'>
          {this.renderFilters()}
        </div>
        <Map
          icons={this.props.icons}
          types={this.props.types}
          currentPosition={this.props.currentPosition}
          points={this.props.points}
          changeSelectedPoint={this.changeSelectedPoint}
        />
        {this.state.selectedPoint &&
        <div className='point'>
          <Point
            selectedPoint={this.state.selectedPoint}
            fetchPoint={this.fetchPoint}
            fetchedPoint={this.state.fetchedPoint}
          />
        </div>
        }
      </div>
    )
  }

  renderFilters () {
    let toReturn = []

    let i = 0
    while (i < this.props.types.length) {
      toReturn.push(
        <div className='container-fluid row centered' key={i}>
          {this.renderTypeFilter(this.props.types[i])}
          {(i + 1) < this.props.types.length ? this.renderTypeFilter(this.props.types[i + 1]) : ' '}
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

  changeSelectedPoint (newSelectedPoint) {
    this.setState({
      selectedPoint: newSelectedPoint
    })
  }

  fetchPoint () {
    fetch(this.props.backURL + '/points/' + this.state.selectedPoint._id, {
      mode: 'cors'
    })
    .then(response => {
      if (response.status === 200) {
        response.json()
        .then(fetchedPoint => {
          this.setState({
            fetchedPoint: this.fetchPoint
          })
        })
      } else console.log('Problems reaching the server')
    })
  }
}

export default MapContainer
