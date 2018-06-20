import React, { Component } from 'react'

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
      <div>
        <div className='container-fluid row centered' >
          <div className='col-sm-3'>
            <h4><b>Punto seleccionado</b></h4>
          </div>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-sm-6'>
                <h5><b>Tipo</b></h5>
              </div>
              <div className='col-sm-6'>
                <h5>{type.name}</h5>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-6'>
                <h5><b>Descripción</b></h5>
              </div>
              <div className='col-sm-6'>
                <h5>{this.props.selectedPoint.description}</h5>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-6'>
                <h5><b>Fecha</b></h5>
              </div>
              <div className='col-sm-6'>
                <h5>{date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() }</h5>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-6'>
                <h5><b>Identificador</b></h5>
              </div>
              <div className='col-sm-6'>
                <h5>{this.props.selectedPoint._id}</h5>
              </div>
            </div>
          </div>
          <div className='col-sm-3'>
            <span className='anchor-link'>
              <h4><a href='' onClick={(e) => {
                this.props.getPointInformation(e)
              }} >
                Conozca más</a></h4>
            </span>
          </div>
        </div>
        {this.props.selectedPointInformation &&
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
        }
      </div>
    )
  }

  renderSelectedPointImages () {
    return this.props.selectedPointInformation.images.map((image, i) => {
      let src = 'https://s3.amazonaws.com/ingeinsta/' + this.props.selectedPoint._id + '-' + image.index + '.' + image.extension
      let className = 'carousel-item ' + (i === this.state.selectedImageCarouselIndex ? 'active' : '')
      let date = new Date(image.date)
      return (
        <div key={i} className={className}>
          <img className='d-block w-100' src={src} alt={'Slide}' + i} />
          <div className='carousel-caption d-none d-md-block'>
            <h5>Fecha: {date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() }</h5>
          </div>
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
