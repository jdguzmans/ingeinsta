/* global FileReader */

import React, { Component } from 'react'
import whilst from 'async/whilst'

import UploadMap from './UploadMap'
import Swal from 'sweetalert2'

export class Upload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      description: '',
      type: null,
      images: null,
      imagePreviewURLs: null,
      selectedImageCarouselIndex: null,
      lat: null,
      lng: null
    }

    this.changedDescription = this.changedDescription.bind(this)
    this.renderTypes = this.renderTypes.bind(this)
    this.changedType = this.changedType.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
    this.renderCarouselIndicators = this.renderCarouselIndicators.bind(this)
    this.renderUploadImages = this.renderUploadImages.bind(this)
    this.nextImageInCarrousel = this.nextImageInCarrousel.bind(this)
    this.previousImageInCarrousel = this.previousImageInCarrousel.bind(this)
    this.handlePositionChange = this.handlePositionChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.startLoading = this.startLoading.bind(this)
    this.finishLoading = this.finishLoading.bind(this)

    this.returnEverything = this.returnEverything.bind(this)
  }

  startLoading () {
    this.setState({
      loading: true
    })
  }

  finishLoading () {
    this.setState({
      loading: false
    })
  }

  handlePositionChange (lat, lng) {
    this.setState({
      lat: lat,
      lng: lng
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.startLoading()

    let point = {
      description: this.state.description,
      type: this.state.type,
      lat: this.state.lat,
      lng: this.state.lng,
      information: {
        images: this.state.images
      }
    }

    this.props.uploadPoint(point)
    .then(() => {
      Swal('Punto subido satisfactoriamente')
      this.setState({
        description: '',
        type: null,
        images: null,
        imagePreviewURLs: null,
        selectedImageCarouselIndex: null,
        lat: null,
        lng: null
      })
      this.finishLoading()
    })
  }

  handleImageChange (e) {
    let fileList = e.target.files
    let length = fileList.length

    let images = []
    let urls = []

    let i = 0
    whilst(
      () => {
        return i < length
      },
      (cb) => {
        let reader = new FileReader()
        let file = fileList[i]
        reader.onloadend = () => {
          images.push(file)
          urls.push(reader.result)
          cb()
        }
        reader.readAsDataURL(file)
        i++
      },
      (err) => {
        if (err) throw err
        this.setState({
          selectedImageCarouselIndex: 0,
          images: images,
          imageURLs: urls
        })
      }
    )
  }

  renderTypes () {
    return this.props.types.map((type, i) => {
      return (
        <div key={i} className='' >
          <input className='form-check-input' type='radio' id={'upload-radio-' + i} onClick={() => { this.changedType(type._id) }} checked={this.state.type === type._id} />
          <label className='form-check-label' htmlFor={'upload-radio-' + i}>
            {type.name}
          </label>
        </div>
      )
    })
  }

  changedType (typeId) {
    this.setState({
      type: typeId
    })
  }

  changedDescription (e) {
    this.setState({
      description: e.target.value
    })
  }

  renderCarouselIndicators () {
    return this.state.images.map((image, i) => {
      return (
        <li key={i} data-slide-to={i} className={i === this.state.selectedImageCarouselIndex ? 'active' : ''} />
      )
    })
  }

  renderUploadImages () {
    return this.state.imageURLs.map((url, i) => {
      let className = 'carousel-item ' + (i === this.state.selectedImageCarouselIndex ? 'active' : '')
      return (
        <div key={i} className={className}>
          <img className='d-block w-100' src={url} alt={'Slide}' + i} />
        </div>
      )
    })
  }

  nextImageInCarrousel () {
    this.setState({
      selectedImageCarouselIndex: (this.state.selectedImageCarouselIndex + 1) % this.state.images.length
    })
  }

  previousImageInCarrousel () {
    this.setState({
      selectedImageCarouselIndex: this.state.selectedImageCarouselIndex === 0 ? (this.state.images.length - 1) : (this.state.selectedImageCarouselIndex - 1)
    })
  }

  returnEverything () {
    return (
      <div className='container-fluid' >
        <div className='centered-text title'>
          <h3>Suba Puntos</h3>
        </div>
        <div className='row container-fluid'>
          <div className='padding-top col-sm-6 container-fluid navigation-filters'>
            <div className='container-fluid centered-text'>
              <label htmlFor='upload-description'><b>Descripción</b> (máximo 50 caracteres)</label>
              <textarea className='form-control' id='upload-description' rows='2' maxLength='50' value={this.state.description} onChange={this.changedDescription} />
            </div>
            <div className='padding-top'>
              <div className='centered-text'>
                <label htmlFor='upload-description' ><b>Tipo</b></label>
              </div>
              <div className='row'>
                <div className='col-8 offset-4' >
                  {this.renderTypes()}
                </div>
              </div>
            </div>
          </div>
          <div className='padding-top col-sm-6 container-fluid navigation-filters'>
            <UploadMap
              uploadPointIcon={this.props.uploadPointIcon}
              currentPosition={this.props.currentPosition}
              handlePositionChange={this.handlePositionChange}
                />
          </div>
        </div>

        <div className='row container-fluid padding-top navigation-filters'>
          <div className='col-sm-4 container-fluid centered-text'>
            <label><b>Imágenes</b></label>
          </div>
          <div className='col-sm-8 container-fluid centered-text'>
            <div className='row form-group container-fluid'>
              <input type='file' className='form-control-file' onChange={this.handleImageChange} accept='.jpg, .jpeg, .png' multiple />
            </div>
            {this.state.images &&
            <div className='carousel slide' data-ride='carousel'>
              <ol className='carousel-indicators'>
                {this.renderCarouselIndicators()}
              </ol>
              <div className='carousel-inner'>
                {this.renderUploadImages()}
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
          <div className='row container-fluid padding-top padding-bottom'>
            <div className='form-group offset-sm-4 col-sm-8' >
              <button className='btn btn-primary btn-sm' type='button' onClick={this.handleSubmit} disabled={!this.state.description || this.state.description.length === 0 || !this.state.type || !this.state.images}>Subir punto</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div>
        { this.state.loading
        ? <div className='loader' />
        : <div>{this.returnEverything()}</div>
      }
      </div>
    )
  }
}

export default Upload
