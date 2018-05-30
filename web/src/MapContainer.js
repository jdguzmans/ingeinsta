import React, { Component } from 'react'

import Map from './Map'

export class MapContainer extends Component {
  constructor (props) {
    super(props)
    this.renderFilters = this.renderFilters.bind(this)
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
          />
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
}

export default MapContainer
