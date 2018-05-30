import React, { Component } from 'react'

// https://gist.github.com/hartzis/0b77920380736f98e4f9

export class Upload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null,
      imagePreviewUrl: null
    }

    this.handleImageChange = this.handleImageChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    console.log(this.state.file)
  }

  handleImageChange (e) {
    let reader = new FileReader()
    let file = e.target.files[0]

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      })
    }

    reader.readAsDataURL(file)
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
            <div className='form-group'>
              <input type='file' className='form-control-file' onChange={this.handleImageChange} />
            </div>
            <img className='image-preview' alt='upload preview' src={this.state.imagePreviewUrl} />
            <div className='form-group' >
              <button type='submit' onClick={this.handleSubmit}>Subir imagen</button>
            </div>
          </form>
        }
      </div>
    )
  }
}

export default Upload
