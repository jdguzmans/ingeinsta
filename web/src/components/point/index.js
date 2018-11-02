import React, { Component } from 'react'

const { IMAGE_URL } = require('../../config')

export class Point extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedImageCarouselIndex: 0
    }

    this.renderSelectedPointImages = this.renderSelectedPointImages.bind(this)
    this.renderCarouselIndicators = this.renderCarouselIndicators.bind(this)
    this.nextImageInCarrousel = this.nextImageInCarrousel.bind(this)
    this.previousImageInCarrousel = this.previousImageInCarrousel.bind(this)
  }

  render () {
    let date = new Date(this.props.selectedPoint.date)
    let type
    this.props.types.forEach(t => {
      type = t._id === this.props.selectedPoint.type ? t : type
    })

    return (
      <div className='padding-top navigation-filters' >
        <div className='centered-text'>
          <h5><b>Punto seleccionado</b></h5>
        </div>
        <div className='padding-top' >
          <div className='row'>
            <div className='col-5 right-text'>
              <h6><b>Tipo</b></h6>
            </div>
            <div className='col-6 offset-1 left-text'>
              <h6>{type.name}</h6>
            </div>
          </div>
          <div className='row'>
            <div className='col-5 right-text'>
              <h6><b>Descripción</b></h6>
            </div>
            <div className='col-6 offset-1 left-text'>
              <h6>{this.props.selectedPoint.description}</h6>
            </div>
          </div>
          <div className='row'>
            <div className='col-5 right-text'>
              <h6><b>Fecha</b></h6>
            </div>
            <div className='col-6 offset-1 left-text'>
              <h6>{date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() }</h6>
            </div>
          </div>
        </div>
        {this.props.selectedPointInformation
        ? <div className='padding-top' >
          <div className='carousel slide' data-ride='carousel'>
            <ol className='carousel-indicators'>
              {this.renderCarouselIndicators()}
            </ol>
            <div className='carousel-inner'>
              {this.renderSelectedPointImages()}
            </div>
            <a className='carousel-control-prev' data-slide='prev' onClick={this.previousImageInCarrousel}>
              <span className='carousel-control-prev-icon' aria-hidden='true' />
              <span className='sr-only'>Anterior</span>
            </a>
            <a className='carousel-control-next' data-slide='next' onClick={this.nextImageInCarrousel}>
              <span className='carousel-control-next-icon' aria-hidden='true' />
              <span className='sr-only'>Siguiente</span>
            </a>
          </div>
          <div className='padding-top centered-text'>
            <h6><i>Punto con identificador {this.props.selectedPoint._id}</i></h6>
          </div>
        </div>
        : <div className='padding-top centered-text'>
          <span className='anchor-link'>
            <h5><a href='' onClick={(e) => {
              this.props.getPointInformation(e)
            }} >
              Investigar punto</a></h5>
          </span>
        </div>
        }
      </div>
    )
  }

  renderSelectedPointImages () {
    return this.props.selectedPointInformation.images.map((image, i) => {
      let src = IMAGE_URL + this.props.selectedPoint._id + '-' + image.index + '.' + image.extension
      let className = 'carousel-item ' + (i === this.state.selectedImageCarouselIndex ? 'active' : '')
      let date = new Date(image.date)
      return (
        <div key={i}>
          <div className={className}>
            <img className='d-block w-100' src={src} alt={'Slide}' + i} />
          </div>
          {i === this.state.selectedImageCarouselIndex &&
          <div className='centered-text padding-top'>
            <h6><b>Fecha de esta imagen:</b> {date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() }</h6>
          </div>
          }
        </div>
      )
    })
  }

  renderCarouselIndicators () {
    return this.props.selectedPointInformation.images.map((image, i) => {
      return (
        <li key={i} data-slide-to={i} className={i === this.state.selectedImageCarouselIndex ? 'active' : ''} />
      )
    })
  }

  nextImageInCarrousel () {
    this.setState({
      selectedImageCarouselIndex: (this.state.selectedImageCarouselIndex + 1) % this.props.selectedPointInformation.images.length
    })
  }

  previousImageInCarrousel () {
    this.setState({
      selectedImageCarouselIndex: this.state.selectedImageCarouselIndex === 0 ? (this.props.selectedPointInformation.images.length - 1) : (this.state.selectedImageCarouselIndex - 1) % this.props.selectedPointInformation.images.length
    })
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevState.selectedImageCarouselIndex !== 0 && (prevProps.selectedPointInformation !== this.props.selectedPointInformation)) {
      this.setState({
        selectedImageCarouselIndex: 0
      })
    }
  }
}

export default Point
