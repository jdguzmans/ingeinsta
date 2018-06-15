import React, { Component } from 'react'

export default class Navbar extends Component {
  constructor (props) {
    super(props)
    this.renderSections = this.renderSections.bind(this)
  }

  renderSections () {
    return this.props.sections.map((section, i, a) => {
      return (
        <li key={i}>
          <a
            className={'nav-link ' + (this.props.section === section ? 'selected' : '')}
            href=''
            onClick={(e) => {
              e.preventDefault()
              this.props.changeSection(i)
            }}
          >{section} <span className='sr-only'>(current)</span></a>
        </li>
      )
    })
  }

  render () {
    return (
      <nav className='navbar navbar-expand-sm navbar-dark'>
        <a
          className={'navbar-brand ' + (this.props.section === 'Home' ? 'selected' : '')}
          href=''
          onClick={(e) => {
            e.preventDefault()
            this.props.changeSection(this.props.sections.length)
          }}
        >
          {this.props.title}
        </a>
        <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon' />
        </button>

        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav mr-auto'>
            {this.renderSections()}
          </ul>
        </div>
      </nav>
    )
  }
}