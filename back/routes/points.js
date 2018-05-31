const express = require('express')
const router = express.Router()

const pointsLogic = require('./../logic/points')

router.get('/', (req, res, next) => {
  pointsLogic.findAllPoints()
  .then(points => {
    res.send(points)
  })
})

router.get('/:pointId', (req, res, next) => {
  let pointId = req.params.pointId

  pointsLogic.findPointById(pointId)
  .then(point => {
    res.send(point)
  })
})

module.exports = router
