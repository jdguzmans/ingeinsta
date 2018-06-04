const express = require('express')
const router = express.Router()

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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

router.post('/', upload.any(), (req, res, next) => {
  let point = req.body

  let description = point.description
  let type = point.type
  let lat = Number(point.lat)
  let lng = Number(point.lng)
  let information = {
    images: []
  }

  let files = req.files
  files.forEach(file => {
    let parts = file.originalname.split('.')
    let extension = parts[parts.length - 1]
    information.images.push({
      buffer: file.buffer,
      extension: extension
    })
  })

  pointsLogic.insertPoint(description, type, lat, lng, information)
  .then(point => {
    res.send(point)
  })
})

module.exports = router
