var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
  let points = [{
    _id: 0,
    lat: 4.6837668,
    lng: -74.0524933,
    type: 0,
    description: 'Hueco en la 100 con 19'
  }, {
    _id: 1,
    lat: 4.697668,
    lng: -74.0624933,
    type: 1,
    description: 'Semáforo'
  }]
  res.send(points)
})

module.exports = router
