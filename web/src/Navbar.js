import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Navbar extends Component {
  render () {
    return (
      <nav className='navbar navbar-expand-sm navbar-dark'>
        <Link className='navbar-brand' replace to={'/'}>
          Ingeinsta
        </Link>
        <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon' />
        </button>

        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav mr-auto'>
            <Link className='nav-link' replace to={'/navigate'}>
              Navegar
            </Link>
            <Link className='nav-link' replace to={'/upload'}>
              Subir
            </Link>
          </ul>
        </div>
      </nav>
    )
  }
}
