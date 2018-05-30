import React, { Component } from 'react'

export class Point extends Component {
  constructor (props) {
    super(props)

    this.fetchPoint = this.fetchPoint.bind(this)
  }

  render () {
    return (
      <div className='container-fluid row centered' >
        <div className='col-sm-3'>
          <h4><b>Punto seleccionado</b></h4>
        </div>
        <div className='col-sm-6'>
          <div className='row'>
            <div className='col-sm-6'>
              <h5>Identificador</h5>
            </div>
            <div className='col-sm-6'>
              <h5>{this.props.selectedPoint._id}</h5>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
              <h5>Tipo</h5>
            </div>
            <div className='col-sm-6'>
              <h5>{this.props.selectedPoint.type.name}</h5>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
              <h5>Descripción</h5>
            </div>
            <div className='col-sm-6'>
              <h5>{this.props.selectedPoint.description}</h5>
            </div>
          </div>
        </div>
        <div className='col-sm-3'>
          <span className='anchor-link'>
            <h4><a className='anchor-link' onClick={this.props.fetchPoint} >Conozca más de este punto</a></h4>
          </span>
        </div>
      </div>
    )
  }

  fetchPoint () {
    console.log(88)
  }
}

export default Point
