import React, { Component } from 'react'

// https://gist.github.com/hartzis/0b77920380736f98e4f9

export class Point extends Component {
  render () {
    return (
      <div className='container-fluid' >
        <h1>HOL{this.props.showedPointId}</h1>
      </div>
    )
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    console.log(prevProps)
    console.log(this.props)
  }
}

export default Point
