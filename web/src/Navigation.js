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

    this.renderFilters = this.renderTypeFilters.bind(this)
    this.changedChexBox = this.changedChexBox.bind(this)
    this.changeSelectedPoint = this.changeSelectedPoint.bind(this)
    this.getPointInformation = this.getPointInformation.bind(this)
  }

  render () {
    return (
      <div>
        <div className='centered-text title'>
          <h3>Navegue</h3>
        </div>
        <div className='centered-text padding-top'>
          <h5>Cantidad total de puntos: {this.props.points.length}</h5>
        </div>
        <div className='row container-fluid padding-top navigation-filters'>
          <div className='col-sm-2 centered-text'>
            <h5><b>Filtros</b></h5>
          </div>
          <div className='padding-top row col-sm-10'>
            {this.renderTypeFilters()}
          </div>
          <NavigationMap
            types={this.props.types}
            currentPosition={this.props.currentPosition}
            points={this.state.points}
            changeSelectedPoint={this.changeSelectedPoint}
        />
        </div>

        {this.state.selectedPoint &&
          <Point
            types={this.props.types}
            selectedPoint={this.state.selectedPoint}
            getPointInformation={this.getPointInformation}
            selectedPointInformation={this.state.selectedPointInformation}
          />
        }

      </div>
    )
  }

  renderTypeFilters () {
    let toReturn = []

    let i = 0
    while (i < this.props.types.length) {
      toReturn.push(
        <div className='container-fluid row centered-text' key={i}>
          {this.renderTypeFilter(this.props.types[i])}
          {(i + 1) < this.props.types.length ? this.renderTypeFilter(this.props.types[i + 1]) : ' '}
        </div>
      )
      i = i + 2
    }
    return toReturn
  }

  renderTypeFilter (type) {
    let number = 0
    this.props.points.forEach(point => {
      number += point.type === type._id ? 1 : 0
    })

    return (
      <div className='col-sm-6 row' >
        <div className='col-5 offset-1 form-check left-text'>
          <input className='form-check-input'
            type='checkbox'
            checked={this.state.types[type._id]}
            onChange={(e) => {
              this.changedChexBox(e, type._id)
            }} />
          <label>
            {type.name}
          </label>
        </div>
        <div className='col-5 offset-1 right-text'>
          <label>
            {'(' + number + ')'}
          </label>
          <img src={type.url} alt='filter' className='image-filter' />
        </div>
      </div>

    )
  }

  changedChexBox (e, id) {
    let target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value

    let types = this.state.types
    types[id] = value

    let points = this.state.points
    if (value) {
      this.props.points.forEach(point => {
        if (point.type === id) points.push(point)
      })
    } else {
      points = this.state.points.filter(point => {
        return point.type !== id
      })
    }
    this.setState({
      types: types,
      points: points
    })
  }

  changeSelectedPoint (newSelectedPoint) {
    this.setState({
      selectedPoint: newSelectedPoint,
      selectedPointInformation: null
    })
  }

  getPointInformation (e) {
    e.preventDefault()
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
