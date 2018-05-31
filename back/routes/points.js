const express = require('express')
const router = express.Router()

const pointsLogic = require('./../logic/points')
const pointInformationLogic = require('./../logic/pointInformation')

router.get('/', (req, res, next) => {
  pointsLogic.findAllPoints()
  .then(points => {
    res.send(points)
  })
})

router.get('/:pointId/information', (req, res, next) => {
  let pointId = req.params.pointId

  pointInformationLogic.findPointInformationById(pointId)
  .then(point => {
    res.send(point)
  })
})

module.exports = router
