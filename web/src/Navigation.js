import React, { Component } from 'react'

import NavigationMap from './NavigationMap'
import Point from './Point'

export class Navigation extends Component {
  constructor (props) {
    super(props)

    let types = {}
    props.types.forEach(type => {
      types[type._id] = true
    })

    this.state = {
      selectedPoint: null,
      selectedPointInformation: null,
      points: props.points,
      types: types
    }

    this.renderFilters = this.renderFilters.bind(this)
    this.changedChexBox = this.changedChexBox.bind(this)
    this.changeSelectedPoint = this.changeSelectedPoint.bind(this)
    this.getPointInformation = this.getPointInformation.bind(this)
  }

  render () {
    return (
      <div className='container-fluid row'>
        <div className='container-fluid col-sm-3 centered'>
          <h5>Filtros</h5>
        </div>
        <div className='container-fluid row col-sm-9'>
          {this.renderFilters()}
        </div>
        <NavigationMap
          icons={this.props.icons}
          types={this.props.types}
          currentPosition={this.props.currentPosition}
          points={this.state.points}
          changeSelectedPoint={this.changeSelectedPoint}
        />
        {this.state.selectedPoint &&
        <div className='point'>
          <Point
            selectedPoint={this.state.selectedPoint}
            getPointInformation={this.getPointInformation}
            selectedPointInformation={this.state.selectedPointInformation}
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

  changedChexBox (e, id) {
    let target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value

    let types = this.state.types
    types[id] = value

    let points = this.state.points
    if (value) {
      this.props.points.forEach(point => {
        if (point.type._id === id) points.push(point)
      })
    } else {
      points = this.state.points.filter(point => {
        return point.type._id !== id
      })
    }
    this.setState({
      types: types,
      points: points
    })
  }

  renderTypeFilter (type) {
    return (
      <div className='col-sm-6 form-check' >
        <input className='form-check-input'
          type='checkbox'
          checked={this.state.types[type._id]}
          onChange={(e) => {
            this.changedChexBox(e, type._id)
          }} />
        <label className='form-check-label'>
          {type.name}
        </label>
      </div>
    )
  }

  changeSelectedPoint (newSelectedPoint) {
    this.setState({
      selectedPoint: newSelectedPoint,
      selectedPointInformation: null
    })
  }

  getPointInformation () {
    if (!this.state.selectedPointInformation || this.state.selectedPoint._id !== this.state.selectedPointInformation._id) {
      fetch(this.props.backURL + '/points/' + this.state.selectedPoint._id + '/information', {
        mode: 'cors'
      })
      .then(response => {
        if (response.status === 200) {
          response.json()
          .then(pointInformation => {
            this.setState({
              selectedPointInformation: pointInformation
            })
          })
        } else console.log('Problems reaching the server')
      })
    }
  }
}

export default Navigation
