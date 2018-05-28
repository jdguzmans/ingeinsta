import React, { Component } from 'react'

class App extends Component {
  constructor (props) {
    super(props)
    console.log(navigator.geolocation)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log(pos.coords)
        },
        (err) => {
          console.log('ERROR' + err)
        }
      )
    }
  }

  render () {
    return (
      <div>
        <h1>H</h1>
      </div>
    )
  }
}

export default App
