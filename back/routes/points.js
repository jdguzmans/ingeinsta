var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
  let points = [{
    id: 0,
    lat: 4.6837668,
    lng: -74.0524933,
    type: 'Pavimento',
    description: 'Hueco en la 100 con 19'
  }, {
    id: 1,
    lat: 4.697668,
    lng: -74.0624933,
    type: 'Pavimento',
    description: 'Semáforo'
  }]
  res.send(points)
})

module.exports = router
