/* global FileReader */

import React, { Component } from 'react'

// https://gist.github.com/hartzis/0b77920380736f98e4f9

export class Upload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      description: null,
      type: null,
      images: null,
      imagePreviewURLs: null,
      file: null,
      imagePreviewUrl: null
    }

    this.changedDescription = this.changedDescription.bind(this)
    this.renderTypes = this.renderTypes.bind(this)
    this.changedType = this.changedType.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
  }

  handleImageChange (e) {
    let reader = new FileReader()
    console.log(e.target.files)
    let file = e.target.files[0]

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      })
    }

    reader.readAsDataURL(file)
  }

  renderTypes () {
    return this.props.types.map((type, i) => {
      return (
        <div key={i} className='form-check'>
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

  changedDescription (description) {
    this.setState({
      description: description
    })
  }

  render () {
    return (
      <div className='container-fluid' >
        <div className='centered title'>
          <h3>Suba Puntos</h3>
        </div>
        <div className='centered' >
          <h5>Sólo se permite crear puntos desde un dispositivo móvil, con fotografías tomadas instantánemente.</h5>
        </div>
        {this.props.canUpload &&
          <form onSubmit={this.handleSubmit}>
            <div className='container-fluid'>
              <div className='row container-fluid padding-top'>
                <div className='col-sm-4 container-fluid centered'>
                  <label htmlFor='upload-description'>Descripción (máximo 50 caracteres)</label>
                </div>
                <div className='col-sm-8 container-fluid'>
                  <textarea className='form-control' id='upload-description' rows='2' maxLength='50' onChange={this.changedDescription} />
                </div>
              </div>
              <div className='row container-fluid padding-top'>
                <div className='col-sm-4 container-fluid centered'>
                  <label htmlFor='upload-description'>Tipo</label>
                </div>
                <div className='col-sm-8 container-fluid centered'>
                  {this.renderTypes()}
                </div>
              </div>
              <div className='row container-fluid padding-top'>
                <div className='col-sm-4 container-fluid centered'>
                  <label>Imágenes</label>
                </div>
                <div className='col-sm-8 container-fluid centered'>
                  <div className='row form-group container-fluid'>
                    <input type='file' className='form-control-file' onChange={this.handleImageChange} accept='.jpg, .jpeg, .png' multiple />
                  </div>
                  {this.state.file &&
                    <img className='image-preview' alt='upload preview' src={this.state.imagePreviewUrl} />
                  }
                  {this.state.images &&
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
                <div className='row container-fluid padding-bottom'>
                  <div className='form-group offset-sm-4 col-sm-8' >
                    <button type='submit' onClick={this.handleSubmit} disabled={!this.state.description || !this.state.type}>Subir punto</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        }
      </div>
    )
  }
}

export default Upload
